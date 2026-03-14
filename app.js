const CYCLING_POWER_SERVICE = 0x1818;
const CYCLING_POWER_MEASUREMENT_CHAR = 0x2a63;

const HEART_RATE_SERVICE = 0x180d;
const HEART_RATE_MEASUREMENT_CHAR = 0x2a37;

const MAX_AUTO_RECONNECT_ATTEMPTS = 5;
const AUTO_RECONNECT_INTERVAL_MS = 3000;
const TARGET_RIDE_AVG_HEART_RATE = 135;
const BREATHS_PER_BEAT_FACTOR = 0.26;
const RIDE_START_MIN_WATTS = 100;
const RIDE_START_REQUIRED_SECONDS = 3;

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
const rideElapsedEl = document.getElementById("rideElapsed");
const rideProgressFillEl = document.getElementById("rideProgressFill");
const rideProgressTrackEl = rideProgressFillEl?.parentElement;
const navTabs = Array.from(document.querySelectorAll(".nav-tab"));
const dashboardViewEl = document.getElementById("dashboardView");
const powerPhaseViewEl = document.getElementById("powerPhaseView");
const phaseWindowGridEl = document.getElementById("phaseWindowGrid");
const phaseBaselineGridEl = document.getElementById("phaseBaselineGrid");
const instantPhaseFeedEl = document.getElementById("instantPhaseFeed");
const settingsViewEl = document.getElementById("settingsView");
const scalePrimaryInputEl = document.getElementById("scalePrimaryInput");
const scaleSecondaryInputEl = document.getElementById("scaleSecondaryInput");
const scaleLabelInputEl = document.getElementById("scaleLabelInput");
const scaleUiInputEl = document.getElementById("scaleUiInput");
const scalePrimaryValueEl = document.getElementById("scalePrimaryValue");
const scaleSecondaryValueEl = document.getElementById("scaleSecondaryValue");
const scaleLabelValueEl = document.getElementById("scaleLabelValue");
const scaleUiValueEl = document.getElementById("scaleUiValue");

const rollingSamples = [];
const powerSamples = [];
const phaseSamples = [];
const instantPhaseFeedSamples = [];
const previousPhaseWindowState = {};
const WINDOWS_IN_MS = {
  "1m": 1 * 60 * 1000,
  "3m": 3 * 60 * 1000,
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
  "20m": 20 * 60 * 1000,
};
const MAX_WINDOW_MS = WINDOWS_IN_MS["20m"];
const PHASE_WINDOWS = {
  "1m": 1 * 60 * 1000,
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
};
const PHASE_MAX_WINDOW_MS = PHASE_WINDOWS["10m"];
const INSTANT_PHASE_FEED_MAX_ROWS = 12;

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

navTabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
switchView("dashboard");

