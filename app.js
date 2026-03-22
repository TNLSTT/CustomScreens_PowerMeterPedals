const CYCLING_POWER_SERVICE = 0x1818;
const CYCLING_POWER_MEASUREMENT_CHAR = 0x2a63;
const POWER_METER_NAME_PREFIXES = [
  "ASSIOMA",
  "Assioma",
  "POWRLINK",
  "POWERLINK",
  "WAHOO",
  "Wahoo",
];

const HEART_RATE_SERVICE = 0x180d;
const HEART_RATE_MEASUREMENT_CHAR = 0x2a37;

const MAX_AUTO_RECONNECT_ATTEMPTS = 5;
const AUTO_RECONNECT_INTERVAL_MS = 3000;
const TARGET_RIDE_AVG_HEART_RATE = 135;
const BREATHS_PER_BEAT_FACTOR = 0.26;
const RIDE_START_MIN_WATTS = 100;
const RIDE_START_REQUIRED_SECONDS = 3;
const AUTO_NAVIGATE_CADENCE_THRESHOLD = 120;
const AUTO_NAVIGATE_HOLD_MS = 2000;
const AUTO_NAVIGATE_COOLDOWN_MS = 3000;
const VIEW_ROTATION_ORDER = ["dashboard", "powerPhase", "history", "game", "settings", "climb"];

const connectBtn = document.getElementById("connectBtn");
const connectHrBtn = document.getElementById("connectHrBtn");
const reinforcementFeedbackBtnEl = document.getElementById("reinforcementFeedbackBtn");
const buttonGridEl = document.querySelector(".button-grid");
const wattsEl = document.getElementById("watts");
const heartRateEl = document.getElementById("heartRate");
const balanceEl = document.getElementById("balance");
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
const balanceAvg1mEl = document.getElementById("balanceAvg1m");
const balanceAvg3mEl = document.getElementById("balanceAvg3m");
const balanceAvg5mEl = document.getElementById("balanceAvg5m");
const balanceAvg10mEl = document.getElementById("balanceAvg10m");
const balanceAvg20mEl = document.getElementById("balanceAvg20m");
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
const rideHeartRateWalkEl = document.getElementById("rideHeartRateWalk");
const rideHrAdherenceEl = document.getElementById("rideHrAdherence");
const targetHrInputEl = document.getElementById("targetHrInput");
const reinforcementLowerBoundInputEl = document.getElementById("reinforcementLowerBoundInput");
const reinforcementUpperBoundInputEl = document.getElementById("reinforcementUpperBoundInput");
const targetGuidanceLabelEl = document.getElementById("targetGuidanceLabel");
const remainingWorkGuidanceEl = document.getElementById("remainingWorkGuidance");
const targetGuidanceWattsEl = document.getElementById("targetGuidanceWatts");
const targetKjEl = document.getElementById("targetKj");
const startRideBtn = document.getElementById("startRideBtn");
const rideDoneEl = document.getElementById("rideDone");
const rideRemainingEl = document.getElementById("rideRemaining");
const rideEtaEl = document.getElementById("rideEta");
const rideElapsedEl = document.getElementById("rideElapsed");
const rideAvgWattsEl = document.getElementById("rideAvgWatts");
const rideProgressFillEl = document.getElementById("rideProgressFill");
const rideProgressTrackEl = rideProgressFillEl?.parentElement;
const navTabs = Array.from(document.querySelectorAll(".nav-tab"));
const dashboardViewEl = document.getElementById("dashboardView");
const powerPhaseViewEl = document.getElementById("powerPhaseView");
const phaseWindowGridEl = document.getElementById("phaseWindowGrid");
const phaseBaselineGridEl = document.getElementById("phaseBaselineGrid");
const instantPhaseFeedEl = document.getElementById("instantPhaseFeed");
const settingsViewEl = document.getElementById("settingsView");
const historyViewEl = document.getElementById("historyView");
const gameViewEl = document.getElementById("gameView");
const climbViewEl = document.getElementById("climbView");
const climbRiderWeightInputEl = document.getElementById("climbRiderWeightInput");
const climbPowerInputEl = document.getElementById("climbPowerInput");
const climbBikeWeightInputEl = document.getElementById("climbBikeWeightInput");
const climbCdaInputEl = document.getElementById("climbCdaInput");
const climbCalculateBtnEl = document.getElementById("climbCalculateBtn");
const climbExportBtnEl = document.getElementById("climbExportBtn");
const climbPredictedTimeEl = document.getElementById("climbPredictedTime");
const climbAverageSpeedEl = document.getElementById("climbAverageSpeed");
const climbVamEl = document.getElementById("climbVam");
const climbWkgEl = document.getElementById("climbWkg");
const climbGravityBreakdownEl = document.getElementById("climbGravityBreakdown");
const climbRollingBreakdownEl = document.getElementById("climbRollingBreakdown");
const climbAeroBreakdownEl = document.getElementById("climbAeroBreakdown");
const climbEffectiveCdaEl = document.getElementById("climbEffectiveCda");
const climbCalibrationFactorEl = document.getElementById("climbCalibrationFactor");
const climbPlusOneWEl = document.getElementById("climbPlusOneW");
const climbMinusOneKgEl = document.getElementById("climbMinusOneKg");
const climbJsonOutputEl = document.getElementById("climbJsonOutput");
const gameSceneEl = document.getElementById("gameScene");
const gameRiderEl = document.getElementById("gameRider");
const gameTrackMarkersEl = document.getElementById("gameTrackMarkers");
const gameBaselineWattsEl = document.getElementById("gameBaselineWatts");
const gameCurrentWattsEl = document.getElementById("gameCurrentWatts");
const gameDeltaPercentEl = document.getElementById("gameDeltaPercent");
const gameSensitivityInputEl = document.getElementById("gameSensitivityInput");
const gameSensitivityValueEl = document.getElementById("gameSensitivityValue");
const gameObstaclesEl = document.getElementById("gameObstacles");
const gameScoreEl = document.getElementById("gameScore");
const gameBestScoreEl = document.getElementById("gameBestScore");
const gameDodgesEl = document.getElementById("gameDodges");
const gameMessageEl = document.getElementById("gameMessage");
const scalePrimaryInputEl = document.getElementById("scalePrimaryInput");
const scaleSecondaryInputEl = document.getElementById("scaleSecondaryInput");
const scaleLabelInputEl = document.getElementById("scaleLabelInput");
const scaleUiInputEl = document.getElementById("scaleUiInput");
const scaleTimeBucketsInputEl = document.getElementById("scaleTimeBucketsInput");
const scaleKjBucketsInputEl = document.getElementById("scaleKjBucketsInput");
const scalePrimaryValueEl = document.getElementById("scalePrimaryValue");
const scaleSecondaryValueEl = document.getElementById("scaleSecondaryValue");
const scaleLabelValueEl = document.getElementById("scaleLabelValue");
const scaleUiValueEl = document.getElementById("scaleUiValue");
const scaleTimeBucketsValueEl = document.getElementById("scaleTimeBucketsValue");
const scaleKjBucketsValueEl = document.getElementById("scaleKjBucketsValue");
const toggleWidgetLayoutBtnEl = document.getElementById("toggleWidgetLayoutBtn");
const resetWidgetLayoutBtnEl = document.getElementById("resetWidgetLayoutBtn");
const openPopupGraphBtnEl = document.getElementById("openPopupGraphBtn");
const openTextScalingPopupBtnEl = document.getElementById("openTextScalingPopupBtn");
const reportEfficiencyCheckboxEl = document.getElementById("reportEfficiencyCheckbox");
const addRideEventBtnEl = document.getElementById("addRideEventBtn");
const resetRideEventsBtnEl = document.getElementById("resetRideEventsBtn");
const rideEventsEditorEl = document.getElementById("rideEventsEditor");
const rideEventOverlayEl = document.getElementById("rideEventOverlay");
const rideEventOverlayLabelEl = document.getElementById("rideEventOverlayLabel");
const rideEventOverlayGoalEl = document.getElementById("rideEventOverlayGoal");
const rideEventOverlayCountdownEl = document.getElementById("rideEventOverlayCountdown");
const powerKjBucketsCardEl = document.getElementById("powerKjBucketsCard");
const powerKjBucketsSubtitleEl = document.getElementById("powerKjBucketsSubtitle");
const powerKjBucketsGridEl = document.getElementById("powerKjBucketsGrid");
const powerKjBucketsEnabledCheckboxEl = document.getElementById("powerKjBucketsEnabledCheckbox");
const customBucketEditorEl = document.getElementById("customBucketEditor");
const addCustomBucketBtnEl = document.getElementById("addCustomBucketBtn");
const resetCustomBucketsBtnEl = document.getElementById("resetCustomBucketsBtn");
const rideHistoryListEl = document.getElementById("rideHistoryList");
const rideHistoryStatusEl = document.getElementById("rideHistoryStatus");
const refreshRideHistoryBtnEl = document.getElementById("refreshRideHistoryBtn");
const rideHistoryTitleEl = document.getElementById("rideHistoryTitle");
const rideHistorySubtitleEl = document.getElementById("rideHistorySubtitle");
const historyTotalKjEl = document.getElementById("historyTotalKj");
const historyAvgPowerEl = document.getElementById("historyAvgPower");
const historyAvgHrEl = document.getElementById("historyAvgHr");
const historyAvgWPerHrEl = document.getElementById("historyAvgWPerHr");
const historySampleCountEl = document.getElementById("historySampleCount");
const historyDurationEl = document.getElementById("historyDuration");
const rideHistoryChartEl = document.getElementById("rideHistoryChart");
const rideHistoryChartLabelEl = document.getElementById("rideHistoryChartLabel");
const rideHistorySamplesBodyEl = document.getElementById("rideHistorySamplesBody");

const WIDGET_LAYOUT_STORAGE_KEY = "widgetLayout:v1";
const REPORT_EFFICIENCY_STORAGE_KEY = "reportEfficiencyEnabled:v1";
const POWER_KJ_BUCKET_SETTINGS_STORAGE_KEY = "powerKjBucketSettings:v2";
const RIDE_EVENT_SETTINGS_STORAGE_KEY = "rideEventSettings:v1";
const POPUP_GRAPH_MIN_DURATION_SECONDS = 300;
const POPUP_GRAPH_MAX_WATTS = 500;
const WIDGET_TRANSFORM_LIMITS = {
  minScale: 0.6,
  maxScale: 2.2,
};
const widgetLayoutState = {
  editMode: false,
  widgets: new Map(),
  activePointers: new Map(),
};
const rideHistoryState = {
  rides: [],
  selectedRideId: null,
  selectedStream: [],
  loading: false,
  loaded: false,
};

const rollingSamples = [];
const primaryMetricSamples = [];
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
const POWER_KJ_BUCKET_MIN_WATTS = 180;
const POWER_KJ_BUCKET_MAX_WATTS = 275;
const POWER_KJ_BUCKET_WIDTH_WATTS = 3;
const POWER_KJ_BUCKET_TARGET_TOTAL_KJ = 772;
const POWER_KJ_TARGET_HUMP_CENTER_WATTS = 215;
const POWER_KJ_TARGET_HUMP_SPREAD_WATTS = 20;
const POWER_KJ_TARGET_HUMP_WEIGHT = 0.7;
const MAX_CUSTOM_POWER_KJ_BUCKETS = 7;
const MAX_RIDE_EVENTS = 8;
const RIDE_EVENT_FLASH_MS = 15000;
const RIDE_EVENT_CONFIRM_WATTS = 0;
const RIDE_EVENT_CONFIRM_SECONDS = 2;
let powerDevice;
let heartRateDevice;
let powerCharacteristic;
let heartRateCharacteristic;
let latestPowerWatts = null;
let latestHeartRateBpm = null;
let latestCadenceRpm = null;
let latestBalancePercent = null;
let lastDisplayedPowerWatts = null;
let lastDisplayedHeartRateBpm = null;
let lastDisplayedBalancePercent = null;
let previousCrankData = null;
let rideState = null;
let lastPowerSampleTimestamp = null;
let powerConnected = false;
let heartRateConnected = false;
let rideHeartRateSamples = [];
let popupGraphWindow = null;
let reinforcementFeedbackEnabled = false;
let popupGraphCanvas = null;
let popupGraphContext = null;
let textScalingPopupWindow = null;
let highCadenceStartedAtMs = null;
let lastAutoNavigateAtMs = 0;
const popupGraphPoints = [];
const powerKjBuckets = [];
const powerKjBucketSettings = createDefaultPowerKjBucketSettings();
const rideEventSettings = createDefaultRideEventSettings();
let lastPowerBucketSampleTimestamp = null;
const GAME_SENSITIVITY_STORAGE_KEY = "gameSensitivityPercent:v1";
const GAME_BEST_SCORE_STORAGE_KEY = "gameBestScore:v1";
const DOI_SUTHEP_MODEL = {
  distanceMeters: 10800,
  elevationGainMeters: 622,
  averageGrade: 0.058,
  crr: 0.004,
  rho: 1.1,
  g: 9.81,
  drivetrainEfficiency: 0.97,
  defaultBikeWeightKg: 8,
  reference: {
    riderWeightKg: 71.8,
    bikeWeightKg: 8,
    powerWatts: 283,
    timeSeconds: 2213,
  },
};

let climbModelCalibration = null;
let lastClimbCalculation = null;
let activeRideEvent = null;
let rideEventOverlayTimerId = null;

const gameState = {
  riderYPercent: 50,
  smoothedVelocity: 0,
  markerOffsetPx: 0,
  markerSpacingPx: 90,
  baselineWatts: null,
  sensitivityPercent: 4,
  lastUpdateMs: Date.now(),
  score: 0,
  bestScore: 0,
  dodges: 0,
  isCrashed: false,
  crashCooldownMs: 0,
  obstacleSpawnCooldownMs: 900,
  obstacleSpawnTimerMs: 650,
  obstacles: [],
  obstacleSerial: 0,
};

connectBtn.addEventListener("click", connectPowerMeter);
connectHrBtn.addEventListener("click", connectHeartRateMonitor);
reinforcementFeedbackBtnEl?.addEventListener("click", toggleReinforcementFeedback);
startRideBtn.addEventListener("click", startRideRecording);
openPopupGraphBtnEl?.addEventListener("click", openPopupGraphWindow);
openTextScalingPopupBtnEl?.addEventListener("click", openTextScalingPopupWindowHandler);
reportEfficiencyCheckboxEl?.addEventListener("change", () => {
  localStorage.setItem(REPORT_EFFICIENCY_STORAGE_KEY, reportEfficiencyCheckboxEl.checked ? "1" : "0");
});
powerKjBucketsEnabledCheckboxEl?.addEventListener("change", () => {
  powerKjBucketSettings.enabled = Boolean(powerKjBucketsEnabledCheckboxEl.checked);
  persistPowerKjBucketSettings();
  updatePowerKjBucketVisibility();
});
addCustomBucketBtnEl?.addEventListener("click", addCustomPowerKjBucket);
resetCustomBucketsBtnEl?.addEventListener("click", resetCustomPowerKjBuckets);
addRideEventBtnEl?.addEventListener("click", addRideEventSetting);
resetRideEventsBtnEl?.addEventListener("click", resetRideEventSettings);
targetHrInputEl?.addEventListener("input", () => {
  updateTargetGuidanceLabel();
  recomputeRideHeartRateTotals();
  updateRollingAverages();
  updateGuidancePanel();
  updateReinforcementFeedbackState();
});

reinforcementLowerBoundInputEl?.addEventListener("input", () => {
  updateReinforcementFeedbackState();
});

reinforcementUpperBoundInputEl?.addEventListener("input", () => {
  updateReinforcementFeedbackState();
});

navTabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
switchView("dashboard");

