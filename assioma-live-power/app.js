const CYCLING_POWER_SERVICE = 0x1818;
const CYCLING_POWER_MEASUREMENT_CHAR = 0x2a63;

const HEART_RATE_SERVICE = 0x180d;
const HEART_RATE_MEASUREMENT_CHAR = 0x2a37;

const connectBtn = document.getElementById("connectBtn");
const connectHrBtn = document.getElementById("connectHrBtn");
const wattsEl = document.getElementById("watts");
const heartRateEl = document.getElementById("heartRate");
const statusEl = document.getElementById("status");
const avg3mEl = document.getElementById("avg3m");
const avg5mEl = document.getElementById("avg5m");
const avg10mEl = document.getElementById("avg10m");
const hrAvg3mEl = document.getElementById("hrAvg3m");
const hrAvg5mEl = document.getElementById("hrAvg5m");
const hrAvg10mEl = document.getElementById("hrAvg10m");
const wpHr3mEl = document.getElementById("wpHr3m");
const wpHr5mEl = document.getElementById("wpHr5m");
const wpHr10mEl = document.getElementById("wpHr10m");
const targetKjEl = document.getElementById("targetKj");
const startRideBtn = document.getElementById("startRideBtn");
const rideDoneEl = document.getElementById("rideDone");
const rideRemainingEl = document.getElementById("rideRemaining");
const rideEtaEl = document.getElementById("rideEta");
const rideProgressFillEl = document.getElementById("rideProgressFill");
const rideProgressTrackEl = rideProgressFillEl?.parentElement;

const rollingSamples = [];
const powerSamples = [];
const WINDOWS_IN_MS = {
  "3m": 3 * 60 * 1000,
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
};

let powerDevice;
let heartRateDevice;
let latestPowerWatts = null;
let latestHeartRateBpm = null;
let rideState = null;
let lastPowerSampleTimestamp = null;

connectBtn.addEventListener("click", connectPowerMeter);
connectHrBtn.addEventListener("click", connectHeartRateMonitor);
startRideBtn.addEventListener("click", startRideRecording);

updateRideProgressUi();
setInterval(updateRideProgressUi, 1000);

async function connectPowerMeter() {
  if (!navigator.bluetooth) {
    setStatus("Web Bluetooth not available in this browser.");
    return;
  }

  connectBtn.disabled = true;
  setStatus("Opening power meter picker...");

  try {
    powerDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [CYCLING_POWER_SERVICE] }],
      optionalServices: [CYCLING_POWER_SERVICE],
    });

    powerDevice.addEventListener("gattserverdisconnected", onPowerDisconnected);

    setStatus(`Connecting to ${powerDevice.name || "power meter"}...`);

    const server = await powerDevice.gatt.connect();
    const service = await server.getPrimaryService(CYCLING_POWER_SERVICE);
    const characteristic = await service.getCharacteristic(
      CYCLING_POWER_MEASUREMENT_CHAR,
    );

    await characteristic.startNotifications();
    characteristic.addEventListener(
      "characteristicvaluechanged",
      handlePowerNotification,
    );

    setStatus(`Connected to ${powerDevice.name || "power meter"}`);
  } catch (error) {
    setStatus(`Power meter connection failed: ${error.message}`);
    connectBtn.disabled = false;
  }
}

async function connectHeartRateMonitor() {
  if (!navigator.bluetooth) {
    setStatus("Web Bluetooth not available in this browser.");
    return;
  }

  connectHrBtn.disabled = true;
  setStatus("Opening heart rate monitor picker...");

  try {
    heartRateDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [HEART_RATE_SERVICE] }],
      optionalServices: [HEART_RATE_SERVICE],
    });

    heartRateDevice.addEventListener(
      "gattserverdisconnected",
      onHeartRateDisconnected,
    );

    setStatus(`Connecting to ${heartRateDevice.name || "heart rate monitor"}...`);

    const server = await heartRateDevice.gatt.connect();
    const service = await server.getPrimaryService(HEART_RATE_SERVICE);
    const characteristic = await service.getCharacteristic(
      HEART_RATE_MEASUREMENT_CHAR,
    );

    await characteristic.startNotifications();
    characteristic.addEventListener(
      "characteristicvaluechanged",
      handleHeartRateNotification,
    );

    setStatus(`Connected to ${heartRateDevice.name || "heart rate monitor"}`);
  } catch (error) {
    setStatus(`Heart rate monitor connection failed: ${error.message}`);
    connectHrBtn.disabled = false;
  }
}