updateConnectionButtonLayout();
updateTargetGuidanceLabel();
updateRideProgressUi();
updatePowerPhaseExplorer();
renderInstantPhaseFeed();
initializeTextScaling();
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
    armedTimestamp: Date.now(),
    startTimestamp: null,
    started: false,
    startThresholdSeconds: 0,
    lastAboveThresholdTimestamp: null,
    doneKj: 0,
    completed: false,
    totalBreaths: 0,
    hrSum: 0,
    hrCount: 0,
    hrAbsErrorSum: 0,
  };
  lastPowerSampleTimestamp = null;
  rideHeartRateSamples = [];

  setStatus(`Ride armed for ${formatNumber(targetKj, 2)} kJ. Starts after ${RIDE_START_REQUIRED_SECONDS}s above ${RIDE_START_MIN_WATTS} W.`);
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
  const elapsedSeconds = rideState.started && Number.isFinite(rideState.startTimestamp)
    ? Math.max(0, (Date.now() - rideState.startTimestamp) / 1000)
    : 0;

  return { doneKj, remainingKj, etaSeconds, percentComplete, elapsedSeconds };
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
    if (rideElapsedEl) {
      rideElapsedEl.textContent = "Elapsed: --:--";
    }
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
  rideDoneEl.textContent = `Done: ${formatNumber(stats.doneKj, 2)} kJ`;
  rideRemainingEl.textContent = `Remaining: ${formatNumber(stats.remainingKj, 2)} kJ`;
  rideEtaEl.textContent = stats.remainingKj <= 0 ? "ETA: Completed" : `ETA: ${formatDuration(stats.etaSeconds)}`;
  if (rideElapsedEl) {
    rideElapsedEl.textContent = `Elapsed: ${formatElapsedDuration(stats.elapsedSeconds)}`;
  }
  rideProgressFillEl.style.width = `${formatNumber(percent, 2)}%`;
  rideProgressTrackEl?.setAttribute("aria-valuenow", `${formatNumber(percent, 2)}`);
  updateBreathingMetrics();
  updateGuidancePanel();
  updateStartButtonVisibility();

  if (stats.remainingKj <= 0 && !rideState.completed) {
    rideState.completed = true;
    setStatus(`Ride target complete: ${formatNumber(rideState.targetKj, 2)} kJ done.`);
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
  const parsedPowerMeasurement = parsePowerMeasurementDetails(value, flags);
  latestCadenceRpm = parsedPowerMeasurement.cadence;
  wattsEl.textContent = formatNumber(watts, 2);

  const now = Date.now();
  addPowerSample(watts, now);
  addPhaseSample({
    timestamp: now,
    watts,
    cadence: latestCadenceRpm,
    heartRate: latestHeartRateBpm,
    powerPhase: parsedPowerMeasurement.powerPhase,
  });
  addInstantPhaseFeedSample({
    timestamp: now,
    watts,
    cadence: latestCadenceRpm,
    heartRate: latestHeartRateBpm,
    powerPhase: parsedPowerMeasurement.powerPhase,
  });
  accumulateRideEnergy(watts, now);

  maybeAddRollingSample();
  updateRollingAverages();
  updateRideProgressUi();
}


function parsePowerMeasurementDetails(value, flags) {
  const crankDataOffset = getCrankDataOffset(flags);
  const cadence = parseCadenceFromPowerMeasurement(value, flags, crankDataOffset);
  const offsetAfterStandardFields = getCyclingPowerMeasurementEndOffset(flags);

  return {
    cadence,
    powerPhase: parseAssiomaPowerPhaseExtension(value, offsetAfterStandardFields),
  };
}