updateConnectionButtonLayout();
updateTargetGuidanceLabel();
updateRideProgressUi();
updatePowerPhaseExplorer();
renderInstantPhaseFeed();
renderPowerKjBuckets();
initializeTextScaling();
initializeReportSettings();
initializePowerKjBucketSettings();
initializeRideEventSettings();
initializeWidgetLayoutSystem();
initializeGameTab();
initializeRideHistoryTab();
initializeClimbCalculator();
updatePrimaryMetricDisplays();
setInterval(updateRideProgressUi, 1000);
setInterval(updatePopupGraph, 1000);
setInterval(updateGameState, 100);

function toggleReinforcementFeedback() {
  reinforcementFeedbackEnabled = !reinforcementFeedbackEnabled;

  if (reinforcementFeedbackBtnEl) {
    reinforcementFeedbackBtnEl.classList.toggle("active", reinforcementFeedbackEnabled);
    reinforcementFeedbackBtnEl.setAttribute("aria-pressed", reinforcementFeedbackEnabled ? "true" : "false");
  }

  if (!reinforcementFeedbackEnabled) {
    document.body.classList.remove("reinforcement-out-of-pocket");
  }

  updateReinforcementFeedbackState();
}

function updateReinforcementFeedbackState() {
  const bounds = getReinforcementHeartRateBounds();
  const inPocket = isHeartRateInPocket(latestHeartRateBpm, bounds);
  const shouldFlash = reinforcementFeedbackEnabled && inPocket === false;

  document.body.classList.toggle("reinforcement-out-of-pocket", shouldFlash);
}

function getReinforcementHeartRateBounds() {
  const lowerBound = Number(reinforcementLowerBoundInputEl?.value);
  const upperBound = Number(reinforcementUpperBoundInputEl?.value);

  if (!Number.isFinite(lowerBound) || !Number.isFinite(upperBound) || lowerBound <= 0 || upperBound <= 0 || lowerBound > upperBound) {
    return null;
  }

  return { lowerBound, upperBound };
}

function isHeartRateInPocket(currentHeartRate, bounds) {
  if (!Number.isFinite(currentHeartRate) || !bounds) {
    return null;
  }

  return currentHeartRate >= bounds.lowerBound && currentHeartRate <= bounds.upperBound;
}

