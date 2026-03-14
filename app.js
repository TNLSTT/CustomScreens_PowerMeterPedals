const CYCLING_POWER_SERVICE = 0x1818;
const CYCLING_POWER_MEASUREMENT_CHAR = 0x2a63;

const HEART_RATE_SERVICE = 0x180d;
const HEART_RATE_MEASUREMENT_CHAR = 0x2a37;

const MAX_AUTO_RECONNECT_ATTEMPTS = 5;
const AUTO_RECONNECT_INTERVAL_MS = 3000;
const TARGET_RIDE_AVG_HEART_RATE = 135;
const BREATHS_PER_BEAT_FACTOR = 0.26;

const connectBtn = document.getElementById("connectBtn");
const connectHrBtn = document.getElementById("connectHrBtn");
const buttonGridEl = document.querySelector(".button-grid");
const wattsEl = document.getElementById("watts");
const heartRateEl = document.getElementById("heartRate");
const statusEl = document.getElementById("status");
const avg1mEl = document.getElementById("avg1m");
const avg3mEl = document.getElementById("avg3m");
const avg5mEl = document.getElementById("avg5m");
const avg10mEl = document.getElementById("avg10m");
const avg20mEl = document.getElementById("avg20m");
const pv1mEl = document.getElementById("pv1m");
const pv3mEl = document.getElementById("pv3m");
const pv5mEl = document.getElementById("pv5m");
const pv10mEl = document.getElementById("pv10m");
const pv20mEl = document.getElementById("pv20m");
const hrAvg1mEl = document.getElementById("hrAvg1m");
const hrAvg3mEl = document.getElementById("hrAvg3m");
const hrAvg5mEl = document.getElementById("hrAvg5m");
const hrAvg10mEl = document.getElementById("hrAvg10m");
const hrAvg20mEl = document.getElementById("hrAvg20m");
const hrAdherence1mEl = document.getElementById("hrAdherence1m");
const hrAdherence3mEl = document.getElementById("hrAdherence3m");
const hrAdherence5mEl = document.getElementById("hrAdherence5m");
const hrAdherence10mEl = document.getElementById("hrAdherence10m");
const hrAdherence20mEl = document.getElementById("hrAdherence20m");
const cadAvg1mEl = document.getElementById("cadAvg1m");
const cadAvg3mEl = document.getElementById("cadAvg3m");
const cadAvg5mEl = document.getElementById("cadAvg5m");
const cadAvg10mEl = document.getElementById("cadAvg10m");
const cadAvg20mEl = document.getElementById("cadAvg20m");
const wpHr1mEl = document.getElementById("wpHr1m");
const wpHr3mEl = document.getElementById("wpHr3m");
const wpHr5mEl = document.getElementById("wpHr5m");
const wpHr10mEl = document.getElementById("wpHr10m");
const wpHr20mEl = document.getElementById("wpHr20m");
const breathsPerMinuteEl = document.getElementById("breathsPerMinute");
const breathsPerKj3mEl = document.getElementById("breathsPerKj3m");
const breathsPerKjRideEl = document.getElementById("breathsPerKjRide");
const rideAvgHrEl = document.getElementById("rideAvgHr");
const rideHrAdherenceEl = document.getElementById("rideHrAdherence");
const targetHrInputEl = document.getElementById("targetHrInput");
const targetGuidanceLabelEl = document.getElementById("targetGuidanceLabel");
const remainingWorkGuidanceEl = document.getElementById("remainingWorkGuidance");
const targetGuidanceWattsEl = document.getElementById("targetGuidanceWatts");
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
  "1m": 1 * 60 * 1000,
  "3m": 3 * 60 * 1000,
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
  "20m": 20 * 60 * 1000,
};
const MAX_WINDOW_MS = WINDOWS_IN_MS["20m"];