function startRideRecording() {
  const targetKj = Number(targetKjEl.value);

  if (!Number.isFinite(targetKj) || targetKj <= 0) {
    setStatus("Enter a valid ride target in kJ before starting.");
    return;
  }

  rideState = {
    targetKj,
    startTimestamp: Date.now(),
    doneKj: 0,
    completed: false,
  };
  lastPowerSampleTimestamp = null;

  setStatus(`Ride recording started for ${Math.round(targetKj)} kJ target.`);
  updateRideProgressUi();
}

function calculateRideStats() {
  if (!rideState) {
    return null;
  }

  const doneKj = Math.min(rideState.doneKj, rideState.targetKj);
  const remainingKj = Math.max(rideState.targetKj - doneKj, 0);
  const avg3mWatts = getWindowAveragePower(Date.now(), WINDOWS_IN_MS["3m"]);
  const etaSeconds = avg3mWatts > 0 ? Math.round((remainingKj * 1000) / avg3mWatts) : null;
  const percentComplete = (doneKj / rideState.targetKj) * 100;

  return { doneKj, remainingKj, etaSeconds, percentComplete };
}

function getWindowAveragePower(now, windowMs) {
  const startTime = now - windowMs;
  const samplesInWindow = powerSamples.filter((sample) => sample.timestamp >= startTime);

  if (samplesInWindow.length === 0) {
    return null;
  }

  const totalPower = samplesInWindow.reduce((sum, sample) => sum + sample.watts, 0);
  return totalPower / samplesInWindow.length;
}