function parseCadenceFromPowerMeasurement(value, flags, crankDataOffset = getCrankDataOffset(flags)) {
  const CRANK_REV_PRESENT_FLAG = 0x20;
  if ((flags & CRANK_REV_PRESENT_FLAG) === 0) {
    previousCrankData = null;
    return null;
  }

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

function getCyclingPowerMeasurementEndOffset(flags) {
  let offset = 4;

  const fieldSizes = [
    [0x01, 1],
    [0x04, 2],
    [0x10, 6],
    [0x20, 4],
    [0x40, 4],
    [0x80, 4],
    [0x100, 2],
    [0x200, 2],
    [0x400, 2],
  ];

  fieldSizes.forEach(([flag, size]) => {
    if (flags & flag) {
      offset += size;
    }
  });

  return offset;
}

function parseAssiomaPowerPhaseExtension(value, offset) {
  // Assioma can expose pedal-stroke fields via vendor extensions, but the
  // extension can be shifted by 2-byte headers depending on firmware.
  // Scan for a plausible 8-angle block instead of assuming it starts exactly
  // at the end of the standard Cycling Power Measurement fields.
  const minimumBlockBytes = 16;
  if (value.byteLength < offset + minimumBlockBytes) {
    return null;
  }

  for (let candidateOffset = offset; candidateOffset <= value.byteLength - minimumBlockBytes; candidateOffset += 2) {
    const rawAngles = [];
    for (let i = 0; i < 8; i += 1) {
      rawAngles.push(value.getUint16(candidateOffset + (i * 2), true));
    }

    const parsed = parsePowerPhaseAngleBlock(rawAngles);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function parsePowerPhaseAngleBlock(rawAngles) {
  const validRawAngles = rawAngles.filter(isFiniteRawPhaseAngle);
  if (validRawAngles.length < 4) {
    return null;
  }

  const maxAngle = Math.max(...validRawAngles);
  const scale = maxAngle <= 3600 ? 10 : 100;
  const parsedAngles = rawAngles.map((raw) => parseRawPhaseAngle(raw, scale));
  const [leftStart, leftEnd, rightStart, rightEnd, leftPeakStart, leftPeakEnd, rightPeakStart, rightPeakEnd] = parsedAngles;

  if (!isFiniteAngle(leftStart) || !isFiniteAngle(leftEnd) || !isFiniteAngle(rightStart) || !isFiniteAngle(rightEnd)) {
    return null;
  }

  return {
    left: {
      start: leftStart,
      end: leftEnd,
      peakStart: leftPeakStart,
      peakEnd: leftPeakEnd,
    },
    right: {
      start: rightStart,
      end: rightEnd,
      peakStart: rightPeakStart,
      peakEnd: rightPeakEnd,
    },
  };
}

function isFiniteRawPhaseAngle(rawAngle) {
  if (!Number.isFinite(rawAngle)) {
    return false;
  }

  if (rawAngle === 0xFFFF || rawAngle === 0xFFFE) {
    return false;
  }

  return rawAngle <= 36000;
}

function parseRawPhaseAngle(rawAngle, scale) {
  if (!isFiniteRawPhaseAngle(rawAngle)) {
    return null;
  }

  return normalizeAngle(rawAngle / scale);
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

  if (!rideState.started) {
    maybeStartRideFromPower(watts, timestamp);
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

function maybeStartRideFromPower(watts, timestamp) {
  if (!rideState) {
    return;
  }

  if (!Number.isFinite(watts) || watts <= RIDE_START_MIN_WATTS) {
    rideState.startThresholdSeconds = 0;
    rideState.lastAboveThresholdTimestamp = null;
    return;
  }

  if (!Number.isFinite(rideState.lastAboveThresholdTimestamp)) {
    rideState.lastAboveThresholdTimestamp = timestamp;
    return;
  }

  const elapsedSeconds = Math.max(0, (timestamp - rideState.lastAboveThresholdTimestamp) / 1000);
  if (elapsedSeconds > 2) {
    rideState.startThresholdSeconds = 0;
  } else {
    rideState.startThresholdSeconds += Math.min(elapsedSeconds, 5);
  }
  rideState.lastAboveThresholdTimestamp = timestamp;

  if (rideState.startThresholdSeconds >= RIDE_START_REQUIRED_SECONDS) {
    rideState.started = true;
    rideState.startTimestamp = timestamp;
    lastPowerSampleTimestamp = timestamp;
    setStatus(`Ride started: ${formatNumber(rideState.targetKj, 2)} kJ target.`);
  }
}

function handleHeartRateNotification(event) {
  const value = event.target.value;
  const flags = value.getUint8(0);
  const isHeartRate16Bit = (flags & 0x01) !== 0;
  const heartRate = isHeartRate16Bit ? value.getUint16(1, true) : value.getUint8(1);

  latestHeartRateBpm = heartRate;
  heartRateEl.textContent = formatNumber(heartRate, 2);

  if (rideState?.started) {
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
  updatePowerPhaseExplorer();
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

  powerEl.textContent = formatNumber(avgPower, 2);

  const powerVariability = calculatePowerVariability(now, windowMs, avgPower);
  variabilityEl.textContent = powerVariability == null ? "--" : `${formatNumber(powerVariability, 2)}%`;

  const targetHr = getTargetHeartRate();
  const hrAdherenceScore = calculateHeartRateAdherenceScore(samplesInWindow, targetHr);
  hrAdherenceEl.textContent = hrAdherenceScore == null ? "--" : `${formatNumber(hrAdherenceScore, 2)}%`;

  heartRateAvgEl.textContent = formatNumber(avgHeartRate, 2);
  cadenceAvgEl.textContent = avgCadence == null ? "--" : formatNumber(avgCadence, 2);

  if (avgHeartRate <= 0) {
    wpHrEl.textContent = "--";
    return;
  }

  const wattsPerHeartRate = avgPower / avgHeartRate;
  wpHrEl.textContent = formatNumber(wattsPerHeartRate, 2);
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
  const displayedTarget = targetHr == null ? TARGET_RIDE_AVG_HEART_RATE : targetHr;
  targetGuidanceLabelEl.textContent = `${formatNumber(displayedTarget, 2)} BPM Guidance`;
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
  breathsPerMinuteEl.textContent = estBpm == null ? "--" : formatNumber(estBpm, 2);

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
    breathsPerKj3mEl.textContent = kj3m > 0 ? formatNumber(breaths3m / kj3m, 2) : "--";
  }

  if (!rideState || rideState.doneKj <= 0) {
    breathsPerKjRideEl.textContent = "--";
    return;
  }

  breathsPerKjRideEl.textContent = formatNumber(rideState.totalBreaths / rideState.doneKj, 2);
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
  rideHrAdherenceEl.textContent = rideAdherence == null ? "--" : `${formatNumber(rideAdherence, 2)}%`;
  rideAvgHrEl.textContent = rideAvgHr == null ? "--" : `${formatNumber(rideAvgHr, 2)} bpm`;
  remainingWorkGuidanceEl.textContent = `${formatNumber(remainingKj, 2)} kJ`;

  const suggestion = computeSuggestedWattsForTargetHr(rideAvgHr, remainingKj);
  targetGuidanceWattsEl.textContent = suggestion == null ? "--" : `${formatNumber(suggestion, 2)} W`;
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


function switchView(viewName) {
  const activeView = ["dashboard", "powerPhase", "settings"].includes(viewName)
    ? viewName
    : "dashboard";

  const isDashboard = activeView === "dashboard";
  const isPowerPhase = activeView === "powerPhase";
  const isSettings = activeView === "settings";

  dashboardViewEl?.classList.toggle("active", isDashboard);
  powerPhaseViewEl?.classList.toggle("active", isPowerPhase);
  settingsViewEl?.classList.toggle("active", isSettings);

  if (dashboardViewEl) {
    dashboardViewEl.hidden = !isDashboard;
  }
  if (powerPhaseViewEl) {
    powerPhaseViewEl.hidden = !isPowerPhase;
  }
  if (settingsViewEl) {
    settingsViewEl.hidden = !isSettings;
  }

  navTabs.forEach((tab) => {
    const isActive = tab.dataset.view === activeView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function initializeTextScaling() {
  const selectorsByCategory = {
    primary: [".watts", ".heart-rate", ".avg-value"],
    secondary: [".avg-sub-value", ".status", ".ride-progress-details span", ".phase-metric-grid dd"],
    label: [".label", ".unit", ".avg-label", ".avg-sub-label", ".ride-label", ".phase-subtitle", ".phase-metric-grid dt", ".phase-description"],
    ui: [".nav-tab", ".connect-btn", ".ride-input", ".ride-input-unit", ".settings-label", ".settings-value"],
  };

  const inputMap = {
    primary: { input: scalePrimaryInputEl, value: scalePrimaryValueEl, varName: "--text-scale-primary" },
    secondary: { input: scaleSecondaryInputEl, value: scaleSecondaryValueEl, varName: "--text-scale-secondary" },
    label: { input: scaleLabelInputEl, value: scaleLabelValueEl, varName: "--text-scale-label" },
    ui: { input: scaleUiInputEl, value: scaleUiValueEl, varName: "--text-scale-ui" },
  };

  Object.entries(selectorsByCategory).forEach(([category, selectors]) => {
    const className = `text-scale-${category}`;
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.classList.add(className));
    });
  });

  Object.entries(inputMap).forEach(([category, config]) => {
    if (!config.input || !config.value) {
      return;
    }

    const storedRaw = localStorage.getItem(`textScale:${category}`);
    const stored = Number(storedRaw);
    const initialPercent = Number.isFinite(stored) ? Math.min(170, Math.max(70, stored)) : Number(config.input.value || 100);
    config.input.value = String(initialPercent);
    applyTextScale(config.varName, initialPercent, config.value);

    config.input.addEventListener("input", () => {
      const percent = Number(config.input.value);
      applyTextScale(config.varName, percent, config.value);
      localStorage.setItem(`textScale:${category}`, String(percent));
    });
  });
}

function applyTextScale(cssVarName, percent, valueEl) {
  const scale = percent / 100;
  document.documentElement.style.setProperty(cssVarName, String(scale));
  valueEl.textContent = `${Math.round(percent)}%`;
}

function addPhaseSample(sample) {
  phaseSamples.push(sample);
  prunePhaseSamples(sample.timestamp);
}

function addInstantPhaseFeedSample(sample) {
  instantPhaseFeedSamples.unshift(sample);

  if (instantPhaseFeedSamples.length > INSTANT_PHASE_FEED_MAX_ROWS) {
    instantPhaseFeedSamples.length = INSTANT_PHASE_FEED_MAX_ROWS;
  }

  renderInstantPhaseFeed();
}

function renderInstantPhaseFeed() {
  if (!instantPhaseFeedEl) {
    return;
  }

  if (instantPhaseFeedSamples.length === 0) {
    instantPhaseFeedEl.innerHTML = '<p class="instant-feed-empty">No live pedal packets yet.</p>';
    return;
  }

  instantPhaseFeedEl.innerHTML = instantPhaseFeedSamples
    .map((sample) => {
      const left = sample.powerPhase?.left;
      const right = sample.powerPhase?.right;

      return `
        <article class="instant-feed-row">
          <div class="instant-feed-time">${formatFeedTimestamp(sample.timestamp)}</div>
          <div class="instant-feed-meta">P ${formatNumber(sample.watts, 0, "W")} · C ${formatNumber(sample.cadence, 0, "rpm")} · HR ${formatNumber(sample.heartRate, 0, "bpm")}</div>
          <div class="instant-feed-phases">
            <span>L ${formatPhaseSegment(left)}</span>
            <span>R ${formatPhaseSegment(right)}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function formatFeedTimestamp(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return "--:--:--";
  }

  return new Date(timestamp).toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatPhaseSegment(phase) {
  if (!phase) {
    return "--";
  }

  const powerRange = `${formatAngle(phase.start)}→${formatAngle(phase.end)}`;
  const peakRange = `${formatAngle(phase.peakStart)}→${formatAngle(phase.peakEnd)}`;
  return `${powerRange} (peak ${peakRange})`;
}

function prunePhaseSamples(now) {
  const oldestAllowed = now - PHASE_MAX_WINDOW_MS;
  while (phaseSamples.length > 0 && phaseSamples[0].timestamp < oldestAllowed) {
    phaseSamples.shift();
  }
}

function updatePowerPhaseExplorer() {
  if (!phaseWindowGridEl || !phaseBaselineGridEl) {
    return;
  }

  const now = Date.now();
  prunePhaseSamples(now);

  const aggregates = {};
  phaseWindowGridEl.innerHTML = Object.entries(PHASE_WINDOWS)
    .map(([windowKey, windowMs]) => {
      const summary = summarizePhaseWindow(now, windowMs);
      aggregates[windowKey] = summary;
      return renderPhaseWindowCard(windowKey, summary);
    })
    .join("");

  phaseBaselineGridEl.innerHTML = renderBaselineComparison(aggregates["1m"], aggregates["10m"]);
}

function summarizePhaseWindow(now, windowMs) {
  const startTime = now - windowMs;
  const samples = phaseSamples.filter((sample) => sample.timestamp >= startTime);
  const withPhase = samples.filter((sample) => sample.powerPhase?.left || sample.powerPhase?.right);

  return {
    left: summarizePhaseSide(withPhase, "left", windowMs),
    right: summarizePhaseSide(withPhase, "right", windowMs),
    avgCadence: getAverageFromSamples(samples, (sample) => sample.cadence),
    avgPower: getAverageFromSamples(samples, (sample) => sample.watts),
    avgHeartRate: getAverageFromSamples(samples, (sample) => sample.heartRate),
  };
}

function summarizePhaseSide(samples, side, windowMs) {
  const starts = [];
  const ends = [];
  const peakStarts = [];
  const peakEnds = [];
  const widths = [];
  const centers = [];
  const peakWidths = [];
  const peakCenters = [];

  samples.forEach((sample) => {
    const phase = sample.powerPhase?.[side];
    if (!phase) {
      return;
    }

    if (isFiniteAngle(phase.start)) starts.push(phase.start);
    if (isFiniteAngle(phase.end)) ends.push(phase.end);
    if (isFiniteAngle(phase.peakStart)) peakStarts.push(phase.peakStart);
    if (isFiniteAngle(phase.peakEnd)) peakEnds.push(phase.peakEnd);

    const width = angularWidth(phase.start, phase.end);
    if (width != null) {
      widths.push(width);
      centers.push(angularCenter(phase.start, phase.end));
    }

    const peakWidth = angularWidth(phase.peakStart, phase.peakEnd);
    if (peakWidth != null) {
      peakWidths.push(peakWidth);
      peakCenters.push(angularCenter(phase.peakStart, phase.peakEnd));
    }
  });

  const stateKey = `${windowMs}-${side}`;
  const previous = previousPhaseWindowState[stateKey] || {};
  const summary = {
    start: circularMean(starts),
    end: circularMean(ends),
    width: arithmeticMean(widths),
    center: circularMean(centers),
    peakStart: circularMean(peakStarts),
    peakEnd: circularMean(peakEnds),
    peakWidth: arithmeticMean(peakWidths),
    peakCenter: circularMean(peakCenters),
    stability: classifyVariability(circularDispersion(centers), standardDeviation(widths)),
    trendCenter: trendForValue(previous.center, circularMean(centers), true),
    trendWidth: trendForValue(previous.width, arithmeticMean(widths), false),
    trendPeakCenter: trendForValue(previous.peakCenter, circularMean(peakCenters), true),
    trendPeakWidth: trendForValue(previous.peakWidth, arithmeticMean(peakWidths), false),
  };

  previousPhaseWindowState[stateKey] = {
    center: summary.center,
    width: summary.width,
    peakCenter: summary.peakCenter,
    peakWidth: summary.peakWidth,
  };

  return summary;
}

function renderPhaseWindowCard(windowKey, summary) {
  const hr = summary.avgHeartRate;
  const wpHr = Number.isFinite(summary.avgPower) && Number.isFinite(hr) && hr > 0 ? (summary.avgPower / hr) : null;

  return `
    <article class="avg-card phase-window-card">
      <p class="avg-label">${windowKey.toUpperCase()} Window</p>
      <div class="phase-sides-grid">
        ${renderSideCard("Left pedal", summary.left)}
        ${renderSideCard("Right pedal", summary.right)}
      </div>
      <dl class="phase-comparison-grid">
        <dt>L-R center diff</dt><dd>${formatAngleDiff(summary.left.center, summary.right.center)}</dd>
        <dt>L-R width diff</dt><dd>${formatDiff(summary.left.width, summary.right.width, "°")}</dd>
        <dt>L-R peak center diff</dt><dd>${formatAngleDiff(summary.left.peakCenter, summary.right.peakCenter)}</dd>
        <dt>L-R peak width diff</dt><dd>${formatDiff(summary.left.peakWidth, summary.right.peakWidth, "°")}</dd>
        <dt>Avg cadence</dt><dd>${formatNumber(summary.avgCadence, 0, "rpm")}</dd>
        <dt>Avg power</dt><dd>${formatNumber(summary.avgPower, 0, "W")}</dd>
        <dt>Avg heart rate</dt><dd>${formatNumber(summary.avgHeartRate, 0, "bpm")}</dd>
        <dt>Watts / BPM</dt><dd>${formatNumber(wpHr, 2, "")}</dd>
      </dl>
    </article>
  `;
}

function renderSideCard(title, sideSummary) {
  return `
    <section class="phase-side-card">
      <p class="phase-subtitle">${title}</p>
      <dl class="phase-metric-grid">
        <dt>Power start</dt><dd>${formatAngle(sideSummary.start)}</dd>
        <dt>Power end</dt><dd>${formatAngle(sideSummary.end)}</dd>
        <dt>Power width</dt><dd>${formatAngle(sideSummary.width)}${trendChip(sideSummary.trendWidth)}</dd>
        <dt>Power center</dt><dd>${formatAngle(sideSummary.center)}${trendChip(sideSummary.trendCenter)}</dd>
        <dt>Peak start</dt><dd>${formatAngle(sideSummary.peakStart)}</dd>
        <dt>Peak end</dt><dd>${formatAngle(sideSummary.peakEnd)}</dd>
        <dt>Peak width</dt><dd>${formatAngle(sideSummary.peakWidth)}${trendChip(sideSummary.trendPeakWidth)}</dd>
        <dt>Peak center</dt><dd>${formatAngle(sideSummary.peakCenter)}${trendChip(sideSummary.trendPeakCenter)}</dd>
        <dt>Stability</dt><dd class="stability-${sideSummary.stability.toLowerCase()}">${sideSummary.stability}</dd>
      </dl>
    </section>
  `;
}

function renderBaselineComparison(summary1m, summary10m) {
  const one = summary1m || {};
  const ten = summary10m || {};
  const wpHrOne = Number.isFinite(one.avgPower) && Number.isFinite(one.avgHeartRate) && one.avgHeartRate > 0 ? one.avgPower / one.avgHeartRate : null;
  const wpHrTen = Number.isFinite(ten.avgPower) && Number.isFinite(ten.avgHeartRate) && ten.avgHeartRate > 0 ? ten.avgPower / ten.avgHeartRate : null;

  const rows = [
    ["Phase center", formatDiff(one.left?.center, ten.left?.center, "°", true)],
    ["Phase width", formatDiff(one.left?.width, ten.left?.width, "°")],
    ["Cadence", formatDiff(one.avgCadence, ten.avgCadence, "rpm")],
    ["Watts / BPM", formatDiff(wpHrOne, wpHrTen, "", false, 2)],
  ];

  return rows
    .map(([label, value]) => `<article class="baseline-item"><p class="avg-sub-label">${label}</p><p class="avg-sub-value">${value}</p></article>`)
    .join("");
}

function angularWidth(startAngle, endAngle) {
  if (!isFiniteAngle(startAngle) || !isFiniteAngle(endAngle)) {
    return null;
  }

  return (normalizeAngle(endAngle) - normalizeAngle(startAngle) + 360) % 360;
}

function angularCenter(startAngle, endAngle) {
  const width = angularWidth(startAngle, endAngle);
  if (width == null) {
    return null;
  }

  return normalizeAngle(startAngle + (width / 2));
}

function normalizeAngle(angle) {
  if (!Number.isFinite(angle)) {
    return null;
  }

  return ((angle % 360) + 360) % 360;
}

function circularMean(values) {
  const filtered = values.filter(isFiniteAngle);
  if (filtered.length === 0) {
    return null;
  }

  const radians = filtered.map((value) => (value * Math.PI) / 180);
  const sinSum = radians.reduce((sum, value) => sum + Math.sin(value), 0);
  const cosSum = radians.reduce((sum, value) => sum + Math.cos(value), 0);

  if (sinSum === 0 && cosSum === 0) {
    return null;
  }

  const angle = Math.atan2(sinSum, cosSum) * (180 / Math.PI);
  return normalizeAngle(angle);
}

function circularDispersion(values) {
  const filtered = values.filter(isFiniteAngle);
  if (filtered.length < 2) {
    return null;
  }

  const mean = circularMean(filtered);
  if (!isFiniteAngle(mean)) {
    return null;
  }

  const squaredDiffs = filtered.map((value) => {
    const diff = angularDifference(value, mean);
    return diff * diff;
  });

  return Math.sqrt(squaredDiffs.reduce((sum, value) => sum + value, 0) / squaredDiffs.length);
}

function angularDifference(a, b) {
  if (!isFiniteAngle(a) || !isFiniteAngle(b)) {
    return null;
  }

  const delta = normalizeAngle(a) - normalizeAngle(b);
  return ((delta + 540) % 360) - 180;
}

function arithmeticMean(values) {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (filtered.length === 0) {
    return null;
  }

  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
}

function standardDeviation(values) {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (filtered.length < 2) {
    return null;
  }

  const avg = arithmeticMean(filtered);
  const variance = filtered.reduce((sum, value) => sum + ((value - avg) ** 2), 0) / filtered.length;
  return Math.sqrt(variance);
}

function classifyVariability(centerDispersion, widthDeviation) {
  const scores = [centerDispersion, widthDeviation].filter((value) => Number.isFinite(value));
  if (scores.length === 0) {
    return "Medium";
  }

  const score = arithmeticMean(scores);
  if (score < 6) {
    return "Low";
  }
  if (score > 15) {
    return "High";
  }

  return "Medium";
}

function trendForValue(previous, current, isCircular) {
  if (!Number.isFinite(previous) || !Number.isFinite(current)) {
    return "stable";
  }

  const delta = isCircular ? angularDifference(current, previous) : current - previous;
  if (!Number.isFinite(delta)) {
    return "stable";
  }

  if (delta > 1.5) {
    return "rising";
  }
  if (delta < -1.5) {
    return "falling";
  }

  return "stable";
}

function trendChip(trend) {
  const map = {
    rising: "↑",
    falling: "↓",
    stable: "→",
  };
  return `<span class="trend-chip">${map[trend] || map.stable}</span>`;
}

function formatAngle(value) {
  return Number.isFinite(value) ? `${formatNumber(value, 2)}°` : "--";
}

function formatNumber(value, maxSignificantDigits = 2, suffix = "") {
  if (!Number.isFinite(value)) {
    return "--";
  }

  const requestedDigits = Number.isFinite(maxSignificantDigits) && maxSignificantDigits > 0
    ? maxSignificantDigits
    : 2;
  const precision = Math.max(1, Math.min(21, requestedDigits));
  const rounded = Number(value).toPrecision(precision);
  const normalized = Number(rounded);
  const rendered = Number.isFinite(normalized) ? `${normalized}` : `${rounded}`;
  return suffix ? `${rendered} ${suffix}` : rendered;
}

function formatDiff(leftValue, rightValue, suffix = "", circular = false, maxSignificantDigits = 2) {
  if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) {
    return "--";
  }

  const diff = circular ? angularDifference(leftValue, rightValue) : leftValue - rightValue;
  if (!Number.isFinite(diff)) {
    return "--";
  }

  return formatNumber(diff, maxSignificantDigits, suffix);
}

function formatAngleDiff(leftValue, rightValue) {
  return formatDiff(leftValue, rightValue, "°", true, 2);
}

function formatElapsedDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "--:--";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getAverageFromSamples(samples, getter) {
  const values = samples.map(getter).filter((value) => Number.isFinite(value));
  return arithmeticMean(values);
}

function isFiniteAngle(value) {
  return Number.isFinite(value);
}

function setStatus(message) {
  statusEl.textContent = message;
}