let powerDevice;
let heartRateDevice;
let powerCharacteristic;
let heartRateCharacteristic;
let latestPowerWatts = null;
let latestHeartRateBpm = null;
let latestCadenceRpm = null;
let previousCrankData = null;
let rideState = null;
let lastPowerSampleTimestamp = null;
let powerConnected = false;
let heartRateConnected = false;
let rideHeartRateSamples = [];

connectBtn.addEventListener("click", connectPowerMeter);
connectHrBtn.addEventListener("click", connectHeartRateMonitor);
startRideBtn.addEventListener("click", startRideRecording);
targetHrInputEl?.addEventListener("input", () => {
  updateTargetGuidanceLabel();
  recomputeRideHeartRateTotals();
  updateRollingAverages();
  updateGuidancePanel();
});

updateConnectionButtonLayout();
updateTargetGuidanceLabel();
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

    await establishPowerConnection();
    powerConnected = true;
    updateConnectionButtonLayout();
    setStatus(`Connected to ${powerDevice.name || "power meter"}`);
  } catch (error) {
    powerConnected = false;
    updateConnectionButtonLayout();
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

    await establishHeartRateConnection();
    heartRateConnected = true;
    updateConnectionButtonLayout();
    setStatus(`Connected to ${heartRateDevice.name || "heart rate monitor"}`);
  } catch (error) {
    heartRateConnected = false;
    updateConnectionButtonLayout();
    setStatus(`Heart rate monitor connection failed: ${error.message}`);
    connectHrBtn.disabled = false;
  }
}

async function establishPowerConnection() {
  setStatus(`Connecting to ${powerDevice.name || "power meter"}...`);
  const server = await powerDevice.gatt.connect();
  const service = await server.getPrimaryService(CYCLING_POWER_SERVICE);
  powerCharacteristic = await service.getCharacteristic(CYCLING_POWER_MEASUREMENT_CHAR);

  await powerCharacteristic.startNotifications();
  powerCharacteristic.removeEventListener("characteristicvaluechanged", handlePowerNotification);
  powerCharacteristic.addEventListener("characteristicvaluechanged", handlePowerNotification);
}

async function establishHeartRateConnection() {
  setStatus(`Connecting to ${heartRateDevice.name || "heart rate monitor"}...`);
  const server = await heartRateDevice.gatt.connect();
  const service = await server.getPrimaryService(HEART_RATE_SERVICE);
  heartRateCharacteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT_CHAR);

  await heartRateCharacteristic.startNotifications();
  heartRateCharacteristic.removeEventListener("characteristicvaluechanged", handleHeartRateNotification);
  heartRateCharacteristic.addEventListener("characteristicvaluechanged", handleHeartRateNotification);
}

function updateConnectionButtonLayout() {
  if (!buttonGridEl) {
    return;
  }

  const isAnyConnected = powerConnected || heartRateConnected;
  buttonGridEl.classList.toggle("compact", isAnyConnected);
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
    totalBreaths: 0,
    hrSum: 0,
    hrCount: 0,
    hrAbsErrorSum: 0,
  };
  lastPowerSampleTimestamp = null;
  rideHeartRateSamples = [];

  setStatus(`Ride recording started for ${Math.round(targetKj)} kJ target.`);
  updateStartButtonVisibility();
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
    updateBreathingMetrics();
    updateGuidancePanel();
    updateStartButtonVisibility();
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
  updateBreathingMetrics();
  updateGuidancePanel();
  updateStartButtonVisibility();

  if (stats.remainingKj <= 0 && !rideState.completed) {
    rideState.completed = true;
    setStatus(`Ride target complete: ${rideState.targetKj} kJ done.`);
  }
}

function updateStartButtonVisibility() {
  if (!startRideBtn) {
    return;
  }

  const isRecording = Boolean(rideState && !rideState.completed);
  startRideBtn.style.display = isRecording ? "none" : "inline-flex";
}