function formatDuration(seconds) {
  if (seconds == null || !Number.isFinite(seconds)) {
    return "--";
  }

  const safeSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(secs).padStart(2, "0")}s`;
}

function updateRideProgressUi() {
  if (!rideState) {
    rideDoneEl.textContent = "Done: -- kJ";
    rideRemainingEl.textContent = "Remaining: -- kJ";
    rideEtaEl.textContent = "ETA: --";
    rideProgressFillEl.style.width = "0%";
    rideProgressTrackEl?.setAttribute("aria-valuenow", "0");
    return;
  }

  const stats = calculateRideStats();
  if (!stats) {
    return;
  }

  const percent = Math.min(100, Math.max(0, stats.percentComplete));
  rideDoneEl.textContent = `Done: ${stats.doneKj.toFixed(1)} kJ`;
  rideRemainingEl.textContent = `Remaining: ${stats.remainingKj.toFixed(1)} kJ`;
  rideEtaEl.textContent = stats.remainingKj <= 0 ? "ETA: Completed" : `ETA: ${formatDuration(stats.etaSeconds)}`;
  rideProgressFillEl.style.width = `${percent.toFixed(1)}%`;
  rideProgressTrackEl?.setAttribute("aria-valuenow", percent.toFixed(1));

  if (stats.remainingKj <= 0 && !rideState.completed) {
    rideState.completed = true;
    setStatus(`Ride target complete: ${rideState.targetKj} kJ done.`);
  }
}

function handlePowerNotification(event) {
  const value = event.target.value;
  const watts = value.getInt16(2, true);

  latestPowerWatts = watts;
  wattsEl.textContent = watts;

  const now = Date.now();
  addPowerSample(watts, now);
  accumulateRideEnergy(watts, now);

  maybeAddRollingSample();
  updateRollingAverages();
  updateRideProgressUi();
}

function addPowerSample(watts, timestamp) {
  powerSamples.push({ watts, timestamp });
  prunePowerSamples(timestamp);
}

function prunePowerSamples(now) {
  const oldestAllowed = now - WINDOWS_IN_MS["10m"];
  while (powerSamples.length > 0 && powerSamples[0].timestamp < oldestAllowed) {
    powerSamples.shift();
  }
}

function accumulateRideEnergy(watts, timestamp) {
  if (!rideState) {
    lastPowerSampleTimestamp = timestamp;
    return;
  }

  if (lastPowerSampleTimestamp == null) {
    lastPowerSampleTimestamp = timestamp;
    return;
  }

  const elapsedSeconds = Math.max(0, (timestamp - lastPowerSampleTimestamp) / 1000);
  const cappedElapsedSeconds = Math.min(elapsedSeconds, 5);
  rideState.doneKj += (watts * cappedElapsedSeconds) / 1000;
  lastPowerSampleTimestamp = timestamp;
}

function handleHeartRateNotification(event) {
  const value = event.target.value;
  const flags = value.getUint8(0);
  const isHeartRate16Bit = (flags & 0x01) !== 0;
  const heartRate = isHeartRate16Bit ? value.getUint16(1, true) : value.getUint8(1);

  latestHeartRateBpm = heartRate;
  heartRateEl.textContent = heartRate;
  maybeAddRollingSample();
  updateRollingAverages();
  updateRideProgressUi();
}

function maybeAddRollingSample() {
  if (latestPowerWatts == null || latestHeartRateBpm == null) {
    return;
  }

  const now = Date.now();
  rollingSamples.push({
    watts: latestPowerWatts,
    heartRate: latestHeartRateBpm,
    timestamp: now,
  });

  pruneRollingSamples(now);
}

function pruneRollingSamples(now) {
  const oldestAllowed = now - WINDOWS_IN_MS["10m"];
  while (rollingSamples.length > 0 && rollingSamples[0].timestamp < oldestAllowed) {
    rollingSamples.shift();
  }
}

function updateRollingAverages() {
  const now = Date.now();
  pruneRollingSamples(now);

  setWindowMetrics(now, WINDOWS_IN_MS["3m"], avg3mEl, hrAvg3mEl, wpHr3mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["5m"], avg5mEl, hrAvg5mEl, wpHr5mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["10m"], avg10mEl, hrAvg10mEl, wpHr10mEl);
}

function setWindowMetrics(now, windowMs, powerEl, heartRateAvgEl, wpHrEl) {
  const avgPower = getWindowAveragePower(now, windowMs);
  const startTime = now - windowMs;
  const samplesInWindow = rollingSamples.filter((sample) => sample.timestamp >= startTime);

  if (samplesInWindow.length === 0 || avgPower == null) {
    powerEl.textContent = "--";
    heartRateAvgEl.textContent = "--";
    wpHrEl.textContent = "--";
    return;
  }

  const totalHeartRate = samplesInWindow.reduce(
    (sum, sample) => sum + sample.heartRate,
    0,
  );

  const avgHeartRate = totalHeartRate / samplesInWindow.length;

  powerEl.textContent = Math.round(avgPower);
  heartRateAvgEl.textContent = Math.round(avgHeartRate);

  if (avgHeartRate <= 0) {
    wpHrEl.textContent = "--";
    return;
  }

  const wattsPerHeartRate = avgPower / avgHeartRate;
  wpHrEl.textContent = wattsPerHeartRate.toFixed(2);
}

function onPowerDisconnected() {
  setStatus("Power meter disconnected. Reconnect to continue.");
  connectBtn.disabled = false;
}

function onHeartRateDisconnected() {
  setStatus("Heart rate monitor disconnected. Reconnect to continue.");
  connectHrBtn.disabled = false;
}

function setStatus(message) {
  statusEl.textContent = message;
}