async function connectPowerMeter() {
  if (!navigator.bluetooth) {
    setStatus("Web Bluetooth not available in this browser.");
    return;
  }

  connectBtn.disabled = true;
  setStatus("Opening power meter picker...");

  try {
    const powerMeterFilters = [
      { services: [CYCLING_POWER_SERVICE] },
      ...POWER_METER_NAME_PREFIXES.flatMap((namePrefix) => [
        { namePrefix, services: [CYCLING_POWER_SERVICE] },
        { namePrefix },
      ]),
    ];

    powerDevice = await navigator.bluetooth.requestDevice({
      filters: powerMeterFilters,
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
    joulesAccumulated: 0,
    activeSeconds: 0,
    completed: false,
    completionTimestamp: null,
    totalBreaths: 0,
    hrSum: 0,
    hrCount: 0,
    hrAbsErrorSum: 0,
    heartRateWalk: 0,
    heartRateWalkSamples: [],
    lastHeartRateWalkSecond: null,
    efficiencySamples: [],
    reportsDownloaded: false,
    rideEvents: getConfiguredRideEvents(),
    completedRideEvents: [],
    pendingRideEventCount: 0,
  };
  activeRideEvent = null;
  stopRideEventOverlay();
  lastPowerSampleTimestamp = null;
  rideHeartRateSamples = [];
  popupGraphPoints.length = 0;
  resetPowerKjBuckets();

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
    ? Math.max(0, (((rideState.completed && Number.isFinite(rideState.completionTimestamp))
      ? rideState.completionTimestamp
      : Date.now()) - rideState.startTimestamp) / 1000)
    : 0;
  const averageWatts = rideState.activeSeconds > 0
    ? (rideState.joulesAccumulated / rideState.activeSeconds)
    : null;

  return { doneKj, remainingKj, etaSeconds, percentComplete, elapsedSeconds, averageWatts };
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
    if (rideAvgWattsEl) {
      rideAvgWattsEl.textContent = "AVG W: --";
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
  if (rideAvgWattsEl) {
    rideAvgWattsEl.textContent = stats.averageWatts == null
      ? "AVG W: --"
      : `AVG W: ${formatNumber(stats.averageWatts, 1)}`;
  }
  rideProgressFillEl.style.width = `${formatNumber(percent, 2)}%`;
  rideProgressTrackEl?.setAttribute("aria-valuenow", `${formatNumber(percent, 2)}`);
  updateBreathingMetrics();
  updateGuidancePanel();
  updateStartButtonVisibility();

  if (stats.remainingKj <= 0 && !rideState.completed) {
    rideState.completed = true;
    rideState.completionTimestamp = Date.now();
    setStatus(`Ride target complete: ${formatNumber(rideState.targetKj, 2)} kJ done.`);
    maybeDownloadRideReports();
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
  if (rideState?.completed) {
    return;
  }

  const value = event.target.value;
  const flags = value.getUint16(0, true);
  const watts = value.getInt16(2, true);

  latestPowerWatts = watts;
  const parsedPowerMeasurement = parsePowerMeasurementDetails(value, flags);
  latestCadenceRpm = parsedPowerMeasurement.cadence;
  latestBalancePercent = parsedPowerMeasurement.balancePercent;

  const now = Date.now();
  addPrimaryMetricSample(now);
  updatePrimaryMetricDisplays(now);
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
  accumulatePowerBucketEnergy(watts, now);
  maybeAutoNavigateByCadence(now);

  maybeAddRollingSample(now);
  updateRollingAverages();
  updateRideProgressUi();
  updatePopupGraph();
}

function maybeAutoNavigateByCadence(nowMs) {
  if (!Number.isFinite(latestCadenceRpm) || latestCadenceRpm < AUTO_NAVIGATE_CADENCE_THRESHOLD) {
    highCadenceStartedAtMs = null;
    return;
  }

  if (highCadenceStartedAtMs == null) {
    highCadenceStartedAtMs = nowMs;
    return;
  }

  const heldDurationMs = nowMs - highCadenceStartedAtMs;
  const cooldownElapsedMs = nowMs - lastAutoNavigateAtMs;
  if (heldDurationMs < AUTO_NAVIGATE_HOLD_MS || cooldownElapsedMs < AUTO_NAVIGATE_COOLDOWN_MS) {
    return;
  }

  navigateToNextView();
  lastAutoNavigateAtMs = nowMs;
  highCadenceStartedAtMs = nowMs;
}

function navigateToNextView() {
  const activeIndex = VIEW_ROTATION_ORDER.findIndex((viewName) => {
    const tab = navTabs.find((entry) => entry.dataset.view === viewName);
    return tab?.classList.contains("active");
  });

  const nextIndex = activeIndex >= 0
    ? (activeIndex + 1) % VIEW_ROTATION_ORDER.length
    : 0;

  switchView(VIEW_ROTATION_ORDER[nextIndex]);
}


function parsePowerMeasurementDetails(value, flags) {
  const crankDataOffset = getCrankDataOffset(flags);
  const cadence = parseCadenceFromPowerMeasurement(value, flags, crankDataOffset);
  const offsetAfterStandardFields = getCyclingPowerMeasurementEndOffset(flags);

  return {
    cadence,
    balancePercent: parsePedalBalanceFromPowerMeasurement(value, flags),
    powerPhase: parseAssiomaPowerPhaseExtension(value, offsetAfterStandardFields),
  };
}

function parsePedalBalanceFromPowerMeasurement(value, flags) {
  const PEDAL_POWER_BALANCE_PRESENT_FLAG = 0x01;
  if ((flags & PEDAL_POWER_BALANCE_PRESENT_FLAG) === 0 || value.byteLength < 5) {
    return null;
  }

  const rawBalance = value.getUint8(4);
  const leftPercent = rawBalance / 2;
  if (!Number.isFinite(leftPercent) || leftPercent < 0 || leftPercent > 100) {
    return null;
  }

  return leftPercent;
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

  // Some firmware revisions prepend odd-length metadata, so scan byte by byte
  // instead of assuming 2-byte alignment.
  for (let candidateOffset = offset; candidateOffset <= value.byteLength - minimumBlockBytes; candidateOffset += 1) {
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

  const left = isFiniteAngle(leftStart) && isFiniteAngle(leftEnd)
    ? {
      start: leftStart,
      end: leftEnd,
      peakStart: leftPeakStart,
      peakEnd: leftPeakEnd,
    }
    : null;
  const right = isFiniteAngle(rightStart) && isFiniteAngle(rightEnd)
    ? {
      start: rightStart,
      end: rightEnd,
      peakStart: rightPeakStart,
      peakEnd: rightPeakEnd,
    }
    : null;

  if (!left && !right) {
    return null;
  }

  return {
    left,
    right,
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
  const deltaSeconds = Math.max(0, cappedElapsedSeconds);
  const deltaJoules = watts * deltaSeconds;
  const deltaKj = deltaJoules / 1000;
  rideState.doneKj += deltaKj;
  rideState.joulesAccumulated += deltaJoules;
  rideState.activeSeconds += deltaSeconds;
  lastPowerSampleTimestamp = timestamp;
  processRideEvents(timestamp, watts);
}

function processRideEvents(timestamp, watts) {
  if (!rideState?.started || rideState.completed) {
    return;
  }

  const rideEvents = Array.isArray(rideState.rideEvents) ? rideState.rideEvents : [];
  for (const rideEvent of rideEvents) {
    if (!rideEvent.triggered && rideState.doneKj >= rideEvent.targetKj) {
      triggerRideEvent(rideEvent, timestamp);
    }
  }

  const currentActiveRideEvent = activeRideEvent && rideEvents.includes(activeRideEvent) && !activeRideEvent.confirmed
    ? activeRideEvent
    : rideEvents.find((rideEvent) => rideEvent.triggered && !rideEvent.confirmed && !Number.isFinite(rideEvent.expiredAtTimestamp)) || null;

  activeRideEvent = currentActiveRideEvent;
  if (!currentActiveRideEvent) {
    stopRideEventOverlay();
    return;
  }

  const windowExpired = Number.isFinite(currentActiveRideEvent.overlayDeadlineTimestamp)
    && timestamp >= currentActiveRideEvent.overlayDeadlineTimestamp;

  if (windowExpired) {
    currentActiveRideEvent.expiredAtTimestamp = currentActiveRideEvent.overlayDeadlineTimestamp;
    currentActiveRideEvent.confirmationStartedAt = null;
    activeRideEvent = null;
    stopRideEventOverlay();
    return;
  }

  if (Number.isFinite(watts) && watts <= RIDE_EVENT_CONFIRM_WATTS) {
    if (!Number.isFinite(currentActiveRideEvent.confirmationStartedAt)) {
      currentActiveRideEvent.confirmationStartedAt = timestamp;
    }

    const confirmElapsedSeconds = Math.max(0, (timestamp - currentActiveRideEvent.confirmationStartedAt) / 1000);
    if (confirmElapsedSeconds >= RIDE_EVENT_CONFIRM_SECONDS) {
      currentActiveRideEvent.confirmed = true;
      currentActiveRideEvent.confirmedAtTimestamp = timestamp;
      rideState.completedRideEvents = rideEvents.filter((rideEvent) => rideEvent.triggered);
      activeRideEvent = null;
      setStatus(`Ride event confirmed: ${currentActiveRideEvent.label}.`);
      stopRideEventOverlay();
      return;
    }
  } else {
    currentActiveRideEvent.confirmationStartedAt = null;
  }

  showRideEventOverlay(currentActiveRideEvent, timestamp);
  rideState.completedRideEvents = rideEvents.filter((rideEvent) => rideEvent.triggered);
  rideState.pendingRideEventCount = rideEvents.filter((rideEvent) => rideEvent.triggered && !rideEvent.confirmed && !Number.isFinite(rideEvent.expiredAtTimestamp)).length;
}

function triggerRideEvent(rideEvent, timestamp) {
  rideEvent.triggered = true;
  rideEvent.triggeredAtTimestamp = timestamp;
  rideEvent.triggeredAtKj = rideState?.doneKj ?? null;
  rideEvent.overlayDeadlineTimestamp = timestamp + RIDE_EVENT_FLASH_MS;
  rideState.completedRideEvents = (rideState.rideEvents || []).filter((event) => event.triggered);
  setStatus(`Ride event: ${rideEvent.label}. Coast at 0W for 2s to confirm.`);
  showRideEventOverlay(rideEvent, timestamp);
}

function showRideEventOverlay(rideEvent, timestamp = Date.now()) {
  if (!rideEventOverlayEl || !rideEventOverlayLabelEl || !rideEventOverlayGoalEl || !rideEventOverlayCountdownEl) {
    return;
  }

  const remainingMs = Math.max(0, (rideEvent.overlayDeadlineTimestamp || timestamp) - timestamp);
  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  rideEventOverlayLabelEl.textContent = rideEvent.label;
  rideEventOverlayGoalEl.textContent = `${formatNumber(rideEvent.targetKj, 1)} kJ reached • Coast at 0W for 2s to confirm`;
  rideEventOverlayCountdownEl.textContent = rideEvent.confirmed
    ? 'Confirmed'
    : `${remainingSeconds}s remaining`;
  rideEventOverlayEl.hidden = false;
  rideEventOverlayEl.classList.add('active');

  if (rideEventOverlayTimerId != null) {
    clearTimeout(rideEventOverlayTimerId);
  }

  rideEventOverlayTimerId = window.setTimeout(() => {
    if (activeRideEvent === rideEvent && !rideEvent.confirmed) {
      showRideEventOverlay(rideEvent, Date.now());
    }
  }, 250);
}

function stopRideEventOverlay() {
  if (rideEventOverlayTimerId != null) {
    clearTimeout(rideEventOverlayTimerId);
    rideEventOverlayTimerId = null;
  }

  if (!rideEventOverlayEl) {
    return;
  }

  rideEventOverlayEl.hidden = true;
  rideEventOverlayEl.classList.remove('active');
}

function createPowerKjBucket(startWatts, endWatts, targetKj) {
  return {
    index: 0,
    startWatts,
    endWatts,
    targetKj,
    currentKj: 0,
    rowEl: null,
    valueEl: null,
    efficiencyEl: null,
    fillEl: null,
    heartRateSum: 0,
    heartRateCount: 0,
    isAccumulating: false,
  };
}

function createDefaultPowerKjBucketSettings() {
  return {
    enabled: true,
    customBuckets: [],
  };
}

function createDefaultRideEventSettings() {
  return {
    events: [
      { label: "Nutrition", targetKj: 100 },
      { label: "Position Check", targetKj: 200 },
    ],
  };
}

function createRideEventDefinition(label, targetKj) {
  return {
    label: String(label || "Event").trim() || "Event",
    targetKj: Number(targetKj),
  };
}

function getConfiguredRideEvents() {
  const configuredEvents = sanitizeRideEvents(rideEventSettings.events);
  return configuredEvents
    .map((event, index) => ({
      id: `${index}-${event.label}-${event.targetKj}`,
      label: event.label,
      targetKj: event.targetKj,
      triggered: false,
      triggeredAtKj: null,
      triggeredAtTimestamp: null,
      confirmed: false,
      confirmedAtTimestamp: null,
      confirmationStartedAt: null,
      expiredAtTimestamp: null,
      overlayDeadlineTimestamp: null,
    }))
    .sort((left, right) => left.targetKj - right.targetKj);
}

function sanitizeRideEvents(events) {
  return (Array.isArray(events) ? events : [])
    .map((event) => createRideEventDefinition(event?.label, event?.targetKj))
    .filter((event) => event.label && Number.isFinite(event.targetKj) && event.targetKj > 0)
    .sort((left, right) => left.targetKj - right.targetKj)
    .slice(0, MAX_RIDE_EVENTS);
}

function createDefaultPowerKjBuckets() {
  const buckets = [];
  for (let bucketStart = POWER_KJ_BUCKET_MIN_WATTS; bucketStart <= POWER_KJ_BUCKET_MAX_WATTS; bucketStart += POWER_KJ_BUCKET_WIDTH_WATTS) {
    const bucketEnd = Math.min(bucketStart + POWER_KJ_BUCKET_WIDTH_WATTS - 1, POWER_KJ_BUCKET_MAX_WATTS);
    buckets.push(createPowerKjBucket(bucketStart, bucketEnd, 0));
  }

  const baselineWeight = 1;
  let totalWeight = 0;
  for (const bucket of buckets) {
    const midpoint = (bucket.startWatts + bucket.endWatts) / 2;
    const distance = midpoint - POWER_KJ_TARGET_HUMP_CENTER_WATTS;
    const gaussian = Math.exp(-(distance * distance) / (2 * POWER_KJ_TARGET_HUMP_SPREAD_WATTS ** 2));
    bucket.targetWeight = baselineWeight + POWER_KJ_TARGET_HUMP_WEIGHT * gaussian;
    totalWeight += bucket.targetWeight;
  }

  for (const bucket of buckets) {
    bucket.targetKj = (bucket.targetWeight / totalWeight) * POWER_KJ_BUCKET_TARGET_TOTAL_KJ;
  }

  return buckets.map((bucket, index) => ({ ...bucket, index }));
}

function getConfiguredPowerKjBuckets() {
  const customBuckets = powerKjBucketSettings.customBuckets || [];
  const sourceBuckets = customBuckets.length > 0
    ? customBuckets.map((bucket) => createPowerKjBucket(bucket.startWatts, bucket.endWatts, bucket.targetKj))
    : createDefaultPowerKjBuckets();

  return sourceBuckets.map((bucket, index) => ({ ...bucket, index }));
}

function rebuildPowerKjBuckets() {
  const nextBuckets = getConfiguredPowerKjBuckets();
  powerKjBuckets.length = 0;
  powerKjBuckets.push(...nextBuckets);
  lastPowerBucketSampleTimestamp = null;
  renderPowerKjBuckets();
}

function resetPowerKjBuckets() {
  for (const bucket of powerKjBuckets) {
    bucket.currentKj = 0;
    bucket.heartRateSum = 0;
    bucket.heartRateCount = 0;
    bucket.isAccumulating = false;
  }
  lastPowerBucketSampleTimestamp = null;
  renderPowerKjBuckets();
}

function accumulatePowerBucketEnergy(watts, timestamp) {
  const matchedBucket = getPowerBucketForWatts(watts);
  setAccumulatingPowerKjBucket(matchedBucket);

  if (!Number.isFinite(watts)) {
    lastPowerBucketSampleTimestamp = timestamp;
    return;
  }

  if (!Number.isFinite(lastPowerBucketSampleTimestamp)) {
    lastPowerBucketSampleTimestamp = timestamp;
    return;
  }

  const elapsedSeconds = Math.min(Math.max(0, (timestamp - lastPowerBucketSampleTimestamp) / 1000), 5);
  lastPowerBucketSampleTimestamp = timestamp;

  if (elapsedSeconds <= 0 || !matchedBucket) {
    return;
  }

  matchedBucket.currentKj += (watts * elapsedSeconds) / 1000;
  if (Number.isFinite(latestHeartRateBpm) && latestHeartRateBpm > 0) {
    matchedBucket.heartRateSum += latestHeartRateBpm;
    matchedBucket.heartRateCount += 1;
  }
  updatePowerKjBucketRow(matchedBucket);
}

function getPowerBucketForWatts(watts) {
  if (!Number.isFinite(watts)) {
    return null;
  }

  return powerKjBuckets.find((bucket) => watts >= bucket.startWatts && watts <= bucket.endWatts) || null;
}

function setAccumulatingPowerKjBucket(activeBucket) {
  for (const bucket of powerKjBuckets) {
    const shouldAccumulate = bucket === activeBucket;
    if (bucket.isAccumulating === shouldAccumulate) {
      continue;
    }
    bucket.isAccumulating = shouldAccumulate;
    updatePowerKjBucketRow(bucket);
  }
}

function renderPowerKjBuckets() {
  if (!powerKjBucketsGridEl) {
    return;
  }

  updatePowerKjBucketSubtitle();
  powerKjBucketsGridEl.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const bucket of powerKjBuckets) {
    const rowEl = document.createElement("article");
    rowEl.className = "power-kj-bucket-row";
    rowEl.setAttribute("role", "listitem");

    const labelEl = document.createElement("p");
    labelEl.className = "power-kj-bucket-label";
    labelEl.textContent = `${bucket.startWatts}-${bucket.endWatts}W`;

    const valueEl = document.createElement("p");
    valueEl.className = "power-kj-bucket-value";

    const efficiencyEl = document.createElement("p");
    efficiencyEl.className = "power-kj-bucket-efficiency";

    const trackEl = document.createElement("div");
    trackEl.className = "power-kj-bucket-track";

    const fillEl = document.createElement("div");
    fillEl.className = "power-kj-bucket-fill";
    trackEl.appendChild(fillEl);

    rowEl.append(labelEl, valueEl, efficiencyEl, trackEl);
    fragment.appendChild(rowEl);

    bucket.rowEl = rowEl;
    bucket.valueEl = valueEl;
    bucket.efficiencyEl = efficiencyEl;
    bucket.fillEl = fillEl;
    updatePowerKjBucketRow(bucket);
  }

  powerKjBucketsGridEl.appendChild(fragment);
}

function updatePowerKjBucketRow(bucket) {
  if (!bucket?.rowEl || !bucket.valueEl || !bucket.efficiencyEl || !bucket.fillEl) {
    return;
  }

  const percent = bucket.targetKj > 0 ? Math.min((bucket.currentKj / bucket.targetKj) * 100, 100) : 0;
  const isComplete = bucket.currentKj >= bucket.targetKj;
  const avgHeartRate = bucket.heartRateCount > 0 ? bucket.heartRateSum / bucket.heartRateCount : null;
  const bucketWattsReference = (bucket.startWatts + bucket.endWatts) / 2;
  const bucketEfficiency = Number.isFinite(avgHeartRate) && avgHeartRate > 0
    ? bucketWattsReference / avgHeartRate
    : null;

  bucket.valueEl.textContent = `${formatNumber(bucket.currentKj, 1)} / ${formatNumber(bucket.targetKj, 1)} kJ`;
  bucket.efficiencyEl.textContent = bucketEfficiency == null
    ? "Efficiency: --"
    : `Efficiency: ${formatNumber(bucketEfficiency, 2)} W/BPM`;
  bucket.fillEl.style.width = `${percent}%`;
  bucket.rowEl.classList.toggle("complete", isComplete);
  bucket.rowEl.classList.toggle("accumulating", Boolean(bucket.isAccumulating));
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
  if (rideState?.completed) {
    return;
  }

  const value = event.target.value;
  const flags = value.getUint8(0);
  const isHeartRate16Bit = (flags & 0x01) !== 0;
  const heartRate = isHeartRate16Bit ? value.getUint16(1, true) : value.getUint8(1);

  latestHeartRateBpm = heartRate;

  const now = Date.now();
  addPrimaryMetricSample(now);
  updatePrimaryMetricDisplays(now);

  if (rideState?.started) {
    const targetHr = getTargetHeartRate();
    rideState.hrSum += heartRate;
    rideState.hrCount += 1;
    rideHeartRateSamples.push(heartRate);
    if (targetHr != null) {
      rideState.hrAbsErrorSum += Math.abs(heartRate - targetHr);
    }
  }

  maybeAddRollingSample(now);
  updateRollingAverages();
  updateRideProgressUi();
  updateReinforcementFeedbackState();
}

function maybeAddRollingSample(now = Date.now()) {
  if (latestPowerWatts == null) {
    return;
  }

  const sample = {
    watts: latestPowerWatts,
    heartRate: latestHeartRateBpm,
    cadence: latestCadenceRpm,
    balancePercent: latestBalancePercent,
    breathsPerMinute: estimateBreathsPerMinute(latestHeartRateBpm),
    timestamp: now,
  };

  rollingSamples.push(sample);

  if (rideState?.started) {
    rideState.efficiencySamples.push(sample);
  }

  pruneRollingSamples(now);
}

function pruneRollingSamples(now) {
  const oldestAllowed = now - MAX_WINDOW_MS;
  while (rollingSamples.length > 0 && rollingSamples[0].timestamp < oldestAllowed) {
    rollingSamples.shift();
  }
}

function addPrimaryMetricSample(timestamp = Date.now()) {
  primaryMetricSamples.push({
    timestamp,
    watts: latestPowerWatts,
    heartRate: latestHeartRateBpm,
    balancePercent: latestBalancePercent,
  });
  prunePrimaryMetricSamples(timestamp);
}

function prunePrimaryMetricSamples(now) {
  const oldestAllowed = now - 3000;
  while (primaryMetricSamples.length > 0 && primaryMetricSamples[0].timestamp < oldestAllowed) {
    primaryMetricSamples.shift();
  }
}

function updatePrimaryMetricDisplays(now = Date.now()) {
  prunePrimaryMetricSamples(now);
  const windowSamples = primaryMetricSamples.filter((sample) => sample.timestamp >= now - 3000);
  lastDisplayedPowerWatts = getAverageFromSamples(windowSamples, (sample) => sample.watts);
  lastDisplayedHeartRateBpm = getAverageFromSamples(windowSamples, (sample) => sample.heartRate);
  lastDisplayedBalancePercent = getAverageFromSamples(windowSamples, (sample) => sample.balancePercent);

  if (wattsEl) {
    wattsEl.textContent = formatNumber(lastDisplayedPowerWatts, 2);
  }
  if (heartRateEl) {
    heartRateEl.textContent = formatNumber(lastDisplayedHeartRateBpm, 2);
  }
  if (balanceEl) {
    balanceEl.textContent = formatBalance(lastDisplayedBalancePercent);
  }
}

function updateRollingAverages() {
  const now = Date.now();
  pruneRollingSamples(now);

  setWindowMetrics(now, WINDOWS_IN_MS["1m"], avg1mEl, pv1mEl, hrAvg1mEl, balanceAvg1mEl, cadAvg1mEl, wpHr1mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["3m"], avg3mEl, pv3mEl, hrAvg3mEl, balanceAvg3mEl, cadAvg3mEl, wpHr3mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["5m"], avg5mEl, pv5mEl, hrAvg5mEl, balanceAvg5mEl, cadAvg5mEl, wpHr5mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["10m"], avg10mEl, pv10mEl, hrAvg10mEl, balanceAvg10mEl, cadAvg10mEl, wpHr10mEl);
  setWindowMetrics(now, WINDOWS_IN_MS["20m"], avg20mEl, pv20mEl, hrAvg20mEl, balanceAvg20mEl, cadAvg20mEl, wpHr20mEl);
  updateBreathingMetrics();
  updateGuidancePanel();
  updatePowerPhaseExplorer();
}

function setWindowMetrics(now, windowMs, powerEl, variabilityEl, heartRateAvgEl, balanceAvgEl, cadenceAvgEl, wpHrEl) {
  const avgPower = getWindowAveragePower(now, windowMs);
  const startTime = now - windowMs;
  const samplesInWindow = rollingSamples.filter((sample) => sample.timestamp >= startTime);

  if (samplesInWindow.length === 0 || avgPower == null) {
    powerEl.textContent = "--";
    variabilityEl.textContent = "--";
    heartRateAvgEl.textContent = "--";
    balanceAvgEl.textContent = "--";
    cadenceAvgEl.textContent = "--";
    wpHrEl.textContent = "--";
    return;
  }

  const heartRateSamples = samplesInWindow.filter((sample) => Number.isFinite(sample.heartRate));
  const avgHeartRate = heartRateSamples.length > 0
    ? heartRateSamples.reduce((sum, sample) => sum + sample.heartRate, 0) / heartRateSamples.length
    : null;
  const balanceSamples = samplesInWindow.filter((sample) => Number.isFinite(sample.balancePercent));
  const avgBalance = balanceSamples.length > 0
    ? balanceSamples.reduce((sum, sample) => sum + sample.balancePercent, 0) / balanceSamples.length
    : null;
  const cadenceSamples = samplesInWindow.filter((sample) => Number.isFinite(sample.cadence));
  const avgCadence = cadenceSamples.length > 0
    ? cadenceSamples.reduce((sum, sample) => sum + sample.cadence, 0) / cadenceSamples.length
    : null;

  powerEl.textContent = formatNumber(avgPower, 2);

  const powerVariability = calculatePowerVariability(now, windowMs, avgPower);
  variabilityEl.textContent = powerVariability == null ? "--" : `${formatNumber(powerVariability, 2)}%`;


  heartRateAvgEl.textContent = avgHeartRate == null ? "--" : formatNumber(avgHeartRate, 2);
  balanceAvgEl.textContent = formatBalance(avgBalance);
  cadenceAvgEl.textContent = avgCadence == null ? "--" : formatNumber(avgCadence, 2);

  if (!Number.isFinite(avgHeartRate) || avgHeartRate <= 0) {
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

function recordRideHeartRateWalkSample(timestamp, heartRate) {
  if (!rideState?.started || rideState.completed || !Number.isFinite(rideState.startTimestamp)) {
    return;
  }

  if (!Number.isFinite(heartRate) || heartRate <= 0) {
    return;
  }

  const secondIndex = Math.max(0, Math.floor((timestamp - rideState.startTimestamp) / 1000));
  if (rideState.lastHeartRateWalkSecond === secondIndex) {
    return;
  }

  const previousHeartRate = rideState.heartRateWalkSamples.length > 0
    ? rideState.heartRateWalkSamples[rideState.heartRateWalkSamples.length - 1].heartRate
    : null;
  const walkDelta = Number.isFinite(previousHeartRate) ? Math.abs(heartRate - previousHeartRate) : 0;

  rideState.heartRateWalk += walkDelta;
  rideState.lastHeartRateWalkSecond = secondIndex;
  rideState.heartRateWalkSamples.push({
    secondIndex,
    minuteIndex: Math.floor(secondIndex / 60),
    heartRate,
    walkDelta,
  });
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
    if (rideHeartRateWalkEl) {
      rideHeartRateWalkEl.textContent = "--";
    }
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
  if (rideHeartRateWalkEl) {
    rideHeartRateWalkEl.textContent = formatNumber(rideState.heartRateWalk || 0, 0);
  }
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
  if (!rideState || rideState.completed) {
    return;
  }

  recordRideHeartRateWalkSample(Date.now(), latestHeartRateBpm);

  if (latestHeartRateBpm == null || latestPowerWatts == null) {
    return;
  }

  const breathsPerMinute = estimateBreathsPerMinute(latestHeartRateBpm);
  if (breathsPerMinute == null) {
    return;
  }

  rideState.totalBreaths += breathsPerMinute / 60;
}, 1000);



function openTextScalingPopupWindowHandler() {
  if (textScalingPopupWindow && !textScalingPopupWindow.closed) {
    textScalingPopupWindow.focus();
    return;
  }

  const popupWidth = 600;
  const popupHeight = 520;
  const popupLeft = Math.max(0, window.screenX + 80);
  const popupTop = Math.max(0, window.screenY + 60);
  textScalingPopupWindow = window.open(
    "",
    "textScalingSettings",
    `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`,
  );

  if (!textScalingPopupWindow) {
    setStatus("Popup blocked. Allow popups to open text scaling settings.");
    return;
  }

  const popupDocument = textScalingPopupWindow.document;
  popupDocument.title = "Text Scaling Settings";
  popupDocument.body.innerHTML = `
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        background: #020617;
        color: #e2e8f0;
        font-family: Inter, Segoe UI, Roboto, sans-serif;
        min-height: 100vh;
      }
      .popup-wrap {
        padding: 1rem;
        display: grid;
        gap: 0.8rem;
      }
      .popup-title {
        margin: 0;
        font-size: 1rem;
        letter-spacing: 0.03em;
      }
      .popup-hint {
        margin: 0;
        color: #94a3b8;
        font-size: 0.82rem;
      }
      .popup-controls {
        display: grid;
        gap: 0.55rem;
      }
      .popup-controls .settings-row {
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.55rem;
        padding: 0.5rem 0.65rem;
        background: rgba(15, 23, 42, 0.7);
      }
    </style>
    <div class="popup-wrap">
      <p class="popup-title">Text Scaling</p>
      <p class="popup-hint">These controls are linked to the main Settings tab in real time.</p>
      <div id="popupTextScalingControls" class="popup-controls"></div>
    </div>
  `;

  const sourceGrid = settingsViewEl?.querySelector('[aria-label="Text scaling"] .settings-grid');
  const targetGrid = popupDocument.getElementById("popupTextScalingControls");
  if (!sourceGrid || !targetGrid) {
    return;
  }

  sourceGrid.querySelectorAll('.settings-row').forEach((rowEl) => {
    const clone = rowEl.cloneNode(true);
    const slider = clone.querySelector('input.settings-slider');
    const valueEl = clone.querySelector('.settings-value');
    const sourceSlider = rowEl.querySelector('input.settings-slider');
    const sourceValueEl = rowEl.querySelector('.settings-value');

    if (!slider || !sourceSlider) {
      targetGrid.appendChild(clone);
      return;
    }

    const sourceId = sourceSlider.id;
    const popupId = `popup-${sourceId}`;
    slider.id = popupId;
    clone.setAttribute("for", popupId);
    const labelSpan = clone.querySelector('.settings-label');
    if (labelSpan) {
      labelSpan.id = `${popupId}-label`;
    }

    slider.value = sourceSlider.value;
    if (valueEl && sourceValueEl) {
      valueEl.textContent = sourceValueEl.textContent;
    }

    slider.addEventListener('input', () => {
      sourceSlider.value = slider.value;
      sourceSlider.dispatchEvent(new Event('input', { bubbles: true }));
      if (sourceValueEl && valueEl) {
        valueEl.textContent = sourceValueEl.textContent;
      }
    });

    sourceSlider.addEventListener('input', () => {
      slider.value = sourceSlider.value;
      if (sourceValueEl && valueEl) {
        valueEl.textContent = sourceValueEl.textContent;
      }
    });

    targetGrid.appendChild(clone);
  });
}

function openPopupGraphWindow() {
  if (popupGraphWindow && !popupGraphWindow.closed) {
    popupGraphWindow.focus();
    return;
  }

  const popupWidth = Math.max(900, Math.floor(window.screen.availWidth));
  const popupHeight = Math.max(420, Math.floor(window.screen.availHeight * 0.7));
  popupGraphWindow = window.open("", "powerPopupGraph", `width=${popupWidth},height=${popupHeight},left=0,top=0`);
  if (!popupGraphWindow) {
    setStatus("Popup blocked. Allow popups to open the graph window.");
    return;
  }

  const popupDocument = popupGraphWindow.document;
  popupDocument.title = "Ride Watts Graph";
  popupDocument.body.innerHTML = `
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        background: #020617;
        color: #e2e8f0;
        font-family: Inter, Segoe UI, Roboto, sans-serif;
        display: grid;
        grid-template-rows: auto 1fr;
        min-height: 100vh;
      }
      .popup-header {
        padding: 0.6rem 0.8rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.25);
        font-size: 0.9rem;
        letter-spacing: 0.04em;
      }
      .popup-chart-wrap {
        padding: 0.7rem;
      }
      canvas {
        width: 100%;
        height: 100%;
        min-height: 300px;
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 0.4rem;
        background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
      }
    </style>
    <div class="popup-header">Watts (Y) over ride duration (X)</div>
    <div class="popup-chart-wrap">
      <canvas id="popupGraphCanvas" width="580" height="320" aria-label="Ride watts popup graph"></canvas>
    </div>
  `;

  popupGraphCanvas = popupDocument.getElementById("popupGraphCanvas");
  popupGraphContext = popupGraphCanvas?.getContext("2d") || null;

  popupGraphWindow.addEventListener("beforeunload", () => {
    popupGraphWindow = null;
    popupGraphCanvas = null;
    popupGraphContext = null;
  });
  popupGraphWindow.addEventListener("resize", () => {
    drawPopupGraph();
  });

  resizePopupGraphCanvas();
  drawPopupGraph();
}

function updatePopupGraph() {
  if (!popupGraphWindow || popupGraphWindow.closed) {
    popupGraphWindow = null;
    popupGraphCanvas = null;
    popupGraphContext = null;
    return;
  }

  if (!rideState?.started || !Number.isFinite(rideState.startTimestamp)) {
    drawPopupGraph();
    return;
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - rideState.startTimestamp) / 1000));
  if (!Number.isFinite(latestPowerWatts)) {
    drawPopupGraph();
    return;
  }

  const lastPoint = popupGraphPoints[popupGraphPoints.length - 1];
  if (!lastPoint || lastPoint.t !== elapsedSeconds) {
    popupGraphPoints.push({ t: elapsedSeconds, watts: latestPowerWatts });
  } else {
    lastPoint.watts = latestPowerWatts;
  }

  const stats = calculateRideStats();
  const estimatedDuration = stats && Number.isFinite(stats.etaSeconds)
    ? elapsedSeconds + Math.max(0, stats.etaSeconds)
    : Math.max(elapsedSeconds, popupGraphPoints.length > 0 ? popupGraphPoints[popupGraphPoints.length - 1].t : 0);

  const maxDurationSeconds = Math.max(POPUP_GRAPH_MIN_DURATION_SECONDS, estimatedDuration);

  while (popupGraphPoints.length > 0 && popupGraphPoints[0].t < elapsedSeconds - maxDurationSeconds) {
    popupGraphPoints.shift();
  }

  drawPopupGraph(maxDurationSeconds);
}

function resizePopupGraphCanvas() {
  if (!popupGraphCanvas || !popupGraphWindow || popupGraphWindow.closed) {
    return;
  }

  const wrapEl = popupGraphCanvas.parentElement;
  const targetWidth = Math.max(580, Math.floor((wrapEl?.clientWidth || 580) - 2));
  const targetHeight = Math.max(300, Math.floor((popupGraphWindow.innerHeight || 420) - 120));

  popupGraphCanvas.width = targetWidth;
  popupGraphCanvas.height = targetHeight;
}

function drawPopupGraph(maxDurationSeconds = POPUP_GRAPH_MIN_DURATION_SECONDS) {
  if (!popupGraphCanvas || !popupGraphContext) {
    return;
  }

  resizePopupGraphCanvas();

  const ctx = popupGraphContext;
  const width = popupGraphCanvas.width;
  const height = popupGraphCanvas.height;
  const padding = { top: 16, right: 16, bottom: 34, left: 52 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  const maxWatts = POPUP_GRAPH_MAX_WATTS;
  const yTickStep = 100;

  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px sans-serif";

  for (let y = 0; y <= maxWatts; y += yTickStep) {
    const yPos = height - padding.bottom - (y / maxWatts) * innerHeight;
    ctx.strokeStyle = "rgba(51, 65, 85, 0.5)";
    ctx.beginPath();
    ctx.moveTo(padding.left, yPos);
    ctx.lineTo(width - padding.right, yPos);
    ctx.stroke();
    ctx.fillText(String(y), 8, yPos + 4);
  }

  ctx.fillText("Watts", 8, padding.top + 12);
  ctx.fillText(`0s`, padding.left, height - 10);
  ctx.fillText(`${Math.round(maxDurationSeconds)}s`, width - padding.right - 28, height - 10);

  if (popupGraphPoints.length === 0) {
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Start ride recording to populate graph.", padding.left + 10, padding.top + 24);
    return;
  }

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.beginPath();

  popupGraphPoints.forEach((point, index) => {
    const x = padding.left + (Math.min(point.t, maxDurationSeconds) / maxDurationSeconds) * innerWidth;
    const clampedWatts = Math.max(0, Math.min(point.watts, POPUP_GRAPH_MAX_WATTS));
    const y = height - padding.bottom - (clampedWatts / maxWatts) * innerHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function switchView(viewName) {
  const activeView = ["dashboard", "powerPhase", "history", "game", "settings", "climb"].includes(viewName)
    ? viewName
    : "dashboard";

  const isDashboard = activeView === "dashboard";
  const isPowerPhase = activeView === "powerPhase";
  const isHistory = activeView === "history";
  const isGame = activeView === "game";
  const isSettings = activeView === "settings";
  const isClimb = activeView === "climb";

  dashboardViewEl?.classList.toggle("active", isDashboard);
  powerPhaseViewEl?.classList.toggle("active", isPowerPhase);
  historyViewEl?.classList.toggle("active", isHistory);
  gameViewEl?.classList.toggle("active", isGame);
  settingsViewEl?.classList.toggle("active", isSettings);
  climbViewEl?.classList.toggle("active", isClimb);

  if (dashboardViewEl) {
    dashboardViewEl.hidden = !isDashboard;
  }
  if (powerPhaseViewEl) {
    powerPhaseViewEl.hidden = !isPowerPhase;
  }
  if (historyViewEl) {
    historyViewEl.hidden = !isHistory;
  }
  if (gameViewEl) {
    gameViewEl.hidden = !isGame;
  }
  if (settingsViewEl) {
    settingsViewEl.hidden = !isSettings;
  }
  if (climbViewEl) {
    climbViewEl.hidden = !isClimb;
  }

  if (isHistory) {
    ensureRideHistoryLoaded();
  }

  navTabs.forEach((tab) => {
    const isActive = tab.dataset.view === activeView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-current", isActive ? "page" : "false");
  });
}



function initializeGameTab() {
  if (!gameSensitivityInputEl || !gameSceneEl) {
    return;
  }

  const storedRaw = localStorage.getItem(GAME_SENSITIVITY_STORAGE_KEY);
  const storedSensitivity = Number(storedRaw);
  const initialSensitivity = Number.isFinite(storedSensitivity)
    ? Math.min(12, Math.max(1, storedSensitivity))
    : Number(gameSensitivityInputEl.value || 4);

  gameState.sensitivityPercent = initialSensitivity;
  gameSensitivityInputEl.value = String(initialSensitivity);
  updateGameSensitivityLabel();

  gameSensitivityInputEl.addEventListener("input", () => {
    const parsed = Number(gameSensitivityInputEl.value);
    gameState.sensitivityPercent = Number.isFinite(parsed) ? Math.min(12, Math.max(1, parsed)) : 4;
    localStorage.setItem(GAME_SENSITIVITY_STORAGE_KEY, String(gameState.sensitivityPercent));
    updateGameSensitivityLabel();
  });

  const storedBestScore = Number(localStorage.getItem(GAME_BEST_SCORE_STORAGE_KEY));
  gameState.bestScore = Number.isFinite(storedBestScore) && storedBestScore > 0 ? Math.floor(storedBestScore) : 0;

  renderGameTrackMarkers();
  window.addEventListener("resize", renderGameTrackMarkers);
  updateGameHud();
  renderGameRider();
  renderGameObstacles();
  setGameMessage("Dodge objects and rack up points!");
}

function updateGameSensitivityLabel() {
  if (!gameSensitivityValueEl) {
    return;
  }

  gameSensitivityValueEl.textContent = `${formatNumber(gameState.sensitivityPercent, 1)}%`;
}

function updateGameState() {
  if (!gameSceneEl) {
    return;
  }

  const now = Date.now();
  const elapsedMs = Math.max(16, now - (gameState.lastUpdateMs || now));
  gameState.lastUpdateMs = now;

  const baseline = getCurrentGameBaselineWatts();
  gameState.baselineWatts = baseline;

  const currentWatts = Number.isFinite(latestPowerWatts) ? latestPowerWatts : null;
  let normalizedDelta = 0;

  if (currentWatts != null && baseline != null && baseline > 0) {
    const deltaRatio = (currentWatts - baseline) / baseline;
    const sensitivityRatio = Math.max(gameState.sensitivityPercent / 100, 0.01);
    normalizedDelta = Math.max(-1, Math.min(1, deltaRatio / sensitivityRatio));
  }

  const targetVelocity = normalizedDelta * 0.95;
  gameState.smoothedVelocity += (targetVelocity - gameState.smoothedVelocity) * 0.2;
  const movementScale = elapsedMs / 16.67;
  gameState.riderYPercent -= gameState.smoothedVelocity * 1.8 * movementScale;
  gameState.riderYPercent = Math.min(94, Math.max(6, gameState.riderYPercent));

  const scrollSpeedPx = 4 + Math.abs(gameState.smoothedVelocity) * 2.8;
  gameState.markerOffsetPx = (gameState.markerOffsetPx + scrollSpeedPx * movementScale) % gameState.markerSpacingPx;

  updateGameObstacles(elapsedMs, movementScale, scrollSpeedPx);
  updateGameHud(currentWatts, baseline);
  renderGameRider();
  renderGameTrackMarkers();
  renderGameObstacles();
}

function getCurrentGameBaselineWatts() {
  if (rideState) {
    const rideAvgHr = rideState.hrCount > 0 ? rideState.hrSum / rideState.hrCount : null;
    const remainingKj = Math.max(rideState.targetKj - rideState.doneKj, 0);
    const guidedWatts = computeSuggestedWattsForTargetHr(rideAvgHr, remainingKj);

    if (Number.isFinite(guidedWatts) && guidedWatts > 0) {
      return guidedWatts;
    }
  }

  const now = Date.now();
  const avg5mHr = getWindowAverageHeartRate(now, WINDOWS_IN_MS["5m"]);
  const avg5mWatts = getWindowAveragePower(now, WINDOWS_IN_MS["5m"]);
  const targetHr = getTargetHeartRate() ?? TARGET_RIDE_AVG_HEART_RATE;

  if (!Number.isFinite(avg5mHr) || !Number.isFinite(avg5mWatts) || avg5mHr <= 0 || avg5mWatts <= 0 || !Number.isFinite(targetHr)) {
    return null;
  }

  const estimated = (avg5mWatts / avg5mHr) * targetHr;
  if (!Number.isFinite(estimated) || estimated <= 0) {
    return null;
  }

  const upperBound = Math.max(avg5mWatts * 1.35, 80);
  const lowerBound = Math.max(avg5mWatts * 0.65, 50);
  return Math.min(upperBound, Math.max(lowerBound, estimated));
}

function updateGameHud(currentWatts = latestPowerWatts, baseline = gameState.baselineWatts) {
  if (gameScoreEl) {
    gameScoreEl.textContent = String(Math.max(0, Math.floor(gameState.score)));
  }

  if (gameBestScoreEl) {
    gameBestScoreEl.textContent = String(Math.max(0, Math.floor(gameState.bestScore)));
  }

  if (gameDodgesEl) {
    gameDodgesEl.textContent = String(Math.max(0, Math.floor(gameState.dodges)));
  }
  if (gameBaselineWattsEl) {
    gameBaselineWattsEl.textContent = Number.isFinite(baseline) ? `${formatNumber(baseline, 2)} W` : "--";
  }

  if (gameCurrentWattsEl) {
    gameCurrentWattsEl.textContent = Number.isFinite(currentWatts) ? `${formatNumber(currentWatts, 0)} W` : "--";
  }

  if (gameDeltaPercentEl) {
    if (Number.isFinite(currentWatts) && Number.isFinite(baseline) && baseline > 0) {
      const deltaPercent = ((currentWatts - baseline) / baseline) * 100;
      gameDeltaPercentEl.textContent = `${deltaPercent >= 0 ? "+" : ""}${formatNumber(deltaPercent, 2)}%`;
    } else {
      gameDeltaPercentEl.textContent = "--";
    }
  }
}

function renderGameRider() {
  if (!gameRiderEl) {
    return;
  }

  gameRiderEl.style.top = `${formatNumber(gameState.riderYPercent, 2)}%`;
}

function renderGameTrackMarkers() {
  if (!gameTrackMarkersEl || !gameSceneEl) {
    return;
  }

  const sceneWidth = gameSceneEl.clientWidth;
  const markerCount = Math.ceil(sceneWidth / gameState.markerSpacingPx) + 3;
  const markers = [];

  for (let index = 0; index < markerCount; index += 1) {
    const xPos = index * gameState.markerSpacingPx - gameState.markerOffsetPx;
    markers.push(`<span class="game-track-marker" style="left:${xPos}px"></span>`);
  }

  gameTrackMarkersEl.innerHTML = markers.join("");
}


function updateGameObstacles(elapsedMs, movementScale, scrollSpeedPx) {
  if (!gameSceneEl) {
    return;
  }

  if (gameState.crashCooldownMs > 0) {
    gameState.crashCooldownMs = Math.max(0, gameState.crashCooldownMs - elapsedMs);
    if (gameState.crashCooldownMs === 0) {
      gameState.isCrashed = false;
      gameState.score = 0;
      gameState.dodges = 0;
      gameState.obstacles = [];
      gameState.obstacleSpawnTimerMs = 600;
      setGameMessage("Recovered. Build your streak!");
    }
    return;
  }

  const sceneWidth = gameSceneEl.clientWidth;
  const obstacleSpeed = (3.6 + scrollSpeedPx * 0.55) * movementScale;

  gameState.obstacleSpawnTimerMs -= elapsedMs;
  if (gameState.obstacleSpawnTimerMs <= 0) {
    spawnGameObstacle(sceneWidth);
    const difficultyFactor = Math.min(0.42, gameState.score / 9000);
    gameState.obstacleSpawnCooldownMs = 900 - difficultyFactor * 520;
    gameState.obstacleSpawnTimerMs = gameState.obstacleSpawnCooldownMs;
  }

  const riderCenter = gameState.riderYPercent;
  const riderTop = riderCenter - 6;
  const riderBottom = riderCenter + 6;

  gameState.obstacles.forEach((obstacle) => {
    obstacle.x -= obstacleSpeed;

    if (!obstacle.cleared && obstacle.x + obstacle.sizePx < 132) {
      obstacle.cleared = true;
      gameState.dodges += 1;
      gameState.score += 75;
    }

    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + obstacle.sizePx;
    const obstacleTop = obstacle.yPercent - obstacle.heightPercent / 2;
    const obstacleBottom = obstacle.yPercent + obstacle.heightPercent / 2;
    const horizontalHit = obstacleRight >= 80 && obstacleLeft <= 128;
    const verticalHit = obstacleBottom >= riderTop && obstacleTop <= riderBottom;

    if (horizontalHit && verticalHit) {
      triggerGameCrash();
    }
  });

  gameState.obstacles = gameState.obstacles.filter((obstacle) => obstacle.x > -90);

  if (!gameState.isCrashed) {
    gameState.score += Math.max(1, Math.round(elapsedMs * 0.05));
    if (gameState.score > gameState.bestScore) {
      gameState.bestScore = gameState.score;
      localStorage.setItem(GAME_BEST_SCORE_STORAGE_KEY, String(Math.floor(gameState.bestScore)));
    }
  }
}

function spawnGameObstacle(sceneWidth) {
  if (!Number.isFinite(sceneWidth) || sceneWidth <= 0) {
    return;
  }

  const centerVariance = (Math.random() - 0.5) * 64;
  const yPercent = Math.min(92, Math.max(8, 50 + centerVariance));
  const sizePx = 26 + Math.random() * 28;
  const heightPercent = 8 + Math.random() * 8;

  gameState.obstacleSerial += 1;
  gameState.obstacles.push({
    id: gameState.obstacleSerial,
    x: sceneWidth + 32,
    yPercent,
    sizePx,
    heightPercent,
    cleared: false,
  });
}

function triggerGameCrash() {
  if (gameState.isCrashed) {
    return;
  }

  gameState.isCrashed = true;
  gameState.crashCooldownMs = 1200;
  gameState.obstacles = [];
  setGameMessage("Crash! Hold steady and try again.");
}

function setGameMessage(message) {
  if (!gameMessageEl) {
    return;
  }

  gameMessageEl.textContent = message;
}

function renderGameObstacles() {
  if (!gameObstaclesEl) {
    return;
  }

  const obstacleMarkup = gameState.obstacles
    .map((obstacle) => `<span class="game-obstacle" style="left:${formatNumber(obstacle.x, 2)}px;top:${formatNumber(obstacle.yPercent, 2)}%;width:${formatNumber(obstacle.sizePx, 2)}px;height:${formatNumber(obstacle.heightPercent, 2)}%;"></span>`)
    .join("");

  gameObstaclesEl.innerHTML = obstacleMarkup;
}

function initializeTextScaling() {
  const selectorsByCategory = {
    primary: [".watts", ".heart-rate", ".avg-value"],
    secondary: [".avg-sub-value", ".status", ".ride-progress-details span", ".phase-metric-grid dd"],
    label: [".label", ".unit", ".avg-label", ".avg-sub-label", ".ride-label", ".phase-subtitle", ".phase-metric-grid dt", ".phase-description"],
    ui: [".nav-tab", ".connect-btn", ".ride-input", ".ride-input-unit", ".settings-label", ".settings-value"],
    timeBuckets: [".rolling-averages .avg-sub-value", ".rolling-averages .avg-value"],
    kjBuckets: [".power-kj-buckets-card", ".power-kj-bucket-label", ".power-kj-bucket-value", ".power-kj-buckets-subtitle"],
  };

  const inputMap = {
    primary: { input: scalePrimaryInputEl, value: scalePrimaryValueEl, varName: "--text-scale-primary" },
    secondary: { input: scaleSecondaryInputEl, value: scaleSecondaryValueEl, varName: "--text-scale-secondary" },
    label: { input: scaleLabelInputEl, value: scaleLabelValueEl, varName: "--text-scale-label" },
    ui: { input: scaleUiInputEl, value: scaleUiValueEl, varName: "--text-scale-ui" },
    timeBuckets: { input: scaleTimeBucketsInputEl, value: scaleTimeBucketsValueEl, varName: "--text-scale-time-buckets" },
    kjBuckets: { input: scaleKjBucketsInputEl, value: scaleKjBucketsValueEl, varName: "--scale-kj-buckets" },
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
    const initialPercent = Number.isFinite(stored) ? Math.min(400, Math.max(25, stored)) : Number(config.input.value || 100);
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
  valueEl.textContent = `${formatNumber(percent, 2)}%`;
}

function initializeWidgetLayoutSystem() {
  const widgetEls = Array.from(dashboardViewEl?.querySelectorAll("[data-widget-id]") || []);

  widgetEls.forEach((el) => {
    const widgetId = el.dataset.widgetId;
    if (!widgetId) {
      return;
    }

    const dragHandle = document.createElement("button");
    dragHandle.type = "button";
    dragHandle.className = "widget-drag-handle";
    dragHandle.textContent = "Move";
    dragHandle.setAttribute("aria-label", `Move widget ${widgetId}`);

    const resizeHandle = document.createElement("button");
    resizeHandle.type = "button";
    resizeHandle.className = "widget-resize-handle";
    resizeHandle.textContent = "Resize";
    resizeHandle.setAttribute("aria-label", `Resize widget ${widgetId}`);

    const controls = document.createElement("div");
    controls.className = "widget-edit-controls";
    controls.append(dragHandle, resizeHandle);

    el.classList.add("widget-item");
    el.appendChild(controls);

    const state = {
      id: widgetId,
      el,
      dragHandle,
      resizeHandle,
      tx: 0,
      ty: 0,
      scale: 1,
      mode: null,
      startX: 0,
      startY: 0,
      startTx: 0,
      startTy: 0,
      startScale: 1,
    };

    widgetLayoutState.widgets.set(widgetId, state);

    dragHandle.addEventListener("pointerdown", (event) => onWidgetPointerDown(event, state, "drag"));
    resizeHandle.addEventListener("pointerdown", (event) => onWidgetPointerDown(event, state, "resize"));

    dragHandle.addEventListener("keydown", (event) => onWidgetKeyboardNudge(event, state));
    resizeHandle.addEventListener("keydown", (event) => onWidgetKeyboardScale(event, state));
  });

  loadWidgetLayout();

  toggleWidgetLayoutBtnEl?.addEventListener("click", toggleWidgetEditMode);
  resetWidgetLayoutBtnEl?.addEventListener("click", resetWidgetLayout);

  setWidgetEditMode(false);
}

function onWidgetPointerDown(event, widget, mode) {
  if (!widgetLayoutState.editMode) {
    return;
  }

  event.preventDefault();
  const target = event.currentTarget;
  target?.setPointerCapture?.(event.pointerId);

  widget.mode = mode;
  widget.startX = event.clientX;
  widget.startY = event.clientY;
  widget.startTx = widget.tx;
  widget.startTy = widget.ty;
  widget.startScale = widget.scale;

  widgetLayoutState.activePointers.set(event.pointerId, {
    widget,
    mode,
    x: event.clientX,
    y: event.clientY,
  });

  target?.addEventListener("pointermove", onWidgetPointerMove);
  target?.addEventListener("pointerup", onWidgetPointerUp);
  target?.addEventListener("pointercancel", onWidgetPointerUp);

  widget.el.classList.add("is-active");
}

function onWidgetPointerMove(event) {
  const pointerState = widgetLayoutState.activePointers.get(event.pointerId);
  if (!pointerState) {
    return;
  }

  pointerState.x = event.clientX;
  pointerState.y = event.clientY;
  const widget = pointerState.widget;

  const pointersForWidget = Array.from(widgetLayoutState.activePointers.values())
    .filter((entry) => entry.widget === widget);

  if (pointersForWidget.length >= 2) {
    const [first, second] = pointersForWidget;
    const currentDistance = Math.hypot(second.x - first.x, second.y - first.y);

    if (!widget.pinchStartDistance) {
      widget.pinchStartDistance = currentDistance;
      widget.startScale = widget.scale;
    } else if (currentDistance > 0) {
      widget.scale = clamp(
        (widget.startScale * currentDistance) / widget.pinchStartDistance,
        WIDGET_TRANSFORM_LIMITS.minScale,
        WIDGET_TRANSFORM_LIMITS.maxScale,
      );
      applyWidgetTransform(widget);
      persistWidgetLayout();
    }

    return;
  }

  const deltaX = event.clientX - widget.startX;
  const deltaY = event.clientY - widget.startY;

  if (widget.mode === "drag") {
    widget.tx = widget.startTx + deltaX;
    widget.ty = widget.startTy + deltaY;
  } else {
    const diagonalDelta = (deltaX + deltaY) / 420;
    widget.scale = clamp(
      widget.startScale + diagonalDelta,
      WIDGET_TRANSFORM_LIMITS.minScale,
      WIDGET_TRANSFORM_LIMITS.maxScale,
    );
  }

  applyWidgetTransform(widget);
}

function onWidgetPointerUp(event) {
  const pointerState = widgetLayoutState.activePointers.get(event.pointerId);
  if (!pointerState) {
    return;
  }

  const widget = pointerState.widget;
  widgetLayoutState.activePointers.delete(event.pointerId);

  const target = event.currentTarget;
  target?.removeEventListener("pointermove", onWidgetPointerMove);
  target?.removeEventListener("pointerup", onWidgetPointerUp);
  target?.removeEventListener("pointercancel", onWidgetPointerUp);

  if (!Array.from(widgetLayoutState.activePointers.values()).some((entry) => entry.widget === widget)) {
    widget.el.classList.remove("is-active");
    widget.pinchStartDistance = null;
    persistWidgetLayout();
  }
}

function onWidgetKeyboardNudge(event, widget) {
  if (!widgetLayoutState.editMode) {
    return;
  }

  const step = event.shiftKey ? 20 : 8;
  let handled = true;

  if (event.key === "ArrowUp") {
    widget.ty -= step;
  } else if (event.key === "ArrowDown") {
    widget.ty += step;
  } else if (event.key === "ArrowLeft") {
    widget.tx -= step;
  } else if (event.key === "ArrowRight") {
    widget.tx += step;
  } else {
    handled = false;
  }

  if (handled) {
    event.preventDefault();
    applyWidgetTransform(widget);
    persistWidgetLayout();
  }
}

function onWidgetKeyboardScale(event, widget) {
  if (!widgetLayoutState.editMode) {
    return;
  }

  if (!["+", "=", "-", "_"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const delta = event.key === "-" || event.key === "_" ? -0.05 : 0.05;
  widget.scale = clamp(widget.scale + delta, WIDGET_TRANSFORM_LIMITS.minScale, WIDGET_TRANSFORM_LIMITS.maxScale);
  applyWidgetTransform(widget);
  persistWidgetLayout();
}

function applyWidgetTransform(widget) {
  widget.el.style.transform = `translate(${widget.tx}px, ${widget.ty}px) scale(${widget.scale})`;
}

function toggleWidgetEditMode() {
  setWidgetEditMode(!widgetLayoutState.editMode);
}

function setWidgetEditMode(enabled) {
  widgetLayoutState.editMode = enabled;
  dashboardViewEl?.classList.toggle("widget-edit-mode", enabled);

  if (toggleWidgetLayoutBtnEl) {
    toggleWidgetLayoutBtnEl.textContent = enabled ? "Disable Widget Edit Mode" : "Enable Widget Edit Mode";
    toggleWidgetLayoutBtnEl.classList.toggle("success", enabled);
  }

  if (enabled) {
    setStatus("Widget edit mode enabled: drag, resize, pinch-zoom, or use keyboard arrows/+/-. ");
  }
}

function loadWidgetLayout() {
  const raw = localStorage.getItem(WIDGET_LAYOUT_STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    Object.entries(parsed || {}).forEach(([widgetId, value]) => {
      const widget = widgetLayoutState.widgets.get(widgetId);
      if (!widget) {
        return;
      }

      widget.tx = Number.isFinite(value.tx) ? value.tx : 0;
      widget.ty = Number.isFinite(value.ty) ? value.ty : 0;
      widget.scale = clamp(Number(value.scale) || 1, WIDGET_TRANSFORM_LIMITS.minScale, WIDGET_TRANSFORM_LIMITS.maxScale);
      applyWidgetTransform(widget);
    });
  } catch (error) {
    setStatus("Saved widget layout was invalid and has been ignored.");
  }
}

function persistWidgetLayout() {
  const serializable = {};
  widgetLayoutState.widgets.forEach((widget, widgetId) => {
    serializable[widgetId] = {
      tx: Math.round(widget.tx),
      ty: Math.round(widget.ty),
      scale: Number(widget.scale.toFixed(3)),
    };
  });
  localStorage.setItem(WIDGET_LAYOUT_STORAGE_KEY, JSON.stringify(serializable));
}

function resetWidgetLayout() {
  widgetLayoutState.widgets.forEach((widget) => {
    widget.tx = 0;
    widget.ty = 0;
    widget.scale = 1;
    applyWidgetTransform(widget);
  });

  localStorage.removeItem(WIDGET_LAYOUT_STORAGE_KEY);
  setStatus("Widget layout reset.");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

function formatNumber(value, decimalPlaces = 2, suffix = "") {
  if (!Number.isFinite(value)) {
    return "--";
  }

  const requestedPlaces = Number.isFinite(decimalPlaces) ? decimalPlaces : 2;
  const precision = Math.max(2, Math.min(20, Math.floor(requestedPlaces)));
  const rounded = Number(value).toFixed(precision);
  const rendered = `${rounded}`;
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


function initializePowerKjBucketSettings() {
  const storedRaw = localStorage.getItem(POWER_KJ_BUCKET_SETTINGS_STORAGE_KEY);
  if (storedRaw) {
    try {
      const stored = JSON.parse(storedRaw);
      powerKjBucketSettings.enabled = stored?.enabled !== false;
      powerKjBucketSettings.customBuckets = sanitizeCustomPowerKjBuckets(stored?.customBuckets);
    } catch (error) {
      powerKjBucketSettings.enabled = true;
      powerKjBucketSettings.customBuckets = [];
    }
  }

  if (powerKjBucketsEnabledCheckboxEl) {
    powerKjBucketsEnabledCheckboxEl.checked = powerKjBucketSettings.enabled;
  }

  rebuildPowerKjBuckets();
  renderCustomBucketEditor();
  updatePowerKjBucketVisibility();
}

function sanitizeCustomPowerKjBuckets(customBuckets) {
  if (!Array.isArray(customBuckets)) {
    return [];
  }

  return customBuckets
    .slice(0, MAX_CUSTOM_POWER_KJ_BUCKETS)
    .map((bucket) => ({
      startWatts: Number(bucket?.startWatts),
      endWatts: Number(bucket?.endWatts),
      targetKj: Number(bucket?.targetKj),
    }))
    .filter((bucket) => Number.isFinite(bucket.startWatts)
      && Number.isFinite(bucket.endWatts)
      && Number.isFinite(bucket.targetKj)
      && bucket.startWatts > 0
      && bucket.endWatts >= bucket.startWatts
      && bucket.targetKj > 0)
    .map((bucket) => ({
      startWatts: Math.round(bucket.startWatts),
      endWatts: Math.round(bucket.endWatts),
      targetKj: Number(bucket.targetKj),
    }))
    .sort((left, right) => left.startWatts - right.startWatts);
}

function persistPowerKjBucketSettings() {
  localStorage.setItem(POWER_KJ_BUCKET_SETTINGS_STORAGE_KEY, JSON.stringify({
    enabled: powerKjBucketSettings.enabled,
    customBuckets: powerKjBucketSettings.customBuckets,
  }));
}

function updatePowerKjBucketVisibility() {
  if (powerKjBucketsCardEl) {
    powerKjBucketsCardEl.hidden = !powerKjBucketSettings.enabled;
  }
}

function updatePowerKjBucketSubtitle() {
  if (!powerKjBucketsSubtitleEl) {
    return;
  }

  if ((powerKjBucketSettings.customBuckets || []).length === 0) {
    powerKjBucketsSubtitleEl.textContent = `3W buckets from ${POWER_KJ_BUCKET_MIN_WATTS}-${POWER_KJ_BUCKET_MAX_WATTS}W`;
    return;
  }

  powerKjBucketsSubtitleEl.textContent = `${powerKjBucketSettings.customBuckets.length} custom bucket${powerKjBucketSettings.customBuckets.length === 1 ? '' : 's'}`;
}

function renderCustomBucketEditor() {
  if (!customBucketEditorEl) {
    return;
  }

  customBucketEditorEl.innerHTML = '';
  const buckets = powerKjBucketSettings.customBuckets || [];

  if (buckets.length === 0) {
    const emptyEl = document.createElement('p');
    emptyEl.className = 'custom-bucket-editor-empty';
    emptyEl.textContent = 'No custom buckets configured. The dashboard will use the default 3W buckets.';
    customBucketEditorEl.appendChild(emptyEl);
  } else {
    const listEl = document.createElement('div');
    listEl.className = 'custom-bucket-editor-list';

    buckets.forEach((bucket, index) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'custom-bucket-editor-row';
      rowEl.append(
        createCustomBucketNumberField(index, 'startWatts', 'Lower band watts', bucket.startWatts, 1, 1),
        createCustomBucketNumberField(index, 'endWatts', 'Upper band watts', bucket.endWatts, 1, 1),
        createCustomBucketNumberField(index, 'targetKj', 'kJ quantity', bucket.targetKj, 0.1, 0.1),
        createCustomBucketDeleteButton(index),
      );
      listEl.appendChild(rowEl);
    });

    customBucketEditorEl.appendChild(listEl);
  }

  const noteEl = document.createElement('p');
  noteEl.className = 'custom-bucket-limit-note';
  noteEl.textContent = `${buckets.length}/${MAX_CUSTOM_POWER_KJ_BUCKETS} custom buckets in use.`;
  customBucketEditorEl.appendChild(noteEl);

  if (addCustomBucketBtnEl) {
    addCustomBucketBtnEl.disabled = buckets.length >= MAX_CUSTOM_POWER_KJ_BUCKETS;
  }
}

function createCustomBucketNumberField(index, field, label, value, step, min) {
  const labelEl = document.createElement('label');
  labelEl.className = 'settings-row custom-bucket-field';

  const textEl = document.createElement('span');
  textEl.className = 'settings-label';
  textEl.textContent = label;

  const inputEl = document.createElement('input');
  inputEl.className = 'ride-input settings-number-input';
  inputEl.type = 'number';
  inputEl.min = String(min);
  inputEl.step = String(step);
  inputEl.value = String(value);
  inputEl.addEventListener('input', () => syncCustomPowerKjBucketField(index, field, inputEl.value));
  inputEl.addEventListener('change', () => commitCustomPowerKjBucketField(index, field, inputEl.value));

  labelEl.append(textEl, inputEl);
  return labelEl;
}

function createCustomBucketDeleteButton(index) {
  const wrapperEl = document.createElement('div');
  wrapperEl.className = 'custom-bucket-editor-actions';

  const buttonEl = document.createElement('button');
  buttonEl.type = 'button';
  buttonEl.className = 'connect-btn warning';
  buttonEl.textContent = 'Remove';
  buttonEl.addEventListener('click', () => removeCustomPowerKjBucket(index));

  wrapperEl.appendChild(buttonEl);
  return wrapperEl;
}

function addCustomPowerKjBucket() {
  const buckets = powerKjBucketSettings.customBuckets || [];
  if (buckets.length >= MAX_CUSTOM_POWER_KJ_BUCKETS) {
    return;
  }

  const lastBucket = buckets[buckets.length - 1];
  const startWatts = lastBucket ? lastBucket.endWatts + 1 : POWER_KJ_BUCKET_MIN_WATTS;
  const endWatts = startWatts + 9;
  buckets.push({ startWatts, endWatts, targetKj: 25 });
  saveCustomPowerKjBuckets(buckets);
}

function resetCustomPowerKjBuckets() {
  powerKjBucketSettings.customBuckets = [];
  persistPowerKjBucketSettings();
  rebuildPowerKjBuckets();
  renderCustomBucketEditor();
  updatePowerKjBucketSubtitle();
}

function removeCustomPowerKjBucket(index) {
  const nextBuckets = (powerKjBucketSettings.customBuckets || []).filter((_, bucketIndex) => bucketIndex !== index);
  saveCustomPowerKjBuckets(nextBuckets);
}

function syncCustomPowerKjBucketField(index, field, rawValue) {
  const nextBuckets = (powerKjBucketSettings.customBuckets || []).map((bucket) => ({ ...bucket }));
  if (!nextBuckets[index]) {
    return;
  }

  nextBuckets[index][field] = rawValue === '' ? NaN : Number(rawValue);
  powerKjBucketSettings.customBuckets = nextBuckets;
}

function commitCustomPowerKjBucketField(index, field, rawValue) {
  const nextBuckets = (powerKjBucketSettings.customBuckets || []).map((bucket) => ({ ...bucket }));
  if (!nextBuckets[index]) {
    return;
  }

  nextBuckets[index][field] = rawValue === '' ? NaN : Number(rawValue);
  saveCustomPowerKjBuckets(nextBuckets, { allowPartial: true });
}

function saveCustomPowerKjBuckets(nextBuckets, options = {}) {
  const sanitizedBuckets = sanitizeCustomPowerKjBuckets(nextBuckets);
  if (!options.allowPartial || sanitizedBuckets.length === nextBuckets.length) {
    powerKjBucketSettings.customBuckets = sanitizedBuckets;
    persistPowerKjBucketSettings();
    rebuildPowerKjBuckets();
    renderCustomBucketEditor();
    updatePowerKjBucketSubtitle();
    return;
  }

  powerKjBucketSettings.customBuckets = nextBuckets;
  renderCustomBucketEditor();
}

function initializeRideEventSettings() {
  try {
    const storedRaw = localStorage.getItem(RIDE_EVENT_SETTINGS_STORAGE_KEY);
    if (storedRaw) {
      const stored = JSON.parse(storedRaw);
      rideEventSettings.events = sanitizeRideEvents(stored?.events);
    } else {
      rideEventSettings.events = sanitizeRideEvents(rideEventSettings.events);
    }
  } catch (error) {
    console.warn('Unable to restore ride event settings.', error);
    rideEventSettings.events = sanitizeRideEvents(createDefaultRideEventSettings().events);
  }

  renderRideEventsEditor();
}

function persistRideEventSettings() {
  localStorage.setItem(RIDE_EVENT_SETTINGS_STORAGE_KEY, JSON.stringify({
    events: sanitizeRideEvents(rideEventSettings.events),
  }));
}

function renderRideEventsEditor() {
  if (!rideEventsEditorEl) {
    return;
  }

  rideEventsEditorEl.innerHTML = '';
  const events = sanitizeRideEvents(rideEventSettings.events);
  rideEventSettings.events = events;

  if (events.length === 0) {
    const emptyEl = document.createElement('p');
    emptyEl.className = 'custom-bucket-editor-empty';
    emptyEl.textContent = 'No ride events yet. Add one to show a prompt at a target kJ milestone.';
    rideEventsEditorEl.appendChild(emptyEl);
  } else {
    const listEl = document.createElement('div');
    listEl.className = 'custom-bucket-editor-list';

    events.forEach((event, index) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'custom-bucket-editor-row ride-event-editor-row';

      rowEl.appendChild(createRideEventNumberField(index, 'targetKj', 'Trigger at', event.targetKj, 1, 1, 'kJ'));
      rowEl.appendChild(createRideEventTextField(index, 'label', 'Label', event.label));

      const actionsEl = document.createElement('div');
      actionsEl.className = 'custom-bucket-editor-actions';
      const removeBtnEl = document.createElement('button');
      removeBtnEl.type = 'button';
      removeBtnEl.className = 'connect-btn warning';
      removeBtnEl.textContent = 'Remove';
      removeBtnEl.addEventListener('click', () => removeRideEventSetting(index));
      actionsEl.appendChild(removeBtnEl);
      rowEl.appendChild(actionsEl);
      listEl.appendChild(rowEl);
    });

    rideEventsEditorEl.appendChild(listEl);
  }

  const limitNoteEl = document.createElement('p');
  limitNoteEl.className = 'custom-bucket-limit-note';
  limitNoteEl.textContent = `${events.length}/${MAX_RIDE_EVENTS} ride events configured.`;
  rideEventsEditorEl.appendChild(limitNoteEl);

  if (addRideEventBtnEl) {
    addRideEventBtnEl.disabled = events.length >= MAX_RIDE_EVENTS;
  }
}

function createRideEventTextField(index, key, label, value) {
  const fieldEl = document.createElement('label');
  fieldEl.className = 'settings-row custom-bucket-field';
  const textEl = document.createElement('span');
  textEl.className = 'settings-label';
  textEl.textContent = label;
  const inputEl = document.createElement('input');
  inputEl.className = 'ride-input settings-number-input';
  inputEl.type = 'text';
  inputEl.value = value;
  inputEl.addEventListener('change', () => updateRideEventSetting(index, key, inputEl.value));
  fieldEl.append(textEl, inputEl);
  return fieldEl;
}

function createRideEventNumberField(index, key, label, value, step, min, unit) {
  const fieldEl = document.createElement('label');
  fieldEl.className = 'settings-row custom-bucket-field';
  const textEl = document.createElement('span');
  textEl.className = 'settings-label';
  textEl.textContent = label;
  const inputEl = document.createElement('input');
  inputEl.className = 'ride-input settings-number-input';
  inputEl.type = 'number';
  inputEl.step = String(step);
  inputEl.min = String(min);
  inputEl.value = String(value);
  inputEl.addEventListener('change', () => updateRideEventSetting(index, key, Number(inputEl.value)));
  const unitEl = document.createElement('span');
  unitEl.className = 'settings-value';
  unitEl.textContent = unit;
  fieldEl.append(textEl, inputEl, unitEl);
  return fieldEl;
}

function addRideEventSetting() {
  const events = sanitizeRideEvents(rideEventSettings.events);
  if (events.length >= MAX_RIDE_EVENTS) {
    return;
  }

  const nextTargetKj = events.length > 0 ? events[events.length - 1].targetKj + 50 : 100;
  events.push(createRideEventDefinition(`Event ${events.length + 1}`, nextTargetKj));
  rideEventSettings.events = events;
  persistRideEventSettings();
  renderRideEventsEditor();
}

function resetRideEventSettings() {
  rideEventSettings.events = sanitizeRideEvents(createDefaultRideEventSettings().events);
  persistRideEventSettings();
  renderRideEventsEditor();
}

function removeRideEventSetting(index) {
  rideEventSettings.events = sanitizeRideEvents(rideEventSettings.events).filter((_, eventIndex) => eventIndex !== index);
  persistRideEventSettings();
  renderRideEventsEditor();
}

function updateRideEventSetting(index, key, value) {
  const nextEvents = (Array.isArray(rideEventSettings.events) ? rideEventSettings.events : []).map((event) => ({ ...event }));
  if (!nextEvents[index]) {
    return;
  }

  nextEvents[index][key] = value;
  rideEventSettings.events = sanitizeRideEvents(nextEvents);
  persistRideEventSettings();
  renderRideEventsEditor();
}

function formatRideEventTimestamp(timestamp, rideStartTimestamp) {
  if (!Number.isFinite(timestamp)) {
    return '';
  }

  if (Number.isFinite(rideStartTimestamp)) {
    return ((timestamp - rideStartTimestamp) / 1000).toFixed(2);
  }

  return new Date(timestamp).toISOString();
}

function initializeReportSettings() {
  if (!reportEfficiencyCheckboxEl) {
    return;
  }

  const storedValue = localStorage.getItem(REPORT_EFFICIENCY_STORAGE_KEY);
  reportEfficiencyCheckboxEl.checked = storedValue === "1";
}

function maybeDownloadRideReports() {
  if (!rideState || rideState.reportsDownloaded) {
    return;
  }

  rideState.reportsDownloaded = true;

  if (reportEfficiencyCheckboxEl?.checked) {
    const csv = buildEfficiencyReportCsv(rideState);
    if (csv) {
      const timestampLabel = new Date().toISOString().replaceAll(":", "-");
      triggerCsvDownload(`efficiency-report-${timestampLabel}.csv`, csv);
      setStatus(`Ride target complete: ${formatNumber(rideState.targetKj, 2)} kJ done. Efficiency report downloaded.`);
    }
  }
}

function buildEfficiencyReportCsv(currentRideState) {
  if (!currentRideState?.started || !Number.isFinite(currentRideState.startTimestamp)) {
    return "";
  }

  const samples = currentRideState.efficiencySamples || [];
  if (samples.length === 0) {
    return "";
  }

  const minuteBuckets = new Map();

  samples.forEach((sample) => {
    const minuteIndex = Math.floor(Math.max(0, sample.timestamp - currentRideState.startTimestamp) / 60000);
    const bucket = minuteBuckets.get(minuteIndex) || {
      wattsSum: 0,
      wattsCount: 0,
      heartRateSum: 0,
      heartRateCount: 0,
      cadenceSum: 0,
      cadenceCount: 0,
      balanceSum: 0,
      balanceCount: 0,
      breathsPerMinuteSum: 0,
      breathsPerMinuteCount: 0,
      firstTimestamp: null,
      lastTimestamp: null,
    };

    if (Number.isFinite(sample.watts)) {
      bucket.wattsSum += sample.watts;
      bucket.wattsCount += 1;
    }

    if (Number.isFinite(sample.heartRate)) {
      bucket.heartRateSum += sample.heartRate;
      bucket.heartRateCount += 1;
    }

    if (Number.isFinite(sample.cadence)) {
      bucket.cadenceSum += sample.cadence;
      bucket.cadenceCount += 1;
    }

    if (Number.isFinite(sample.balancePercent)) {
      bucket.balanceSum += sample.balancePercent;
      bucket.balanceCount += 1;
    }

    if (Number.isFinite(sample.breathsPerMinute)) {
      bucket.breathsPerMinuteSum += sample.breathsPerMinute;
      bucket.breathsPerMinuteCount += 1;
    }

    if (!Number.isFinite(bucket.firstTimestamp) || sample.timestamp < bucket.firstTimestamp) {
      bucket.firstTimestamp = sample.timestamp;
    }

    if (!Number.isFinite(bucket.lastTimestamp) || sample.timestamp > bucket.lastTimestamp) {
      bucket.lastTimestamp = sample.timestamp;
    }

    minuteBuckets.set(minuteIndex, bucket);
  });

  const minutes = Array.from(minuteBuckets.keys()).sort((left, right) => left - right);
  const heartRateWalkSamples = currentRideState.heartRateWalkSamples || [];
  const lines = ["minute,avg_watts,avg_heart_rate,avg_left_balance,avg_right_balance,avg_cadence,avg_breaths_per_min,breaths_per_kj,watts_per_breath,watts_per_heart_rate,heart_rate_per_breath,heart_rate_walk_in_minute,cumulative_heart_rate_walk,delta_watts_vs_prev_min,delta_heart_rate_vs_prev_min,delta_breaths_per_min_vs_prev_min,delta_left_balance_vs_prev_min,delta_right_balance_vs_prev_min"];
  const rideEvents = Array.isArray(currentRideState.rideEvents) ? currentRideState.rideEvents : [];
  let previousMinuteAverages = null;

  minutes.forEach((minuteIndex) => {
    const bucket = minuteBuckets.get(minuteIndex);
    const avgWatts = bucket.wattsCount > 0 ? bucket.wattsSum / bucket.wattsCount : null;
    const avgHeartRate = bucket.heartRateCount > 0 ? bucket.heartRateSum / bucket.heartRateCount : null;
    const avgCadence = bucket.cadenceCount > 0 ? bucket.cadenceSum / bucket.cadenceCount : null;
    const avgLeftBalance = bucket.balanceCount > 0 ? bucket.balanceSum / bucket.balanceCount : null;
    const avgRightBalance = Number.isFinite(avgLeftBalance) ? (100 - avgLeftBalance) : null;
    const avgBreathsPerMinute = bucket.breathsPerMinuteCount > 0
      ? bucket.breathsPerMinuteSum / bucket.breathsPerMinuteCount
      : null;
    const elapsedSeconds = Number.isFinite(bucket.firstTimestamp) && Number.isFinite(bucket.lastTimestamp)
      ? Math.max(0, (bucket.lastTimestamp - bucket.firstTimestamp) / 1000)
      : 0;
    const minuteKj = Number.isFinite(avgWatts) && elapsedSeconds > 0 ? (avgWatts * elapsedSeconds) / 1000 : null;
    const breathsPerKj = Number.isFinite(avgBreathsPerMinute) && Number.isFinite(minuteKj) && minuteKj > 0
      ? (avgBreathsPerMinute * (elapsedSeconds / 60)) / minuteKj
      : null;
    const wattsPerBreath = Number.isFinite(avgWatts) && Number.isFinite(avgBreathsPerMinute) && avgBreathsPerMinute > 0
      ? avgWatts / avgBreathsPerMinute
      : null;
    const wattsPerHeartRate = Number.isFinite(avgWatts) && Number.isFinite(avgHeartRate) && avgHeartRate > 0
      ? avgWatts / avgHeartRate
      : null;
    const heartRatePerBreath = Number.isFinite(avgHeartRate) && Number.isFinite(avgBreathsPerMinute) && avgBreathsPerMinute > 0
      ? avgHeartRate / avgBreathsPerMinute
      : null;
    const minuteHeartRateWalk = heartRateWalkSamples
      .filter((sample) => sample.minuteIndex === minuteIndex)
      .reduce((sum, sample) => sum + sample.walkDelta, 0);
    const cumulativeHeartRateWalk = heartRateWalkSamples
      .filter((sample) => sample.minuteIndex <= minuteIndex)
      .reduce((sum, sample) => sum + sample.walkDelta, 0);
    const deltaWatts = previousMinuteAverages && Number.isFinite(avgWatts) && Number.isFinite(previousMinuteAverages.avgWatts)
      ? avgWatts - previousMinuteAverages.avgWatts
      : null;
    const deltaHeartRate = previousMinuteAverages && Number.isFinite(avgHeartRate) && Number.isFinite(previousMinuteAverages.avgHeartRate)
      ? avgHeartRate - previousMinuteAverages.avgHeartRate
      : null;
    const deltaBreathsPerMinute = previousMinuteAverages
      && Number.isFinite(avgBreathsPerMinute)
      && Number.isFinite(previousMinuteAverages.avgBreathsPerMinute)
      ? avgBreathsPerMinute - previousMinuteAverages.avgBreathsPerMinute
      : null;
    const deltaLeftBalance = previousMinuteAverages && Number.isFinite(avgLeftBalance) && Number.isFinite(previousMinuteAverages.avgLeftBalance)
      ? avgLeftBalance - previousMinuteAverages.avgLeftBalance
      : null;
    const deltaRightBalance = previousMinuteAverages && Number.isFinite(avgRightBalance) && Number.isFinite(previousMinuteAverages.avgRightBalance)
      ? avgRightBalance - previousMinuteAverages.avgRightBalance
      : null;

    lines.push([
      minuteIndex + 1,
      Number.isFinite(avgWatts) ? Number(avgWatts).toFixed(2) : "",
      Number.isFinite(avgHeartRate) ? Number(avgHeartRate).toFixed(2) : "",
      Number.isFinite(avgLeftBalance) ? Number(avgLeftBalance).toFixed(2) : "",
      Number.isFinite(avgRightBalance) ? Number(avgRightBalance).toFixed(2) : "",
      Number.isFinite(avgCadence) ? Number(avgCadence).toFixed(2) : "",
      Number.isFinite(avgBreathsPerMinute) ? Number(avgBreathsPerMinute).toFixed(2) : "",
      Number.isFinite(breathsPerKj) ? Number(breathsPerKj).toFixed(2) : "",
      Number.isFinite(wattsPerBreath) ? Number(wattsPerBreath).toFixed(2) : "",
      Number.isFinite(wattsPerHeartRate) ? Number(wattsPerHeartRate).toFixed(2) : "",
      Number.isFinite(heartRatePerBreath) ? Number(heartRatePerBreath).toFixed(2) : "",
      Number.isFinite(minuteHeartRateWalk) ? Number(minuteHeartRateWalk).toFixed(0) : "",
      Number.isFinite(cumulativeHeartRateWalk) ? Number(cumulativeHeartRateWalk).toFixed(0) : "",
      Number.isFinite(deltaWatts) ? Number(deltaWatts).toFixed(2) : "",
      Number.isFinite(deltaHeartRate) ? Number(deltaHeartRate).toFixed(2) : "",
      Number.isFinite(deltaBreathsPerMinute) ? Number(deltaBreathsPerMinute).toFixed(2) : "",
      Number.isFinite(deltaLeftBalance) ? Number(deltaLeftBalance).toFixed(2) : "",
      Number.isFinite(deltaRightBalance) ? Number(deltaRightBalance).toFixed(2) : "",
    ].join(","));

    previousMinuteAverages = {
      avgWatts,
      avgHeartRate,
      avgBreathsPerMinute,
      avgLeftBalance,
      avgRightBalance,
    };
  });

  if (rideEvents.length > 0) {
    lines.push('');
    lines.push('ride_events');
    lines.push('label,target_kj,triggered,confirmed,trigger_elapsed_seconds,confirm_elapsed_seconds,expired');
    rideEvents.forEach((rideEvent) => {
      lines.push([
        escapeCsvValue(rideEvent.label),
        Number.isFinite(rideEvent.targetKj) ? Number(rideEvent.targetKj).toFixed(2) : '',
        rideEvent.triggered ? 'yes' : 'no',
        rideEvent.confirmed ? 'yes' : 'no',
        formatRideEventTimestamp(rideEvent.triggeredAtTimestamp, currentRideState.startTimestamp),
        formatRideEventTimestamp(rideEvent.confirmedAtTimestamp, currentRideState.startTimestamp),
        Number.isFinite(rideEvent.expiredAtTimestamp) ? 'yes' : 'no',
      ].join(','));
    });
  }

  return lines.join("\n");
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? '');
  if (!/[",\n]/.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replaceAll('"', '""')}"`;
}

function initializeClimbCalculator() {
  if (!climbRiderWeightInputEl || !climbPowerInputEl || !climbBikeWeightInputEl) {
    return;
  }

  climbModelCalibration = calibrateDoiSuthepModel();

  const inputEls = [climbRiderWeightInputEl, climbPowerInputEl, climbBikeWeightInputEl, climbCdaInputEl];
  inputEls.forEach((inputEl) => {
    inputEl?.addEventListener("input", calculateClimbPrediction);
  });

  climbCalculateBtnEl?.addEventListener("click", calculateClimbPrediction);
  climbExportBtnEl?.addEventListener("click", exportClimbPredictionAsJson);

  calculateClimbPrediction();
}

function calibrateDoiSuthepModel() {
  const referenceSpeed = DOI_SUTHEP_MODEL.distanceMeters / DOI_SUTHEP_MODEL.reference.timeSeconds;
  const totalMassKg = DOI_SUTHEP_MODEL.reference.riderWeightKg + DOI_SUTHEP_MODEL.reference.bikeWeightKg;
  const wheelPowerWatts = DOI_SUTHEP_MODEL.reference.powerWatts * DOI_SUTHEP_MODEL.drivetrainEfficiency;
  const gravityWatts = totalMassKg * DOI_SUTHEP_MODEL.g * DOI_SUTHEP_MODEL.averageGrade * referenceSpeed;
  const rollingWatts = DOI_SUTHEP_MODEL.crr * totalMassKg * DOI_SUTHEP_MODEL.g * referenceSpeed;
  const aeroResidualWatts = Math.max(wheelPowerWatts - gravityWatts - rollingWatts, 0);
  const calibratedCda = aeroResidualWatts > 0
    ? (2 * aeroResidualWatts) / (DOI_SUTHEP_MODEL.rho * Math.pow(referenceSpeed, 3))
    : 0;
  const baselineCda = 0.32;

  return {
    referenceSpeed,
    wheelPowerWatts,
    gravityWatts,
    rollingWatts,
    aeroResidualWatts,
    calibratedCda,
    correctionFactor: baselineCda > 0 ? calibratedCda / baselineCda : 1,
  };
}

function calculateClimbPrediction() {
  const riderWeightKg = Number(climbRiderWeightInputEl?.value);
  const powerWatts = Number(climbPowerInputEl?.value);
  const bikeWeightKg = Number(climbBikeWeightInputEl?.value) || DOI_SUTHEP_MODEL.defaultBikeWeightKg;
  const cdaOverride = climbCdaInputEl?.value ? Number(climbCdaInputEl.value) : null;

  if (!Number.isFinite(riderWeightKg) || !Number.isFinite(powerWatts) || riderWeightKg <= 0 || powerWatts <= 0 || bikeWeightKg <= 0) {
    return;
  }

  const result = solveDoiSuthepClimb({ riderWeightKg, powerWatts, bikeWeightKg, cdaOverride });
  lastClimbCalculation = result;
  renderClimbCalculation(result);
}

function solveDoiSuthepClimb({ riderWeightKg, powerWatts, bikeWeightKg = DOI_SUTHEP_MODEL.defaultBikeWeightKg, cdaOverride = null }) {
  const totalMassKg = riderWeightKg + bikeWeightKg;
  const effectiveCda = Number.isFinite(cdaOverride) && cdaOverride > 0 ? cdaOverride : climbModelCalibration.calibratedCda;
  const wheelPowerWatts = powerWatts * DOI_SUTHEP_MODEL.drivetrainEfficiency;
  const speedMetersPerSecond = solveVelocityFromPower({ totalMassKg, wheelPowerWatts, effectiveCda });
  const timeSeconds = DOI_SUTHEP_MODEL.distanceMeters / speedMetersPerSecond;
  const gravityWatts = totalMassKg * DOI_SUTHEP_MODEL.g * DOI_SUTHEP_MODEL.averageGrade * speedMetersPerSecond;
  const rollingWatts = DOI_SUTHEP_MODEL.crr * totalMassKg * DOI_SUTHEP_MODEL.g * speedMetersPerSecond;
  const aeroWatts = 0.5 * DOI_SUTHEP_MODEL.rho * effectiveCda * Math.pow(speedMetersPerSecond, 3);
  const vam = (DOI_SUTHEP_MODEL.elevationGainMeters / timeSeconds) * 3600;
  const averageSpeedKph = speedMetersPerSecond * 3.6;
  const wkg = powerWatts / riderWeightKg;
  const predictedPlusOneW = solveDoiSuthepClimbDelta({ riderWeightKg, powerWatts: powerWatts + 1, bikeWeightKg, cdaOverride: effectiveCda });
  const predictedMinusOneKg = solveDoiSuthepClimbDelta({ riderWeightKg: Math.max(35, riderWeightKg - 1), powerWatts, bikeWeightKg, cdaOverride: effectiveCda });

  return {
    inputs: { riderWeightKg, powerWatts, bikeWeightKg, cdaOverride: Number.isFinite(cdaOverride) ? cdaOverride : null },
    calibration: {
      effectiveCda,
      referenceCalibratedCda: climbModelCalibration.calibratedCda,
      calibrationFactor: climbModelCalibration.correctionFactor,
      referenceAeroResidualWatts: climbModelCalibration.aeroResidualWatts,
    },
    outputs: {
      timeSeconds,
      averageSpeedKph,
      vam,
      wkg,
      wheelPowerWatts,
      speedMetersPerSecond,
    },
    breakdown: {
      gravityWatts,
      rollingWatts,
      aeroWatts,
      gravityPercent: (gravityWatts / wheelPowerWatts) * 100,
      rollingPercent: (rollingWatts / wheelPowerWatts) * 100,
      aeroPercent: (aeroWatts / wheelPowerWatts) * 100,
    },
    sensitivity: {
      secondsPerPlusOneW: predictedPlusOneW.timeSeconds - timeSeconds,
      secondsPerMinusOneKg: predictedMinusOneKg.timeSeconds - timeSeconds,
    },
  };
}

function solveDoiSuthepClimbDelta(params) {
  const totalMassKg = params.riderWeightKg + params.bikeWeightKg;
  const effectiveCda = Number.isFinite(params.cdaOverride) && params.cdaOverride > 0 ? params.cdaOverride : climbModelCalibration.calibratedCda;
  const wheelPowerWatts = params.powerWatts * DOI_SUTHEP_MODEL.drivetrainEfficiency;
  const speedMetersPerSecond = solveVelocityFromPower({ totalMassKg, wheelPowerWatts, effectiveCda });
  return { timeSeconds: DOI_SUTHEP_MODEL.distanceMeters / speedMetersPerSecond };
}

function solveVelocityFromPower({ totalMassKg, wheelPowerWatts, effectiveCda }) {
  let low = 0.5;
  let high = 12;

  for (let index = 0; index < 80; index += 1) {
    const mid = (low + high) / 2;
    const modeledPower = computeModeledWheelPower({ totalMassKg, speedMetersPerSecond: mid, effectiveCda });
    if (modeledPower > wheelPowerWatts) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

function computeModeledWheelPower({ totalMassKg, speedMetersPerSecond, effectiveCda }) {
  const gravityWatts = totalMassKg * DOI_SUTHEP_MODEL.g * DOI_SUTHEP_MODEL.averageGrade * speedMetersPerSecond;
  const rollingWatts = DOI_SUTHEP_MODEL.crr * totalMassKg * DOI_SUTHEP_MODEL.g * speedMetersPerSecond;
  const aeroWatts = 0.5 * DOI_SUTHEP_MODEL.rho * effectiveCda * Math.pow(speedMetersPerSecond, 3);
  return gravityWatts + rollingWatts + aeroWatts;
}

function renderClimbCalculation(result) {
  if (!result) {
    return;
  }

  climbPredictedTimeEl.textContent = formatDurationClock(result.outputs.timeSeconds);
  climbAverageSpeedEl.textContent = `${formatNumber(result.outputs.averageSpeedKph, 2)} km/h`;
  climbVamEl.textContent = `${formatNumber(result.outputs.vam, 0)} m/h`;
  climbWkgEl.textContent = `${formatNumber(result.outputs.wkg, 2)} W/kg`;
  climbGravityBreakdownEl.textContent = `${formatNumber(result.breakdown.gravityWatts, 1)} W (${formatNumber(result.breakdown.gravityPercent, 1)}%)`;
  climbRollingBreakdownEl.textContent = `${formatNumber(result.breakdown.rollingWatts, 1)} W (${formatNumber(result.breakdown.rollingPercent, 1)}%)`;
  climbAeroBreakdownEl.textContent = `${formatNumber(result.breakdown.aeroWatts, 1)} W (${formatNumber(result.breakdown.aeroPercent, 1)}%)`;
  climbEffectiveCdaEl.textContent = `${formatNumber(result.calibration.effectiveCda, 3)} m²`;
  climbCalibrationFactorEl.textContent = `${formatNumber(result.calibration.calibrationFactor, 3)}× vs 0.320 baseline`;
  climbPlusOneWEl.textContent = `${formatSignedSeconds(result.sensitivity.secondsPerPlusOneW)} / +1W`;
  climbMinusOneKgEl.textContent = `${formatSignedSeconds(result.sensitivity.secondsPerMinusOneKg)} / -1kg`;
  climbJsonOutputEl.textContent = JSON.stringify(result, null, 2);
}

function exportClimbPredictionAsJson() {
  if (!lastClimbCalculation) {
    calculateClimbPrediction();
  }

  if (!lastClimbCalculation) {
    return;
  }

  const jsonContent = JSON.stringify(lastClimbCalculation, null, 2);
  const fileName = `doi-suthep-${Date.now()}.json`;
  const jsonBlob = new Blob([jsonContent], { type: "application/json;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(jsonBlob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

function formatDurationClock(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "--:--";
  }

  const roundedSeconds = Math.round(totalSeconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatSignedSeconds(secondsValue) {
  if (!Number.isFinite(secondsValue)) {
    return "--";
  }

  const rounded = Math.round(secondsValue);
  return `${rounded > 0 ? "+" : ""}${rounded}s`;
}

function triggerCsvDownload(fileName, csvContent) {
  if (!csvContent) {
    return;
  }

  const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(csvBlob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

function setStatus(message) {
  statusEl.textContent = message;
}

function formatBalance(leftPercent) {
  if (!Number.isFinite(leftPercent)) {
    return "--";
  }

  const rightPercent = 100 - leftPercent;
  return `${formatNumber(leftPercent, 1)} / ${formatNumber(rightPercent, 1)}`;
}

function initializeRideHistoryTab() {
  refreshRideHistoryBtnEl?.addEventListener("click", () => {
    loadRideHistory({ force: true });
  });
  renderRideHistoryList();
  renderRideHistoryDetails();
}

function ensureRideHistoryLoaded() {
  if (rideHistoryState.loaded || rideHistoryState.loading) {
    return;
  }

  loadRideHistory();
}

async function loadRideHistory({ force = false } = {}) {
  if (!rideHistoryListEl || (rideHistoryState.loading && !force)) {
    return;
  }

  rideHistoryState.loading = true;
  if (rideHistoryStatusEl) {
    rideHistoryStatusEl.textContent = "Loading saved rides...";
  }

  try {
    const response = await fetch("/api/rides", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Ride history request failed (${response.status})`);
    }

    const rides = await response.json();
    rideHistoryState.rides = Array.isArray(rides) ? rides : [];
    rideHistoryState.loaded = true;

    const hasSelectedRide = rideHistoryState.rides.some((ride) => Number(ride.id) === Number(rideHistoryState.selectedRideId));
    if (!hasSelectedRide) {
      rideHistoryState.selectedRideId = rideHistoryState.rides[0]?.id ?? null;
      rideHistoryState.selectedStream = [];
    }

    renderRideHistoryList();
    renderRideHistoryDetails();

    if (rideHistoryState.selectedRideId != null) {
      await loadRideStream(rideHistoryState.selectedRideId);
    }
  } catch (error) {
    console.error("Failed to load ride history:", error);
    if (rideHistoryStatusEl) {
      rideHistoryStatusEl.textContent = "Could not load rides from the database.";
    }
  } finally {
    rideHistoryState.loading = false;
  }
}

async function loadRideStream(rideId) {
  if (!Number.isFinite(Number(rideId))) {
    rideHistoryState.selectedStream = [];
    renderRideHistoryDetails();
    return;
  }

  if (rideHistoryChartLabelEl) {
    rideHistoryChartLabelEl.textContent = "Loading recorded samples...";
  }

  try {
    const response = await fetch(`/api/rides/${rideId}/stream`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Ride stream request failed (${response.status})`);
    }

    const streamRows = await response.json();
    rideHistoryState.selectedStream = Array.isArray(streamRows) ? streamRows : [];
  } catch (error) {
    console.error("Failed to load ride stream:", error);
    rideHistoryState.selectedStream = [];
    if (rideHistoryChartLabelEl) {
      rideHistoryChartLabelEl.textContent = "Could not load stream samples for this ride.";
    }
  }

  renderRideHistoryDetails();
}

function selectRideHistoryRide(rideId) {
  const numericRideId = Number(rideId);
  if (!Number.isFinite(numericRideId)) {
    return;
  }

  rideHistoryState.selectedRideId = numericRideId;
  rideHistoryState.selectedStream = [];
  renderRideHistoryList();
  renderRideHistoryDetails();
  loadRideStream(numericRideId);
}

function renderRideHistoryList() {
  if (!rideHistoryListEl) {
    return;
  }

  const rides = Array.isArray(rideHistoryState.rides) ? rideHistoryState.rides : [];
  rideHistoryListEl.innerHTML = "";

  if (rideHistoryStatusEl) {
    rideHistoryStatusEl.textContent = rides.length > 0
      ? `${rides.length} saved ride${rides.length === 1 ? "" : "s"} found.`
      : (rideHistoryState.loaded ? "No saved rides yet." : "Open this tab to load saved rides.");
  }

  if (rides.length === 0) {
    const emptyEl = document.createElement("p");
    emptyEl.className = "history-empty";
    emptyEl.textContent = rideHistoryState.loaded ? "Record a ride and save it to the database to see it here." : "";
    rideHistoryListEl.append(emptyEl);
    return;
  }

  rides.forEach((ride) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-ride-item";
    button.dataset.rideId = String(ride.id);
    const isActive = Number(ride.id) === Number(rideHistoryState.selectedRideId);
    button.classList.toggle("active", isActive);
    button.innerHTML = `
      <span class="history-ride-date">${formatRideHistoryDate(ride)}</span>
      <span class="history-ride-meta">${formatNumber(ride.total_kj, 1)} kJ • ${formatNumber(ride.avg_power, 0)} W • ${formatNumber(ride.avg_hr, 0)} bpm</span>
    `;
    button.addEventListener("click", () => selectRideHistoryRide(ride.id));
    rideHistoryListEl.append(button);
  });
}

function renderRideHistoryDetails() {
  const selectedRide = (rideHistoryState.rides || []).find((ride) => Number(ride.id) === Number(rideHistoryState.selectedRideId)) || null;
  const stream = Array.isArray(rideHistoryState.selectedStream) ? rideHistoryState.selectedStream : [];

  if (!selectedRide) {
    if (rideHistoryTitleEl) {
      rideHistoryTitleEl.textContent = "No ride selected";
    }
    if (rideHistorySubtitleEl) {
      rideHistorySubtitleEl.textContent = "Choose a saved ride day to inspect totals and the stream trace.";
    }
    setHistoryMetric(historyTotalKjEl, "--");
    setHistoryMetric(historyAvgPowerEl, "--");
    setHistoryMetric(historyAvgHrEl, "--");
    setHistoryMetric(historyAvgWPerHrEl, "--");
    setHistoryMetric(historySampleCountEl, "--");
    setHistoryMetric(historyDurationEl, "--");
    renderRideHistoryChart([]);
    renderRideHistorySamples([]);
    return;
  }

  const historySummary = buildRideHistorySummary(selectedRide, stream);
  if (rideHistoryTitleEl) {
    rideHistoryTitleEl.textContent = formatRideHistoryDate(selectedRide);
  }
  if (rideHistorySubtitleEl) {
    rideHistorySubtitleEl.textContent = `Saved ${formatRideHistoryCreatedAt(selectedRide)} • Ride #${selectedRide.id}`;
  }
  setHistoryMetric(historyTotalKjEl, formatNumber(selectedRide.total_kj, 1));
  setHistoryMetric(historyAvgPowerEl, formatNumber(selectedRide.avg_power, 0));
  setHistoryMetric(historyAvgHrEl, formatNumber(selectedRide.avg_hr, 0));
  setHistoryMetric(historyAvgWPerHrEl, formatNumber(selectedRide.avg_w_per_hr, 2));
  setHistoryMetric(historySampleCountEl, String(historySummary.sampleCount));
  setHistoryMetric(historyDurationEl, historySummary.durationLabel);
  renderRideHistoryChart(stream);
  renderRideHistorySamples(stream);
}

function buildRideHistorySummary(ride, stream) {
  const timestamps = stream
    .map((row) => Number(row.timestamp))
    .filter((timestamp) => Number.isFinite(timestamp));
  const sampleCount = stream.length;
  const durationSeconds = timestamps.length >= 2
    ? Math.max(0, (Math.max(...timestamps) - Math.min(...timestamps)) / 1000)
    : null;

  return {
    ride,
    sampleCount,
    durationLabel: durationSeconds == null ? "--" : formatElapsedDuration(durationSeconds),
  };
}

function setHistoryMetric(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function renderRideHistoryChart(stream) {
  if (!rideHistoryChartEl) {
    return;
  }

  if (!Array.isArray(stream) || stream.length === 0) {
    rideHistoryChartEl.innerHTML = '<div class="history-chart-empty">No stream samples saved for this ride yet.</div>';
    return;
  }

  const powerPoints = stream.filter((row) => Number.isFinite(Number(row.timestamp)) && Number.isFinite(Number(row.power)));
  const hrPoints = stream.filter((row) => Number.isFinite(Number(row.timestamp)) && Number.isFinite(Number(row.hr)));
  if (powerPoints.length === 0 && hrPoints.length === 0) {
    rideHistoryChartEl.innerHTML = '<div class="history-chart-empty">This ride has samples, but none with chartable power or heart-rate values.</div>';
    return;
  }

  const allTimestamps = [...powerPoints, ...hrPoints].map((row) => Number(row.timestamp));
  const minTimestamp = Math.min(...allTimestamps);
  const maxTimestamp = Math.max(...allTimestamps);
  const timeSpan = Math.max(1, maxTimestamp - minTimestamp);
  const maxPower = Math.max(200, ...powerPoints.map((row) => Number(row.power) || 0));
  const maxHr = Math.max(120, ...hrPoints.map((row) => Number(row.hr) || 0));
  const width = 960;
  const height = 280;
  const buildPath = (rows, key, maxValue) => rows.map((row, index) => {
    const x = ((Number(row.timestamp) - minTimestamp) / timeSpan) * width;
    const y = height - ((Number(row[key]) || 0) / maxValue) * height;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  const powerPath = buildPath(powerPoints, "power", maxPower);
  const hrPath = buildPath(hrPoints, "hr", maxHr);
  const durationSeconds = Math.round(timeSpan / 1000);
  if (rideHistoryChartLabelEl) {
    rideHistoryChartLabelEl.textContent = `${stream.length} samples across ${formatElapsedDuration(durationSeconds)}.`;
  }

  rideHistoryChartEl.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="history-chart-svg" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="historyPowerFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(56,189,248,0.4)" />
          <stop offset="100%" stop-color="rgba(56,189,248,0.02)" />
        </linearGradient>
      </defs>
      <line x1="0" y1="${height - 1}" x2="${width}" y2="${height - 1}" class="history-axis" />
      <path d="${powerPath}" class="history-line history-line-power" />
      <path d="${hrPath}" class="history-line history-line-hr" />
    </svg>
    <div class="history-chart-legend">
      <span><i class="history-legend-swatch power"></i>Power</span>
      <span><i class="history-legend-swatch hr"></i>Heart rate</span>
    </div>
  `;
}

function renderRideHistorySamples(stream) {
  if (!rideHistorySamplesBodyEl) {
    return;
  }

  const rows = Array.isArray(stream) ? [...stream].slice(-12).reverse() : [];
  if (rows.length === 0) {
    rideHistorySamplesBodyEl.innerHTML = '<tr><td colspan="4">No ride samples saved for this ride.</td></tr>';
    return;
  }

  rideHistorySamplesBodyEl.innerHTML = rows.map((row) => {
    const timestampLabel = formatHistorySampleTimestamp(row.timestamp, stream[0]?.timestamp);
    return `<tr>
      <td>${timestampLabel}</td>
      <td>${formatNumber(row.power, 0)}</td>
      <td>${formatNumber(row.hr, 0)}</td>
      <td>${formatNumber(row.w_per_hr, 2)}</td>
    </tr>`;
  }).join("");
}

function formatRideHistoryDate(ride) {
  const source = ride?.date || ride?.created_at;
  const parsed = source ? new Date(source) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return ride?.date || `Ride #${ride?.id ?? "--"}`;
  }

  return parsed.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatRideHistoryCreatedAt(ride) {
  const parsed = ride?.created_at ? new Date(ride.created_at) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return "unknown time";
  }

  return parsed.toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatHistorySampleTimestamp(timestamp, firstTimestamp) {
  const numericTimestamp = Number(timestamp);
  const numericFirst = Number(firstTimestamp);
  if (Number.isFinite(numericTimestamp) && Number.isFinite(numericFirst)) {
    return formatElapsedDuration(Math.max(0, (numericTimestamp - numericFirst) / 1000));
  }

  return "--";
}