function handlePowerNotification(event) {
  const value = event.target.value;
  const flags = value.getUint16(0, true);
  const watts = value.getInt16(2, true);

  latestPowerWatts = watts;
  latestCadenceRpm = parseCadenceFromPowerMeasurement(value, flags);
  wattsEl.textContent = watts;

  const now = Date.now();
  addPowerSample(watts, now);
  accumulateRideEnergy(watts, now);

  maybeAddRollingSample();
  updateRollingAverages();
  updateRideProgressUi();
}


function parseCadenceFromPowerMeasurement(value, flags) {
  const CRANK_REV_PRESENT_FLAG = 0x20;
  if ((flags & CRANK_REV_PRESENT_FLAG) === 0) {
    previousCrankData = null;
    return null;
  }

  const crankDataOffset = getCrankDataOffset(flags);
  if (crankDataOffset == null || value.byteLength < crankDataOffset + 4) {
    return null;
  }

  const cumulativeCrankRevs = value.getUint16(crankDataOffset, true);
  const lastCrankEventTime = value.getUint16(crankDataOffset + 2, true);

  if (!previousCrankData) {
    previousCrankData = { cumulativeCrankRevs, lastCrankEventTime };
    return null;
  }

  const deltaRevs = (cumulativeCrankRevs - previousCrankData.cumulativeCrankRevs + 65536) % 65536;
  const deltaEventTime = (lastCrankEventTime - previousCrankData.lastCrankEventTime + 65536) % 65536;

  previousCrankData = { cumulativeCrankRevs, lastCrankEventTime };

  if (deltaRevs === 0 || deltaEventTime === 0) {
    return null;
  }

  return (deltaRevs * 60 * 1024) / deltaEventTime;
}

function getCrankDataOffset(flags) {
  const PEDAL_POWER_BALANCE_PRESENT_FLAG = 0x01;
  const ACCUMULATED_TORQUE_PRESENT_FLAG = 0x04;
  const WHEEL_REV_PRESENT_FLAG = 0x10;

  let offset = 4;

  if (flags & PEDAL_POWER_BALANCE_PRESENT_FLAG) {
    offset += 1;
  }

  if (flags & ACCUMULATED_TORQUE_PRESENT_FLAG) {
    offset += 2;
  }

  if (flags & WHEEL_REV_PRESENT_FLAG) {
    offset += 6;
  }

  return offset;
}

function addPowerSample(watts, timestamp) {
  powerSamples.push({ watts, timestamp });
  prunePowerSamples(timestamp);
}

function prunePowerSamples(now) {
  const oldestAllowed = now - MAX_WINDOW_MS;
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

  if (rideState) {
    const targetHr = getTargetHeartRate();
    rideState.hrSum += heartRate;
    rideState.hrCount += 1;
    rideHeartRateSamples.push(heartRate);
    if (targetHr != null) {
      rideState.hrAbsErrorSum += Math.abs(heartRate - targetHr);
    }
  }

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
    cadence: latestCadenceRpm,
    breathsPerMinute: estimateBreathsPerMinute(latestHeartRateBpm),
    timestamp: now,
  });

  pruneRollingSamples(now);
}

function pruneRollingSamples(now) {
  const oldestAllowed = now - MAX_WINDOW_MS;
  while (rollingSamples.length > 0 && rollingSamples[0].timestamp < oldestAllowed) {
    rollingSamples.shift();
  }
}

function updateRollingAverages() {
  const now = Date.now();
  pruneRollingSamples(now);

  setWindowMetrics(now, WINDOWS_IN_MS["1m"], avg1mEl, pv1mEl, hrAvg1mEl, hrAdherence1mEl, cadAvg1mEl, wpHr1mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["3m"], avg3mEl, pv3mEl, hrAvg3mEl, hrAdherence3mEl, cadAvg3mEl, wpHr3mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["5m"], avg5mEl, pv5mEl, hrAvg5mEl, hrAdherence5mEl, cadAvg5mEl, wpHr5mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["10m"], avg10mEl, pv10mEl, hrAvg10mEl, hrAdherence10mEl, cadAvg10mEl, wpHr10mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["20m"], avg20mEl, pv20mEl, hrAvg20mEl, hrAdherence20mEl, cadAvg20mEl, wpHr20mEl);
  updateBreathingMetrics();
  updateGuidancePanel();
}

