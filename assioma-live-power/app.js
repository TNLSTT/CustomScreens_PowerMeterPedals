const CYCLING_POWER_SERVICE = 0x1818;
const CYCLING_POWER_MEASUREMENT_CHAR = 0x2a63;

const connectBtn = document.getElementById("connectBtn");
const wattsEl = document.getElementById("watts");
const statusEl = document.getElementById("status");
const avg3mEl = document.getElementById("avg3m");
const avg5mEl = document.getElementById("avg5m");
const avg10mEl = document.getElementById("avg10m");

const rollingSamples = [];
const WINDOWS_IN_MS = {
  "3m": 3 * 60 * 1000,
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
};

let device;

connectBtn.addEventListener("click", connectPowerMeter);

async function connectPowerMeter() {
  if (!navigator.bluetooth) {
    setStatus("Web Bluetooth not available in this browser.");
    return;
  }

  connectBtn.disabled = true;
  setStatus("Opening Bluetooth picker...");

  try {
    // Ask for a BLE device that advertises the Cycling Power service.
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [CYCLING_POWER_SERVICE] }],
      optionalServices: [CYCLING_POWER_SERVICE],
    });

    device.addEventListener("gattserverdisconnected", onDisconnected);

    setStatus(`Connecting to ${device.name || "power meter"}...`);

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(CYCLING_POWER_SERVICE);
    const characteristic = await service.getCharacteristic(
      CYCLING_POWER_MEASUREMENT_CHAR,
    );

    await characteristic.startNotifications();
    characteristic.addEventListener(
      "characteristicvaluechanged",
      handlePowerNotification,
    );

    setStatus(`Connected to ${device.name || "power meter"}`);
  } catch (error) {
    setStatus(`Connection failed: ${error.message}`);
    connectBtn.disabled = false;
  }
}

function handlePowerNotification(event) {
  const value = event.target.value;

  // Cycling Power Measurement format:
  // bytes 0-1: flags
  // bytes 2-3: instantaneous power in watts (signed 16-bit little-endian)
  const watts = value.getInt16(2, true);

  wattsEl.textContent = watts;
  addRollingSample(watts);
  updateRollingAverages();
}

function addRollingSample(watts) {
  const now = Date.now();
  rollingSamples.push({ watts, timestamp: now });

  const oldestAllowed = now - WINDOWS_IN_MS["10m"];
  while (rollingSamples.length > 0 && rollingSamples[0].timestamp < oldestAllowed) {
    rollingSamples.shift();
  }
}

function updateRollingAverages() {
  const now = Date.now();

  avg3mEl.textContent = formatAverage(now, WINDOWS_IN_MS["3m"]);
  avg5mEl.textContent = formatAverage(now, WINDOWS_IN_MS["5m"]);
  avg10mEl.textContent = formatAverage(now, WINDOWS_IN_MS["10m"]);
}

function formatAverage(now, windowMs) {
  const startTime = now - windowMs;
  const samplesInWindow = rollingSamples.filter((sample) => sample.timestamp >= startTime);

  if (samplesInWindow.length === 0) {
    return "--";
  }

  const total = samplesInWindow.reduce((sum, sample) => sum + sample.watts, 0);
  return Math.round(total / samplesInWindow.length);
}

function onDisconnected() {
  setStatus("Disconnected. Press connect to reconnect.");
  connectBtn.disabled = false;
}

function setStatus(message) {
  statusEl.textContent = message;
}