function setWindowMetrics(now, windowMs, powerEl, variabilityEl, heartRateAvgEl, hrAdherenceEl, cadenceAvgEl, wpHrEl) {
  const avgPower = getWindowAveragePower(now, windowMs);
  const startTime = now - windowMs;
  const samplesInWindow = rollingSamples.filter((sample) => sample.timestamp >= startTime);

  if (samplesInWindow.length === 0 || avgPower == null) {
    powerEl.textContent = "--";
    variabilityEl.textContent = "--";
    heartRateAvgEl.textContent = "--";
    hrAdherenceEl.textContent = "--";
    cadenceAvgEl.textContent = "--";
    wpHrEl.textContent = "--";
    return;
  }

  const totalHeartRate = samplesInWindow.reduce(
    (sum, sample) => sum + sample.heartRate,
    0,
  );

  const avgHeartRate = totalHeartRate / samplesInWindow.length;
  const cadenceSamples = samplesInWindow.filter((sample) => Number.isFinite(sample.cadence));
  const avgCadence = cadenceSamples.length > 0
    ? cadenceSamples.reduce((sum, sample) => sum + sample.cadence, 0) / cadenceSamples.length
    : null;

  powerEl.textContent = Math.round(avgPower);

  const powerVariability = calculatePowerVariability(now, windowMs, avgPower);
  variabilityEl.textContent = powerVariability == null ? "--" : `${powerVariability.toFixed(1)}%`;

  const targetHr = getTargetHeartRate();
  const hrAdherenceScore = calculateHeartRateAdherenceScore(samplesInWindow, targetHr);
  hrAdherenceEl.textContent = hrAdherenceScore == null ? "--" : `${hrAdherenceScore.toFixed(1)}%`;

  heartRateAvgEl.textContent = Math.round(avgHeartRate);
  cadenceAvgEl.textContent = avgCadence == null ? "--" : Math.round(avgCadence);

  if (avgHeartRate <= 0) {
    wpHrEl.textContent = "--";
    return;
  }

  const wattsPerHeartRate = avgPower / avgHeartRate;
  wpHrEl.textContent = wattsPerHeartRate.toFixed(2);
}


function getTargetHeartRate() {
  if (!targetHrInputEl) {
    return TARGET_RIDE_AVG_HEART_RATE;
  }

  const target = Number(targetHrInputEl.value);
  if (!Number.isFinite(target) || target <= 0) {
    return null;
  }

  return target;
}

function updateTargetGuidanceLabel() {
  if (!targetGuidanceLabelEl) {
    return;
  }

  const targetHr = getTargetHeartRate();
  const displayedTarget = targetHr == null ? TARGET_RIDE_AVG_HEART_RATE : Math.round(targetHr);
  targetGuidanceLabelEl.textContent = `${displayedTarget} BPM Guidance`;
}

function recomputeRideHeartRateTotals() {
  if (!rideState) {
    return;
  }

  const targetHr = getTargetHeartRate();
  if (targetHr == null || rideHeartRateSamples.length === 0) {
    rideState.hrAbsErrorSum = 0;
    return;
  }

  rideState.hrAbsErrorSum = rideHeartRateSamples.reduce(
    (sum, heartRate) => sum + Math.abs(heartRate - targetHr),
    0,
  );
}

function calculatePowerVariability(now, windowMs, avgPower) {
  if (!Number.isFinite(avgPower) || avgPower <= 0) {
    return null;
  }

  const windowStart = now - windowMs;
  const tenSecondWindowMs = 10 * 1000;
  const inWindowPowerSamples = powerSamples.filter((sample) => sample.timestamp >= windowStart);

  if (inWindowPowerSamples.length < 2) {
    return null;
  }

  const rollingTenSecondAverages = inWindowPowerSamples
    .map((sample) => getWindowAveragePower(sample.timestamp, tenSecondWindowMs))
    .filter((value) => Number.isFinite(value));

  if (rollingTenSecondAverages.length === 0) {
    return null;
  }

  const meanAbsoluteDeviation = rollingTenSecondAverages.reduce(
    (sum, rollingAvg) => sum + Math.abs(rollingAvg - avgPower),
    0,
  ) / rollingTenSecondAverages.length;

  return (meanAbsoluteDeviation / avgPower) * 100;
}

function calculateHeartRateAdherenceScore(samples, targetHeartRate) {
  if (!Array.isArray(samples) || samples.length === 0 || !Number.isFinite(targetHeartRate) || targetHeartRate <= 0) {
    return null;
  }

  const avgAbsoluteError = samples.reduce(
    (sum, sample) => sum + Math.abs(sample.heartRate - targetHeartRate),
    0,
  ) / samples.length;

  const normalizedError = avgAbsoluteError / targetHeartRate;
  return Math.max(0, 100 * (1 - normalizedError));
}

function estimateBreathsPerMinute(heartRate) {
  if (!Number.isFinite(heartRate) || heartRate <= 0) {
    return null;
  }

  return heartRate * BREATHS_PER_BEAT_FACTOR;
}

function updateBreathingMetrics() {
  const estBpm = estimateBreathsPerMinute(latestHeartRateBpm);
  breathsPerMinuteEl.textContent = estBpm == null ? "--" : estBpm.toFixed(1);

  const now = Date.now();
  const start3m = now - WINDOWS_IN_MS["3m"];
  const samples3m = rollingSamples.filter((sample) => sample.timestamp >= start3m);

  if (samples3m.length < 2) {
    breathsPerKj3mEl.textContent = "--";
  } else {
    const breaths3m = getEstimatedBreathsFromSamples(samples3m);
    const avgPower3m = getWindowAveragePower(now, WINDOWS_IN_MS["3m"]);
    const durationSec = (samples3m[samples3m.length - 1].timestamp - samples3m[0].timestamp) / 1000;
    const kj3m = avgPower3m && durationSec > 0 ? (avgPower3m * durationSec) / 1000 : 0;
    breathsPerKj3mEl.textContent = kj3m > 0 ? (breaths3m / kj3m).toFixed(1) : "--";
  }

  if (!rideState || rideState.doneKj <= 0) {
    breathsPerKjRideEl.textContent = "--";
    return;
  }

  breathsPerKjRideEl.textContent = (rideState.totalBreaths / rideState.doneKj).toFixed(1);
}

function getEstimatedBreathsFromSamples(samples) {
  let totalBreaths = 0;

  for (let i = 1; i < samples.length; i += 1) {
    const current = samples[i];
    const prev = samples[i - 1];
    const elapsedMin = Math.max(0, (current.timestamp - prev.timestamp) / 60000);
    totalBreaths += current.breathsPerMinute * elapsedMin;
  }

  return totalBreaths;
}

function updateGuidancePanel() {
  if (!rideState) {
    rideHrAdherenceEl.textContent = "--";
    rideAvgHrEl.textContent = "--";
    remainingWorkGuidanceEl.textContent = "--";
    targetGuidanceWattsEl.textContent = "--";
    return;
  }

  const rideAvgHr = rideState.hrCount > 0 ? rideState.hrSum / rideState.hrCount : null;
  const remainingKj = Math.max(rideState.targetKj - rideState.doneKj, 0);
  const targetHr = getTargetHeartRate();

  const rideAdherence = rideState.hrCount > 0 && targetHr != null
    ? Math.max(0, 100 * (1 - (rideState.hrAbsErrorSum / rideState.hrCount) / targetHr))
    : null;
  rideHrAdherenceEl.textContent = rideAdherence == null ? "--" : `${rideAdherence.toFixed(1)}%`;
  rideAvgHrEl.textContent = rideAvgHr == null ? "--" : `${rideAvgHr.toFixed(1)} bpm`;
  remainingWorkGuidanceEl.textContent = `${remainingKj.toFixed(1)} kJ`;

  const suggestion = computeSuggestedWattsForTargetHr(rideAvgHr, remainingKj);
  targetGuidanceWattsEl.textContent = suggestion == null ? "--" : `${Math.round(suggestion)} W`;
}

function computeSuggestedWattsForTargetHr(rideAvgHr, remainingKj) {
  if (rideAvgHr == null || remainingKj <= 0) {
    return null;
  }

  const now = Date.now();
  const avg5mHr = getWindowAverageHeartRate(now, WINDOWS_IN_MS["5m"]);
  const avg5mWatts = getWindowAveragePower(now, WINDOWS_IN_MS["5m"]);

  if (avg5mHr == null || avg5mWatts == null || avg5mWatts <= 0) {
    return null;
  }

  const targetHr = getTargetHeartRate() ?? TARGET_RIDE_AVG_HEART_RATE;
  const hrDrift = targetHr - rideAvgHr;
  const targetHrNow = avg5mHr + hrDrift;
  const wattsPerBpm = avg5mWatts / avg5mHr;

  if (!Number.isFinite(wattsPerBpm) || wattsPerBpm <= 0) {
    return null;
  }

  const estimatedWatts = targetHrNow * wattsPerBpm;
  const upperBound = Math.max(avg5mWatts * 1.35, 80);
  const lowerBound = Math.max(avg5mWatts * 0.65, 50);
  return Math.min(upperBound, Math.max(lowerBound, estimatedWatts));
}

function getWindowAverageHeartRate(now, windowMs) {
  const startTime = now - windowMs;
  const samplesInWindow = rollingSamples.filter((sample) => sample.timestamp >= startTime);

  if (samplesInWindow.length === 0) {
    return null;
  }

  const totalHeartRate = samplesInWindow.reduce((sum, sample) => sum + sample.heartRate, 0);
  return totalHeartRate / samplesInWindow.length;
}

async function onPowerDisconnected() {
  powerConnected = false;
  updateConnectionButtonLayout();
  setStatus("Power meter disconnected. Attempting to reconnect...");
  connectBtn.disabled = false;

  const recovered = await tryAutoReconnect(establishPowerConnection, "power meter");
  if (recovered) {
    powerConnected = true;
    connectBtn.disabled = true;
    updateConnectionButtonLayout();
  }
}

async function onHeartRateDisconnected() {
  heartRateConnected = false;
  updateConnectionButtonLayout();
  setStatus("Heart rate monitor disconnected. Attempting to reconnect...");
  connectHrBtn.disabled = false;

  const recovered = await tryAutoReconnect(establishHeartRateConnection, "heart rate monitor");
  if (recovered) {
    heartRateConnected = true;
    connectHrBtn.disabled = true;
    updateConnectionButtonLayout();
  }
}

async function tryAutoReconnect(connectionFn, label) {
  for (let attempt = 1; attempt <= MAX_AUTO_RECONNECT_ATTEMPTS; attempt += 1) {
    try {
      await delay(AUTO_RECONNECT_INTERVAL_MS);
      await connectionFn();
      setStatus(`Reconnected to ${label}.`);
      return true;
    } catch (error) {
      setStatus(`Reconnect attempt ${attempt}/${MAX_AUTO_RECONNECT_ATTEMPTS} failed for ${label}.`);
    }
  }

  setStatus(`Unable to auto-reconnect ${label}. Please reconnect manually.`);
  return false;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

setInterval(() => {
  if (!rideState || latestHeartRateBpm == null || latestPowerWatts == null) {
    return;
  }

  const breathsPerMinute = estimateBreathsPerMinute(latestHeartRateBpm);
  if (breathsPerMinute == null) {
    return;
  }

  rideState.totalBreaths += breathsPerMinute / 60;
}, 1000);

function setStatus(message) {
  statusEl.textContent = message;
}
