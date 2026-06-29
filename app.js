const STORAGE_KEY = "life-command-center-v2";
const LEGACY_STORAGE_KEY = "life-command-center-v1";
const SUPABASE_JS_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const AREAS = [
  "Work",
  "Health / Medical",
  "Home / Admin",
  "Money",
  "Writing",
  "Body / Exercise",
  "Relationships",
  "Unsorted"
];

const STATUSES = [
  { id: "inbox", label: "Inbox" },
  { id: "red", label: "Red Zone" },
  { id: "now", label: "Doing" },
  { id: "active", label: "Active" },
  { id: "waiting", label: "Waiting" },
  { id: "later", label: "Later" },
  { id: "paused", label: "Paused" },
  { id: "done", label: "Done" }
];

const ESTIMATES = [5, 10, 15, 30, 60];

const ITEM_KINDS = [
  { id: "project", label: "Project" },
  { id: "rhythm", label: "Rhythm" }
];

const CADENCES = [
  { id: "daily", label: "Daily", days: 1 },
  { id: "every2", label: "Every 2 days", days: 2 },
  { id: "weekly", label: "Weekly", days: 7 },
  { id: "biweekly", label: "Every 2 weeks", days: 14 },
  { id: "monthly", label: "Monthly", days: 30 },
  { id: "quarterly", label: "Quarterly", days: 91 },
  { id: "yearly", label: "Yearly", days: 365 },
  { id: "asneeded", label: "As needed", days: null }
];

const MODES = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "both", label: "Both" }
];

const DASHBOARD_MODES = MODES.filter((mode) => mode.id !== "both");

const TIME_WINDOWS = [
  { id: "anytime", label: "Anytime", shortLabel: "Anytime", start: null, end: null },
  { id: "morning", label: "Morning", shortLabel: "Morning", start: 5 * 60, end: 11 * 60 },
  { id: "midday", label: "Midday", shortLabel: "Midday", start: 11 * 60, end: 14 * 60 },
  { id: "afternoon", label: "Afternoon", shortLabel: "Afternoon", start: 14 * 60, end: 17 * 60 },
  { id: "evening", label: "Evening", shortLabel: "Evening", start: 17 * 60, end: 21 * 60 },
  { id: "night", label: "Night", shortLabel: "Night", start: 21 * 60, end: 5 * 60 },
  { id: "exact", label: "Exact time", shortLabel: "Exact", start: null, end: null }
];

const STARTER_TEMPLATES = [
  {
    id: "dishes",
    title: "Dishes reset",
    description: "Minimum kitchen reset",
    kind: "rhythm",
    area: "Home / Admin",
    mode: "home",
    cadence: "daily",
    timeWindow: "evening",
    estimate: 10,
    importance: 4,
    dread: 2,
    nextAction: "Clear one sink or counter",
    minimum: "Clear one sink or counter",
    steps: ["Clear one sink or counter", "Load or wash obvious dishes", "Wipe the main surface"]
  },
  {
    id: "dinner",
    title: "Plan dinner",
    description: "Avoid the evening scramble",
    kind: "rhythm",
    area: "Home / Admin",
    mode: "home",
    cadence: "daily",
    timeWindow: "afternoon",
    estimate: 10,
    importance: 4,
    nextAction: "Pick one dinner option",
    minimum: "Pick one dinner option",
    steps: ["Pick one dinner option", "Check ingredients", "Start the first prep step"]
  },
  {
    id: "workout",
    title: "Work out",
    description: "Morning body anchor",
    kind: "rhythm",
    area: "Body / Exercise",
    mode: "home",
    cadence: "daily",
    timeWindow: "morning",
    estimate: 30,
    importance: 5,
    nextAction: "Start the warmup",
    minimum: "Start the warmup",
    steps: ["Put on workout clothes", "Start the warmup", "Do the written plan"]
  },
  {
    id: "work-checkin",
    title: "Check work queue",
    description: "Find the one work item that matters next",
    kind: "rhythm",
    area: "Work",
    mode: "work",
    cadence: "daily",
    timeWindow: "morning",
    estimate: 10,
    importance: 5,
    dread: 2,
    nextAction: "Open the work queue",
    minimum: "Open the work queue",
    steps: ["Open the work queue", "Pick the one visible next action", "Send or save one update"]
  },
  {
    id: "gas",
    title: "Get gas",
    description: "Keep the car ready",
    kind: "rhythm",
    area: "Home / Admin",
    mode: "home",
    cadence: "weekly",
    timeWindow: "anytime",
    estimate: 15,
    importance: 3,
    nextAction: "Check fuel level",
    minimum: "Check fuel level",
    steps: ["Check fuel level", "Pick the nearest gas stop", "Fill the tank"]
  },
  {
    id: "cleaning-reset",
    title: "Cleaning reset",
    description: "Small home reset",
    kind: "rhythm",
    area: "Home / Admin",
    mode: "home",
    cadence: "weekly",
    timeWindow: "morning",
    estimate: 15,
    importance: 4,
    nextAction: "Reset one visible surface",
    minimum: "Reset one visible surface",
    steps: ["Reset one visible surface", "Take out visible trash", "Put five items away"]
  },
  {
    id: "work-task",
    title: "Work task",
    description: "Clarify and start",
    kind: "project",
    area: "Work",
    mode: "work",
    timeWindow: "morning",
    estimate: 15,
    importance: 4,
    nextAction: "Define the next visible action",
    steps: ["Define the next visible action", "Open the source material", "Send or save one update"]
  },
  {
    id: "admin-appointment",
    title: "Appointment/admin task",
    description: "Portal, form, call, or booking",
    kind: "project",
    area: "Health / Medical",
    mode: "home",
    timeWindow: "anytime",
    estimate: 15,
    importance: 5,
    dread: 4,
    consequence: "Medical/admin",
    nextAction: "Open the portal or phone number",
    steps: ["Open the portal or phone number", "Find the missing requirement", "Send or schedule one action"]
  },
  {
    id: "scary-overdue",
    title: "Scary overdue thing",
    description: "Rescue without spiraling",
    kind: "project",
    area: "Unsorted",
    mode: "both",
    status: "red",
    timeWindow: "anytime",
    estimate: 10,
    importance: 5,
    dread: 5,
    consequence: "Embarrassing if ignored",
    nextAction: "Open the scary thing for 5 minutes",
    steps: ["Open the scary thing for 5 minutes", "Name the real consequence", "Send or schedule one recovery action"]
  }
];

const LIFE_RAIL_STARTERS = [
  { id: "body", label: "Body", templateIds: ["workout"] },
  { id: "house", label: "House", templateIds: ["dishes"] },
  { id: "work", label: "Work", templateIds: ["work-checkin"] }
];

const DEFAULT_RHYTHMS = [];

const STARTER_RHYTHM_TITLES = new Set([
  "weekly reset",
  "clean kitchen",
  "get gas",
  "work out",
  "monthly audit"
]);

const DEFAULT_DATA = {
  version: 10,
  createdAt: new Date().toISOString(),
  lastReviewed: "",
  lastBackupAt: "",
  mode: "home",
  filter: { area: "all", status: "" },
  todayPlan: createDailyPlan(),
  focusSession: null,
  dailyCheckin: createDailyCheckin(),
  alerts: createAlertSettings(),
  sync: createSyncState(),
  items: DEFAULT_RHYTHMS.map((rhythm) => createRhythmItem(rhythm)),
  recurring: []
};

const WIZARD_MODES = {
  project: {
    label: "Project",
    description: "A one-time thing with an endpoint, even if it has many steps.",
    steps: ["mode", "title", "context", "area", "done", "steps", "timing", "window", "consequence", "tiny", "summary"],
    defaults: { kind: "project", status: "active", importance: 3, dread: 3, estimate: 15 }
  },
  rhythm: {
    label: "Rhythm",
    description: "A recurring life rail that needs to come back forever.",
    steps: ["mode", "title", "context", "area", "cadence", "ladder", "window", "summary"],
    defaults: { kind: "rhythm", status: "active", importance: 4, dread: 2, estimate: 5, cadence: "weekly" }
  },
  rescue: {
    label: "Rescue something scary",
    description: "For something late, avoided, embarrassing, or consequence-heavy.",
    steps: ["mode", "title", "context", "fear", "timing", "window", "consequence", "tiny", "steps", "summary"],
    defaults: { kind: "project", status: "red", importance: 5, dread: 5, estimate: 10 }
  }
};

const CONSEQUENCE_OPTIONS = [
  "Due soon",
  "Blocks something important",
  "Someone is waiting",
  "Money or fee risk",
  "Medical/admin",
  "Work visibility",
  "Embarrassing if ignored"
];

const STEP_SUGGESTIONS = {
  project: [
    "Define what done looks like",
    "List the known pieces",
    "Find the next missing piece",
    "Do the first visible step",
    "Update this project"
  ],
  rhythm: [
    "Do the minimum version",
    "Put the required tools in sight",
    "Reset the space for 5 minutes",
    "Mark this rhythm done"
  ],
  rescue: [
    "Open the scary thing for 5 minutes",
    "Name the real consequence",
    "Draft the smallest recovery message",
    "Send or schedule one recovery action",
    "Set the next checkback"
  ]
};

let state = loadState();
let stuckItemId = "";
let wizard = createWizardState("project");
let emptyWizardAutoOpened = false;
let addMode = "capture";
let focusTimerId = 0;
let brainDumpCandidates = [];
let captureFollowupItemId = "";
let voiceRecognition = null;
let supabaseClientPromise = null;
let syncChoiceContext = null;

const els = {
  todayLabel: document.querySelector("#todayLabel"),
  todayModeLabel: document.querySelector("#todayModeLabel"),
  todayWindowLabel: document.querySelector("#todayWindowLabel"),
  focusAnchor: document.querySelector("#focusAnchor"),
  energyButtons: document.querySelectorAll("[data-energy]"),
  brainButtons: document.querySelectorAll("[data-brain]"),
  checkinSummaryText: document.querySelector("#checkinSummaryText"),
  checkinEffect: document.querySelector("#checkinEffect"),
  clearCheckinButton: document.querySelector("#clearCheckinButton"),
  todayTimeline: document.querySelector("#todayTimeline"),
  todayQueueCount: document.querySelector("#todayQueueCount"),
  todayQueueList: document.querySelector("#todayQueueList"),
  modeButtons: document.querySelectorAll("[data-mode-option]"),
  quickCaptureForm: document.querySelector("#quickCaptureForm"),
  quickCaptureInput: document.querySelector("#quickCaptureInput"),
  quickCaptureFollowup: document.querySelector("#quickCaptureFollowup"),
  quickVoiceStatus: document.querySelector("#quickVoiceStatus"),
  addChoiceButtons: document.querySelectorAll("[data-add-mode]"),
  addPanels: document.querySelectorAll("[data-add-panel]"),
  addCaptureForm: document.querySelector("#addCaptureForm"),
  addCaptureInput: document.querySelector("#addCaptureInput"),
  addCaptureFollowup: document.querySelector("#addCaptureFollowup"),
  addVoiceStatus: document.querySelector("#addVoiceStatus"),
  brainDumpInput: document.querySelector("#brainDumpInput"),
  extractBrainDumpButton: document.querySelector("#extractBrainDumpButton"),
  clearBrainDumpButton: document.querySelector("#clearBrainDumpButton"),
  brainCandidateList: document.querySelector("#brainCandidateList"),
  saveBrainDumpButton: document.querySelector("#saveBrainDumpButton"),
  templateGrid: document.querySelector("#templateGrid"),
  recommendationPanel: document.querySelector("#recommendationPanel"),
  refreshNowButton: document.querySelector("#refreshNowButton"),
  backupToolsButton: document.querySelector("#backupToolsButton"),
  backupDialog: document.querySelector("#backupDialog"),
  backupStatus: document.querySelector("#backupStatus"),
  backupFeedback: document.querySelector("#backupFeedback"),
  syncStatusBadge: document.querySelector("#syncStatusBadge"),
  syncStatus: document.querySelector("#syncStatus"),
  syncCopy: document.querySelector("#syncCopy"),
  syncFeedback: document.querySelector("#syncFeedback"),
  syncEmail: document.querySelector("#syncEmail"),
  syncLoginButton: document.querySelector("#syncLoginButton"),
  syncGoogleButton: document.querySelector("#syncGoogleButton"),
  syncAppleButton: document.querySelector("#syncAppleButton"),
  syncLogoutButton: document.querySelector("#syncLogoutButton"),
  syncNowButton: document.querySelector("#syncNowButton"),
  syncChoiceDialog: document.querySelector("#syncChoiceDialog"),
  syncChoiceMeta: document.querySelector("#syncChoiceMeta"),
  syncChoiceTitle: document.querySelector("#syncChoiceTitle"),
  syncChoiceSummary: document.querySelector("#syncChoiceSummary"),
  syncChoiceCopy: document.querySelector("#syncChoiceCopy"),
  closeSyncChoiceButton: document.querySelector("#closeSyncChoiceButton"),
  syncUploadButton: document.querySelector("#syncUploadButton"),
  syncDownloadButton: document.querySelector("#syncDownloadButton"),
  syncExportFirstButton: document.querySelector("#syncExportFirstButton"),
  syncStayLocalButton: document.querySelector("#syncStayLocalButton"),
  rhythmAlertButton: document.querySelector("#rhythmAlertButton"),
  alertStatus: document.querySelector("#alertStatus"),
  closeBackupButton: document.querySelector("#closeBackupButton"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  navButtons: document.querySelectorAll(".nav-button"),
  views: document.querySelectorAll("[data-view-panel]"),
  redCount: document.querySelector("#redCount"),
  inboxCount: document.querySelector("#inboxCount"),
  waitingCount: document.querySelector("#waitingCount"),
  activeCount: document.querySelector("#activeCount"),
  rhythmDueShell: document.querySelector("#rhythmDueShell"),
  rhythmDueList: document.querySelector("#rhythmDueList"),
  wizardView: document.querySelector("#wizardView"),
  resetWizardButton: document.querySelector("#resetWizardButton"),
  emptyWizardPrompt: document.querySelector("#emptyWizardPrompt"),
  lifeRailStarter: document.querySelector("#lifeRailStarter"),
  wizardModeLabel: document.querySelector("#wizardModeLabel"),
  wizardStepTitle: document.querySelector("#wizardStepTitle"),
  wizardStepCount: document.querySelector("#wizardStepCount"),
  wizardProgressBar: document.querySelector("#wizardProgressBar"),
  wizardBody: document.querySelector("#wizardBody"),
  wizardBackButton: document.querySelector("#wizardBackButton"),
  wizardSkipButton: document.querySelector("#wizardSkipButton"),
  wizardNextButton: document.querySelector("#wizardNextButton"),
  projectList: document.querySelector("#projectList"),
  areaFilter: document.querySelector("#areaFilter"),
  openMapButton: document.querySelector("#openMapButton"),
  statusFilters: document.querySelector("#statusFilters"),
  clearFilterButton: document.querySelector("#clearFilterButton"),
  mindMap: document.querySelector("#mindMap"),
  mapFocus: document.querySelector("#mapFocus"),
  rhythmLateCount: document.querySelector("#rhythmLateCount"),
  rhythmDueCount: document.querySelector("#rhythmDueCount"),
  rhythmDoneCount: document.querySelector("#rhythmDoneCount"),
  rhythmTotalCount: document.querySelector("#rhythmTotalCount"),
  rhythmUpcomingList: document.querySelector("#rhythmUpcomingList"),
  rhythmAllList: document.querySelector("#rhythmAllList"),
  reviewList: document.querySelector("#reviewList"),
  recurringList: document.querySelector("#recurringList"),
  addRhythmButtons: document.querySelectorAll("[data-add-rhythm]"),
  markReviewedButton: document.querySelector("#markReviewedButton"),
  itemDialog: document.querySelector("#itemDialog"),
  editForm: document.querySelector("#editForm"),
  closeEditButton: document.querySelector("#closeEditButton"),
  editDialogTitle: document.querySelector("#editDialogTitle"),
  editItemId: document.querySelector("#editItemId"),
  editTitle: document.querySelector("#editTitle"),
  editKind: document.querySelector("#editKind"),
  editArea: document.querySelector("#editArea"),
  editStatus: document.querySelector("#editStatus"),
  editMode: document.querySelector("#editMode"),
  editTimeWindow: document.querySelector("#editTimeWindow"),
  editExactTime: document.querySelector("#editExactTime"),
  editDue: document.querySelector("#editDue"),
  editReview: document.querySelector("#editReview"),
  editImportance: document.querySelector("#editImportance"),
  editDread: document.querySelector("#editDread"),
  editEstimate: document.querySelector("#editEstimate"),
  editWaitingFor: document.querySelector("#editWaitingFor"),
  editCadence: document.querySelector("#editCadence"),
  editLastDone: document.querySelector("#editLastDone"),
  editNextDue: document.querySelector("#editNextDue"),
  editTrigger: document.querySelector("#editTrigger"),
  editMinimum: document.querySelector("#editMinimum"),
  editRhythmGood: document.querySelector("#editRhythmGood"),
  editRhythmFull: document.querySelector("#editRhythmFull"),
  editNextAction: document.querySelector("#editNextAction"),
  editConsequence: document.querySelector("#editConsequence"),
  editNotes: document.querySelector("#editNotes"),
  editStepsList: document.querySelector("#editStepsList"),
  editStepInput: document.querySelector("#editStepInput"),
  editStepAddButton: document.querySelector("#editStepAddButton"),
  detailDialog: document.querySelector("#detailDialog"),
  detailMeta: document.querySelector("#detailMeta"),
  detailTitle: document.querySelector("#detailTitle"),
  detailBody: document.querySelector("#detailBody"),
  closeDetailButton: document.querySelector("#closeDetailButton"),
  focusDialog: document.querySelector("#focusDialog"),
  focusMeta: document.querySelector("#focusMeta"),
  focusTitle: document.querySelector("#focusTitle"),
  focusStateLabel: document.querySelector("#focusStateLabel"),
  focusTime: document.querySelector("#focusTime"),
  focusProgressBar: document.querySelector("#focusProgressBar"),
  focusStep: document.querySelector("#focusStep"),
  focusDoneButton: document.querySelector("#focusDoneButton"),
  focusPauseButton: document.querySelector("#focusPauseButton"),
  focusAddFiveButton: document.querySelector("#focusAddFiveButton"),
  focusSnoozeButton: document.querySelector("#focusSnoozeButton"),
  focusSnoozeChoices: document.querySelector("#focusSnoozeChoices"),
  focusNotifyButton: document.querySelector("#focusNotifyButton"),
  closeFocusButton: document.querySelector("#closeFocusButton"),
  deleteItemButton: document.querySelector("#deleteItemButton"),
  saveEditButton: document.querySelector("#saveEditButton"),
  stuckDialog: document.querySelector("#stuckDialog"),
  closeStuckButton: document.querySelector("#closeStuckButton"),
  stuckTitle: document.querySelector("#stuckTitle"),
  stuckCopy: document.querySelector("#stuckCopy"),
  stuckNote: document.querySelector("#stuckNote"),
  saveStuckNoteButton: document.querySelector("#saveStuckNoteButton"),
  itemCardTemplate: document.querySelector("#itemCardTemplate")
};

function cryptoId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function dateOffset(days) {
  const date = new Date(`${todayIso()}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createDailyPlan(date = todayIso()) {
  return {
    date,
    launchedAt: "",
    shutdownAt: "",
    anchorItemId: "",
    backupItemId: "",
    minimumText: "",
    shutdownNote: ""
  };
}

function createDailyCheckin(date = todayIso()) {
  return {
    date,
    energy: "",
    brain: ""
  };
}

function createAlertSettings() {
  return {
    rhythmEnabled: false,
    rhythmNotifiedKey: ""
  };
}

function createSyncState() {
  return {
    clientId: `client-${cryptoId()}`,
    enabled: false,
    lastSyncedAt: "",
    lastSyncedServerUpdatedAt: "",
    lastSessionCheckedAt: "",
    userId: "",
    userEmail: "",
    status: "off",
    lastError: ""
  };
}

function normalizeSyncState(sync = {}) {
  const fallback = createSyncState();
  return {
    ...fallback,
    ...sync,
    clientId: sync.clientId || fallback.clientId,
    enabled: Boolean(sync.enabled),
    lastSyncedAt: sync.lastSyncedAt || "",
    lastSyncedServerUpdatedAt: sync.lastSyncedServerUpdatedAt || "",
    lastSessionCheckedAt: sync.lastSessionCheckedAt || "",
    userId: sync.userId || "",
    userEmail: sync.userEmail || "",
    status: sync.status || "off",
    lastError: sync.lastError || ""
  };
}

function normalizeKind(kind) {
  return kind === "rhythm" ? "rhythm" : "project";
}

function modeFromArea(area) {
  return area === "Work" ? "work" : "home";
}

function normalizeMode(mode, area = "Unsorted") {
  const value = String(mode || "").toLowerCase().trim();
  return MODES.some((entry) => entry.id === value) ? value : modeFromArea(area);
}

function dashboardMode() {
  return DASHBOARD_MODES.some((mode) => mode.id === state.mode) ? state.mode : "home";
}

function modeMeta(mode = dashboardMode()) {
  return MODES.find((entry) => entry.id === mode) || MODES[0];
}

function itemMatchesMode(item, mode = dashboardMode()) {
  return item.mode === "both" || item.mode === mode;
}

function normalizeTimeWindow(windowId) {
  const value = String(windowId || "").toLowerCase().trim();
  return TIME_WINDOWS.some((entry) => entry.id === value) ? value : "anytime";
}

function timeWindowMeta(windowId) {
  return TIME_WINDOWS.find((entry) => entry.id === normalizeTimeWindow(windowId)) || TIME_WINDOWS[0];
}

function normalizeExactTime(value) {
  const text = String(value || "").trim();
  return /^\d{2}:\d{2}$/.test(text) ? text : "";
}

function cadenceMeta(cadence) {
  return CADENCES.find((entry) => entry.id === normalizeCadence(cadence)) || CADENCES[2];
}

function normalizeCadence(cadence) {
  const value = String(cadence || "").toLowerCase().trim();
  const direct = CADENCES.find((entry) => entry.id === value || entry.label.toLowerCase() === value);
  if (direct) return direct.id;
  if (value.includes("day")) return "daily";
  if (value.includes("week") && value.includes("2")) return "biweekly";
  if (value.includes("week")) return "weekly";
  if (value.includes("month")) return "monthly";
  if (value.includes("quarter")) return "quarterly";
  if (value.includes("year") || value.includes("annual")) return "yearly";
  return "weekly";
}

function addDaysToIso(value, days) {
  const date = toDate(value) || new Date(`${todayIso()}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function nextRhythmDue(lastDone, cadence) {
  const meta = cadenceMeta(cadence);
  if (meta.days === null) return "";
  if (!lastDone) return todayIso();
  return addDaysToIso(lastDone, meta.days);
}

function createRhythmItem(input = {}) {
  const minimum = input.minimum || input.nextAction || "Do the minimum version";
  const rhythmGood = input.rhythmGood || input.goodVersion || "";
  const rhythmFull = input.rhythmFull || input.fullVersion || "";
  const cadence = normalizeCadence(input.cadence || "weekly");
  const lastDone = input.lastDone || "";
  const title = String(input.title || "Recurring rhythm").trim();
  return {
    id: input.id || cryptoId(),
    kind: "rhythm",
    title,
    area: AREAS.includes(input.area) ? input.area : "Unsorted",
    mode: normalizeMode(input.mode, input.area),
    timeWindow: normalizeTimeWindow(input.timeWindow),
    exactTime: normalizeExactTime(input.exactTime),
    status: normalizeStatus(input.status || "active"),
    due: "",
    review: input.review || "",
    plannedFor: input.plannedFor || "",
    cadence,
    trigger: input.trigger || "",
    minimum,
    rhythmGood,
    rhythmFull,
    lastDone,
    nextDue: input.nextDue || nextRhythmDue(lastDone, cadence),
    consequence: input.consequence || "Recurring life rail",
    nextAction: input.nextAction || minimum,
    importance: clampNumber(input.importance, 1, 5, 4),
    dread: clampNumber(input.dread, 1, 5, 2),
    estimate: ESTIMATES.includes(Number(input.estimate)) ? Number(input.estimate) : 5,
    waitingFor: input.waitingFor || "",
    notes: input.notes || "",
    system: Boolean(input.system),
    starter: Boolean(input.starter),
    starterTemplateId: input.starterTemplateId || "",
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
    lastTouched: input.lastTouched || input.updatedAt || input.createdAt || "",
    completedAt: input.completedAt || "",
    snoozedUntil: input.snoozedUntil || "",
    snoozeCount: Number(input.snoozeCount || 0),
    steps: normalizeRhythmSteps(input.steps, minimum, rhythmGood, rhythmFull)
  };
}

function legacyRecurringToRhythm(item) {
  const title = item.title || "Recurring rhythm";
  const system = ["daily launch", "shutdown"].includes(String(title).toLowerCase());
  return createRhythmItem({
    id: `rhythm-${item.id || cryptoId()}`,
    title,
    cadence: item.cadence || "weekly",
    trigger: item.trigger || "",
    minimum: item.minimum || "Touch it for 5 minutes",
    lastDone: item.lastDone || "",
    system,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  });
}

function tomorrowAt(hour) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function addHours(hours) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function addMinutes(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function nextAtHour(hour) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  if (date.getTime() <= Date.now()) date.setDate(date.getDate() + 1);
  return date.toISOString();
}

function toDate(value) {
  if (!value) return null;
  const date = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysUntil(value) {
  const date = toDate(value);
  if (!date) return null;
  const today = new Date(`${todayIso()}T12:00:00`);
  return Math.round((date.getTime() - today.getTime()) / 86400000);
}

function formatDate(value) {
  const date = toDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function minutesNow(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

function exactTimeMinutes(value) {
  const exact = normalizeExactTime(value);
  if (!exact) return null;
  const [hours, minutes] = exact.split(":").map(Number);
  return hours * 60 + minutes;
}

function isMinuteInWindow(minute, meta) {
  if (meta.start === null || meta.end === null) return false;
  if (meta.start < meta.end) return minute >= meta.start && minute < meta.end;
  return minute >= meta.start || minute < meta.end;
}

function currentTimeWindowId(date = new Date()) {
  const minute = minutesNow(date);
  return TIME_WINDOWS.find((entry) => entry.start !== null && isMinuteInWindow(minute, entry))?.id || "anytime";
}

function timeWindowStatus(item, date = new Date()) {
  const windowId = normalizeTimeWindow(item.timeWindow);
  if (windowId === "anytime") return { state: "anytime", boost: 0, include: false, label: "Anytime" };

  const now = minutesNow(date);
  if (windowId === "exact") {
    const exact = exactTimeMinutes(item.exactTime);
    if (exact === null) return { state: "anytime", boost: 0, include: false, label: "Exact time" };
    const diff = exact - now;
    const label = `At ${item.exactTime}`;
    if (Math.abs(diff) <= 30) return { state: "current", boost: 90, include: true, label };
    if (diff > 0) return { state: "upcoming", boost: diff <= 180 ? 48 : 18, include: true, label };
    if (diff < 0) return { state: "missed", boost: 26, include: true, label };
    return { state: "future", boost: 12, include: false, label };
  }

  const meta = timeWindowMeta(windowId);
  if (isMinuteInWindow(now, meta)) return { state: "current", boost: 70, include: true, label: meta.shortLabel };

  const ordered = ["morning", "midday", "afternoon", "evening", "night"];
  const current = currentTimeWindowId(date);
  const itemIndex = ordered.indexOf(windowId);
  const currentIndex = ordered.indexOf(current);
  if (itemIndex === -1 || currentIndex === -1) return { state: "future", boost: 0, include: false, label: meta.shortLabel };
  if (current === "night" && now < 5 * 60 && windowId !== "night") {
    return { state: "upcoming", boost: 34, include: true, label: meta.shortLabel };
  }
  if (itemIndex > currentIndex) return { state: "upcoming", boost: 34, include: true, label: meta.shortLabel };
  return { state: "missed", boost: 20, include: true, label: meta.shortLabel };
}

function formatTimeWindow(item) {
  const meta = timeWindowMeta(item.timeWindow);
  if (meta.id === "exact" && item.exactTime) return `At ${item.exactTime}`;
  return meta.label;
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!stored) return cloneData(DEFAULT_DATA);
  try {
    return normalizeData(JSON.parse(stored));
  } catch {
    return cloneData(DEFAULT_DATA);
  }
}

function normalizeData(data) {
  const legacyRecurring = Array.isArray(data.recurring) ? data.recurring : [];
  const sourceItems = Array.isArray(data.items) ? data.items : [];
  const migratedRhythms = legacyRecurring
    .map(legacyRecurringToRhythm)
    .filter((rhythm) => !sourceItems.some((item) => item.id === rhythm.id || item.sourceRecurringId === rhythm.id));

  const normalized = {
    ...cloneData(DEFAULT_DATA),
    ...data,
    version: 10,
    lastBackupAt: data.lastBackupAt || "",
    mode: DASHBOARD_MODES.some((mode) => mode.id === data.mode) ? data.mode : "home",
    filter: { area: "all", status: "", kind: "", ...(data.filter || {}) },
    todayPlan: normalizeDailyPlan(data.todayPlan),
    focusSession: normalizeFocusSession(data.focusSession),
    dailyCheckin: normalizeDailyCheckin(data.dailyCheckin),
    alerts: normalizeAlertSettings(data.alerts),
    sync: normalizeSyncState(data.sync),
    items: [...sourceItems, ...migratedRhythms],
    recurring: []
  };

  normalized.items = normalized.items.map(normalizeItem);
  if (normalized.focusSession) {
    const focusItem = normalized.items.find((item) => item.id === normalized.focusSession.itemId);
    if (!focusItem || !isOpen(focusItem)) normalized.focusSession = null;
  }

  return normalized;
}

function normalizeItem(item) {
  const kind = normalizeKind(item.kind);
  if (kind === "rhythm") return normalizeRhythmItem(item);

  const steps = normalizeStepObjects(item.steps);
  return {
    id: item.id || cryptoId(),
    kind: "project",
    title: String(item.title || "Untitled").trim(),
    area: AREAS.includes(item.area) ? item.area : "Unsorted",
    mode: normalizeMode(item.mode, item.area),
    timeWindow: normalizeTimeWindow(item.timeWindow),
    exactTime: normalizeExactTime(item.exactTime),
    status: normalizeStatus(item.status),
    due: item.due || "",
    review: item.review || "",
    plannedFor: item.plannedFor || "",
    cadence: "",
    trigger: "",
    minimum: "",
    rhythmGood: "",
    rhythmFull: "",
    lastDone: "",
    nextDue: "",
    consequence: item.consequence || "",
    nextAction: item.nextAction || firstOpenStep(steps) || "",
    importance: clampNumber(item.importance, 1, 5, 3),
    dread: clampNumber(item.dread, 1, 5, 3),
    estimate: ESTIMATES.includes(Number(item.estimate)) ? Number(item.estimate) : 10,
    waitingFor: item.waitingFor || "",
    notes: item.notes || "",
    system: Boolean(item.system),
    starterTemplateId: item.starterTemplateId || "",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    lastTouched: item.lastTouched || item.updatedAt || item.createdAt || "",
    completedAt: item.completedAt || (item.status === "done" ? item.updatedAt || "" : ""),
    snoozedUntil: item.snoozedUntil || "",
    snoozeCount: Number(item.snoozeCount || 0),
    steps
  };
}

function normalizeRhythmItem(item) {
  const minimum = item.minimum || item.nextAction || "Do the minimum version";
  const sourceSteps = normalizeStepObjects(item.steps);
  const rhythmGood = item.rhythmGood || sourceSteps.find((step) => step.text !== minimum)?.text || "";
  const rhythmFull = item.rhythmFull || sourceSteps.find((step) => step.text !== minimum && step.text !== rhythmGood)?.text || "";
  const cadence = normalizeCadence(item.cadence || "weekly");
  const lastDone = item.lastDone || "";
  const title = String(item.title || "Recurring rhythm").trim();
  const untouchedStarter = STARTER_RHYTHM_TITLES.has(title.toLowerCase())
    && !item.lastDone
    && !item.notes
    && !item.waitingFor
    && !item.snoozeCount;
  const steps = normalizeRhythmSteps(item.steps, minimum, rhythmGood, rhythmFull);
  if (!steps.length) steps.push({ id: cryptoId(), text: minimum, done: false });

  return {
    id: item.id || cryptoId(),
    kind: "rhythm",
    title,
    area: AREAS.includes(item.area) ? item.area : "Unsorted",
    mode: normalizeMode(item.mode, item.area),
    timeWindow: normalizeTimeWindow(item.timeWindow),
    exactTime: normalizeExactTime(item.exactTime),
    status: normalizeStatus(item.status || "active"),
    due: "",
    review: item.review || "",
    plannedFor: item.plannedFor || "",
    cadence,
    trigger: item.trigger || "",
    minimum,
    rhythmGood,
    rhythmFull,
    lastDone,
    nextDue: item.nextDue || nextRhythmDue(lastDone, cadence),
    consequence: item.consequence || "Recurring life rail",
    nextAction: item.nextAction || minimum,
    importance: clampNumber(item.importance, 1, 5, 4),
    dread: clampNumber(item.dread, 1, 5, 2),
    estimate: ESTIMATES.includes(Number(item.estimate)) ? Number(item.estimate) : 5,
    waitingFor: item.waitingFor || "",
    notes: item.notes || "",
    system: Boolean(item.system),
    starter: Boolean(item.starter) || untouchedStarter,
    starterTemplateId: item.starterTemplateId || "",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    lastTouched: item.lastTouched || item.updatedAt || item.createdAt || "",
    completedAt: item.completedAt || "",
    snoozedUntil: item.snoozedUntil || "",
    snoozeCount: Number(item.snoozeCount || 0),
    steps
  };
}

function normalizeStepObjects(steps) {
  return Array.isArray(steps)
    ? steps.map((step) => ({
        id: step.id || cryptoId(),
        text: String(step.text || step || "").trim(),
        done: Boolean(step.done)
      })).filter((step) => step.text)
    : [];
}

function normalizeDailyPlan(plan = {}) {
  const today = todayIso();
  const sameDay = plan && plan.date === today;
  if (!sameDay) return createDailyPlan(today);

  return {
    date: today,
    launchedAt: plan.launchedAt || "",
    shutdownAt: plan.shutdownAt || "",
    anchorItemId: plan.anchorItemId || "",
    backupItemId: plan.backupItemId || "",
    minimumText: plan.minimumText || "",
    shutdownNote: plan.shutdownNote || ""
  };
}

function normalizeDailyCheckin(checkin = {}) {
  const today = todayIso();
  if (!checkin || checkin.date !== today) return createDailyCheckin(today);
  return {
    date: today,
    energy: ["low", "medium", "high"].includes(checkin.energy) ? checkin.energy : "",
    brain: ["clear", "foggy", "avoiding", "overloaded"].includes(checkin.brain) ? checkin.brain : ""
  };
}

function normalizeAlertSettings(alerts = {}) {
  return {
    rhythmEnabled: Boolean(alerts?.rhythmEnabled),
    rhythmNotifiedKey: alerts?.rhythmNotifiedKey || ""
  };
}

function normalizeFocusSession(session = null) {
  if (!session || typeof session !== "object") return null;
  const itemId = String(session.itemId || "").trim();
  const startedAt = session.startedAt && toDate(session.startedAt) ? session.startedAt : "";
  const endsAt = session.endsAt && toDate(session.endsAt) ? session.endsAt : "";
  if (!itemId || !startedAt || !endsAt) return null;

  return {
    itemId,
    startedAt,
    endsAt,
    durationMinutes: clampNumber(session.durationMinutes, 1, 180, 10),
    running: session.running !== false,
    pausedRemainingMs: Math.max(0, Number(session.pausedRemainingMs || 0)),
    alertEnabled: Boolean(session.alertEnabled),
    notifiedAt: session.notifiedAt || ""
  };
}

function ensureTodayPlan() {
  const current = normalizeDailyPlan(state.todayPlan);
  if (JSON.stringify(current) === JSON.stringify(state.todayPlan)) return;
  state.todayPlan = current;
  saveState();
}

function ensureDailyCheckin() {
  const current = normalizeDailyCheckin(state.dailyCheckin);
  if (JSON.stringify(current) === JSON.stringify(state.dailyCheckin)) return;
  state.dailyCheckin = current;
  saveState();
}

function normalizeStatus(status) {
  return STATUSES.some((entry) => entry.id === status) ? status : "inbox";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (Number.isNaN(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function saveState(options = {}) {
  if (options.lastSaved) state.lastSaved = options.lastSaved;
  else if (!options.keepLastSaved) state.lastSaved = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function firstOpenStep(steps) {
  const step = steps.find((entry) => !entry.done);
  return step ? step.text : "";
}

function getItem(id) {
  return state.items.find((item) => item.id === id);
}

function updateItem(id, patch, options = {}) {
  if (patch.status === "done" || patch.status === "paused" || patch.snoozedUntil) clearFocusForItem(id);
  state.items = state.items.map((item) => {
    if (item.id !== id) return item;
    const now = new Date().toISOString();
    const completing = patch.status === "done" && item.status !== "done";
    const reopening = patch.status && patch.status !== "done";
    return {
      ...item,
      ...patch,
      completedAt: completing ? now : reopening ? "" : (patch.completedAt ?? item.completedAt),
      updatedAt: now,
      lastTouched: options.touch === false ? item.lastTouched : now
    };
  });
  saveState();
  render();
}

function deleteItem(id) {
  state.items = state.items.filter((item) => item.id !== id);
  saveState();
  render();
}

function addItem(input) {
  const defaultAction = input.nextAction || input.minimum || "Open this for 5 minutes";
  const item = normalizeData({
    items: [{
      id: cryptoId(),
      kind: input.kind || "project",
      title: input.title,
      area: input.area || "Unsorted",
      mode: input.mode || dashboardMode(),
      timeWindow: input.timeWindow || "anytime",
      exactTime: input.exactTime || "",
      status: input.status || (input.kind === "rhythm" ? "active" : "inbox"),
      due: input.due || "",
      review: input.review || "",
      plannedFor: input.plannedFor || "",
      cadence: input.cadence || "",
      trigger: input.trigger || "",
      minimum: input.minimum || "",
      rhythmGood: input.rhythmGood || "",
      rhythmFull: input.rhythmFull || "",
      lastDone: input.lastDone || "",
      nextDue: input.nextDue || "",
      consequence: input.consequence || "",
      nextAction: defaultAction,
      importance: input.importance || 3,
      dread: input.dread || 3,
      estimate: input.estimate || 10,
      waitingFor: input.waitingFor || "",
      notes: input.notes || "",
      system: Boolean(input.system),
      starterTemplateId: input.starterTemplateId || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastTouched: "",
      completedAt: input.completedAt || "",
      steps: normalizeSteps(input.steps || [], defaultAction)
    }]
  }).items[0];

  state.items.unshift(item);
  saveState();
  render();
  return item;
}

function normalizeSteps(steps, nextAction) {
  const fromLines = Array.isArray(steps) ? steps : String(steps || "").split(/\r?\n/);
  const parsed = fromLines.map((line) => String(line).trim()).filter(Boolean);
  if (!parsed.length && nextAction) parsed.push(nextAction);
  return parsed.map((text) => ({ id: cryptoId(), text, done: false }));
}

function normalizeRhythmSteps(steps, minimum, rhythmGood = "", rhythmFull = "") {
  const labels = [
    minimum,
    rhythmGood,
    rhythmFull
  ].map((text) => String(text || "").trim()).filter(Boolean);
  const source = Array.isArray(steps) && steps.length ? steps : labels;
  const normalized = normalizeStepObjects(source);
  labels.forEach((label) => {
    if (!normalized.some((step) => step.text.toLowerCase() === label.toLowerCase())) {
      normalized.push({ id: cryptoId(), text: label, done: false });
    }
  });
  if (!normalized.length && minimum) normalized.push({ id: cryptoId(), text: minimum, done: false });
  return normalized;
}

function createWizardState(mode) {
  const safeMode = WIZARD_MODES[mode] ? mode : "project";
  const meta = WIZARD_MODES[safeMode];
  return {
    mode: safeMode,
    stepIndex: 0,
    data: {
      title: "",
      area: "Unsorted",
      mode: dashboardMode(),
      timeWindow: "anytime",
      exactTime: "",
      kind: meta.defaults.kind,
      status: meta.defaults.status,
      due: "",
      review: "",
      cadence: meta.defaults.cadence || "weekly",
      trigger: "",
      minimum: "",
      rhythmGood: "",
      rhythmFull: "",
      consequenceTags: [],
      customConsequence: "",
      fear: "",
      done: "",
      waitingFor: "",
      nextAction: "",
      steps: [],
      notes: "",
      importance: meta.defaults.importance,
      dread: meta.defaults.dread,
      estimate: meta.defaults.estimate
    }
  };
}

function currentWizardSteps() {
  return WIZARD_MODES[wizard.mode].steps;
}

function currentWizardStep() {
  return currentWizardSteps()[wizard.stepIndex];
}

function resetWizard(mode = "project") {
  wizard = createWizardState(mode);
  renderWizard();
}

function showAddMode(mode = addMode) {
  addMode = ["capture", "brain", "template", "wizard"].includes(mode) ? mode : "capture";
  els.addChoiceButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.addMode === addMode);
  });
  els.addPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.addPanel === addMode);
  });
  if (els.resetWizardButton) els.resetWizardButton.hidden = addMode !== "wizard";
}

function wizardStepTitle(step) {
  const titles = {
    mode: "Choose a path",
    title: "Name it",
    context: "Home, work, or both?",
    area: "Where does it belong?",
    cadence: "How often does it repeat?",
    ladder: "Choose the versions",
    timing: "When does it matter?",
    window: "When should this show up?",
    consequence: "Why does it matter?",
    waiting: "Is someone else involved?",
    tiny: "Find the tiny start",
    steps: "Add small steps",
    done: "What does done look like?",
    fear: "What makes it scary?",
    summary: "Create the item"
  };
  return titles[step] || "Wizard";
}

function renderWizard() {
  if (!els.wizardBody) return;
  const empty = !hasActiveVisibleItems();
  if (els.emptyWizardPrompt) els.emptyWizardPrompt.hidden = !empty;
  if (els.wizardView) els.wizardView.classList.toggle("is-empty", empty);
  const steps = currentWizardSteps();
  const step = currentWizardStep();
  const progress = Math.round(((wizard.stepIndex + 1) / steps.length) * 100);

  els.wizardModeLabel.textContent = WIZARD_MODES[wizard.mode].label;
  els.wizardStepTitle.textContent = wizardStepTitle(step);
  els.wizardStepCount.textContent = `${wizard.stepIndex + 1}/${steps.length}`;
  els.wizardProgressBar.style.width = `${progress}%`;
  els.wizardBackButton.disabled = wizard.stepIndex === 0;
  els.wizardSkipButton.hidden = step === "mode" || step === "summary";
  els.wizardNextButton.textContent = step === "summary" ? "Create item" : "Next";

  els.wizardBody.replaceChildren(renderWizardStep(step));
}

function renderWizardStep(step) {
  if (step === "mode") return renderWizardMode();
  if (step === "title") return renderWizardText({
    key: "title",
    prompt: "What should this be called?",
    placeholder: "Example: renew car sticker"
  });
  if (step === "context") return renderWizardContext();
  if (step === "area") return renderWizardArea();
  if (step === "cadence") return renderWizardCadence();
  if (step === "ladder") return renderWizardLadder();
  if (step === "timing") return renderWizardTiming();
  if (step === "window") return renderWizardWindow();
  if (step === "consequence") return renderWizardConsequence();
  if (step === "waiting") return renderWizardWaiting();
  if (step === "tiny") return renderWizardTiny();
  if (step === "steps") return renderWizardSteps();
  if (step === "done") return renderWizardText({
    key: "done",
    prompt: "What would count as done enough?",
    placeholder: "Example: submitted, paid, emailed, drafted, scheduled",
    multiline: true
  });
  if (step === "fear") return renderWizardFear();
  if (step === "summary") return renderWizardSummary();
  return makeEmpty("Unknown wizard step");
}

function wizardPanel(prompt) {
  const panel = document.createElement("div");
  panel.className = "wizard-step";
  const copy = document.createElement("p");
  copy.className = "wizard-prompt";
  copy.textContent = prompt;
  panel.append(copy);
  return panel;
}

function renderWizardMode() {
  const panel = wizardPanel("Is this a finite project, a recurring rhythm, or something scary to rescue?");
  const grid = document.createElement("div");
  grid.className = "wizard-option-grid";

  Object.entries(WIZARD_MODES).forEach(([mode, meta]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `wizard-option${wizard.mode === mode ? " is-selected" : ""}`;
    const title = document.createElement("strong");
    title.textContent = meta.label;
    const description = document.createElement("span");
    description.textContent = meta.description;
    button.append(title, description);
    button.addEventListener("click", () => {
      wizard = createWizardState(mode);
      wizard.stepIndex = 1;
      renderWizard();
    });
    grid.append(button);
  });

  panel.append(grid);
  return panel;
}

function renderWizardText({ key, prompt, placeholder, multiline = false }) {
  const panel = wizardPanel(prompt);
  const label = document.createElement("label");
  label.className = "wizard-field";
  label.textContent = "Answer";
  const field = multiline ? document.createElement("textarea") : document.createElement("input");
  if (multiline) field.rows = 4;
  field.value = wizard.data[key] || "";
  field.placeholder = placeholder;
  field.addEventListener("input", () => {
    wizard.data[key] = field.value;
  });
  label.append(field);
  panel.append(label);
  return panel;
}

function renderWizardContext() {
  const panel = wizardPanel("Pick where this belongs. Both means it can appear on either dashboard.");
  const grid = document.createElement("div");
  grid.className = "wizard-chip-grid";
  MODES.forEach((mode) => {
    grid.append(makeWizardChoice(mode.label, wizard.data.mode === mode.id, () => {
      wizard.data.mode = mode.id;
      if (mode.id === "work" && wizard.data.area === "Unsorted") wizard.data.area = "Work";
      if (mode.id === "home" && wizard.data.area === "Work") wizard.data.area = "Home / Admin";
      renderWizard();
    }));
  });
  panel.append(grid);
  return panel;
}

function renderWizardArea() {
  const panel = wizardPanel("Pick the closest bucket. This is only for sorting; it can change later.");
  const grid = document.createElement("div");
  grid.className = "wizard-chip-grid";
  AREAS.forEach((area) => {
    grid.append(makeWizardChoice(area, wizard.data.area === area, () => {
      wizard.data.area = area;
      renderWizard();
    }));
  });
  panel.append(grid);
  return panel;
}

function renderWizardCadence() {
  const panel = wizardPanel("Choose how this rhythm should come back. You can tune it later.");
  panel.append(makeChoiceGroup("Cadence", CADENCES, wizard.data.cadence, (value) => {
    wizard.data.cadence = value;
    renderWizard();
  }));

  const triggerLabel = document.createElement("label");
  triggerLabel.className = "wizard-field";
  triggerLabel.textContent = "Trigger";
  const triggerInput = document.createElement("input");
  triggerInput.value = wizard.data.trigger;
  triggerInput.placeholder = "Example: after dinner, Sunday morning, under half tank";
  triggerInput.addEventListener("input", () => {
    wizard.data.trigger = triggerInput.value;
  });
  triggerLabel.append(triggerInput);

  panel.append(triggerLabel);
  return panel;
}

function renderWizardLadder() {
  const panel = wizardPanel("Give this rhythm a ladder. Low-energy days can still count.");
  const fields = [
    {
      key: "minimum",
      label: "Bare minimum",
      placeholder: "Example: clear one sink or put on workout clothes"
    },
    {
      key: "rhythmGood",
      label: "Good version",
      placeholder: "Example: load dishes or do the warmup"
    },
    {
      key: "rhythmFull",
      label: "Full reset",
      placeholder: "Example: reset kitchen or finish the written workout"
    }
  ];

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.className = "wizard-field";
    label.textContent = field.label;
    const input = document.createElement("input");
    input.value = wizard.data[field.key] || "";
    input.placeholder = field.placeholder;
    input.addEventListener("input", () => {
      wizard.data[field.key] = input.value;
      if (field.key === "minimum") wizard.data.nextAction = input.value;
    });
    label.append(input);
    panel.append(label);
  });

  return panel;
}

function renderWizardTiming() {
  const panel = wizardPanel("Choose a due date if there is one. If not, choose when this should resurface.");
  const dueChoices = [
    { label: "Today", value: todayIso() },
    { label: "Tomorrow", value: dateOffset(1) },
    { label: "This week", value: dateOffset(7) },
    { label: "No due date", value: "" }
  ];
  const reviewChoices = [
    { label: "Review tomorrow", value: dateOffset(1) },
    { label: "Review in 3 days", value: dateOffset(3) },
    { label: "Review next week", value: dateOffset(7) },
    { label: "No review", value: "" }
  ];

  panel.append(makeChoiceGroup("Due", dueChoices, wizard.data.due, (value) => {
    wizard.data.due = value;
    if (value && !wizard.data.review) wizard.data.review = value;
    renderWizard();
  }));

  const dueLabel = document.createElement("label");
  dueLabel.className = "wizard-field";
  dueLabel.textContent = "Custom due date";
  const dueInput = document.createElement("input");
  dueInput.type = "date";
  dueInput.value = wizard.data.due;
  dueInput.addEventListener("input", () => {
    wizard.data.due = dueInput.value;
  });
  dueLabel.append(dueInput);
  panel.append(dueLabel);

  panel.append(makeChoiceGroup("Review", reviewChoices, wizard.data.review, (value) => {
    wizard.data.review = value;
    renderWizard();
  }));
  return panel;
}

function renderWizardWindow() {
  const panel = wizardPanel("Choose when this should rise in the Today queue. It will still stay visible if the window passes.");
  const grid = document.createElement("div");
  grid.className = "wizard-chip-grid";
  TIME_WINDOWS.forEach((windowOption) => {
    grid.append(makeWizardChoice(windowOption.label, wizard.data.timeWindow === windowOption.id, () => {
      wizard.data.timeWindow = windowOption.id;
      renderWizard();
    }));
  });
  panel.append(grid);

  const label = document.createElement("label");
  label.className = "wizard-field";
  label.textContent = "Exact time";
  const input = document.createElement("input");
  input.type = "time";
  input.value = wizard.data.exactTime;
  input.addEventListener("input", () => {
    wizard.data.exactTime = input.value;
    if (input.value) wizard.data.timeWindow = "exact";
  });
  label.append(input);
  panel.append(label);
  return panel;
}

function renderWizardConsequence() {
  const panel = wizardPanel("Tap anything that explains why this should not disappear.");
  const grid = document.createElement("div");
  grid.className = "wizard-chip-grid";
  CONSEQUENCE_OPTIONS.forEach((option) => {
    grid.append(makeWizardChoice(option, wizard.data.consequenceTags.includes(option), () => {
      toggleArrayValue(wizard.data.consequenceTags, option);
      if (option === "Someone is waiting") {
        const isWaiting = wizard.data.consequenceTags.includes(option);
        wizard.data.status = isWaiting ? "waiting" : WIZARD_MODES[wizard.mode].defaults.status;
      }
      renderWizard();
    }));
  });
  panel.append(grid);

  const label = document.createElement("label");
  label.className = "wizard-field";
  label.textContent = "Custom why";
  const input = document.createElement("input");
  input.value = wizard.data.customConsequence;
  input.placeholder = "Example: needed before doctor appointment";
  input.addEventListener("input", () => {
    wizard.data.customConsequence = input.value;
  });
  label.append(input);
  panel.append(label);
  return panel;
}

function renderWizardWaiting() {
  const panel = wizardPanel("If this depends on another person, office, reply, delivery, or portal, put that here.");
  const row = document.createElement("div");
  row.className = "wizard-chip-grid";
  row.append(
    makeWizardChoice("Nobody", !wizard.data.waitingFor && wizard.data.status !== "waiting", () => {
      wizard.data.waitingFor = "";
      if (wizard.data.status === "waiting") wizard.data.status = WIZARD_MODES[wizard.mode].defaults.status;
      renderWizard();
    }),
    makeWizardChoice("Waiting on someone", wizard.data.status === "waiting", () => {
      wizard.data.status = "waiting";
      wizard.data.review = wizard.data.review || dateOffset(2);
      renderWizard();
    })
  );
  panel.append(row);

  const label = document.createElement("label");
  label.className = "wizard-field";
  label.textContent = "Waiting for";
  const input = document.createElement("input");
  input.value = wizard.data.waitingFor;
  input.placeholder = "Person, clinic, reply, office, delivery";
  input.addEventListener("input", () => {
    wizard.data.waitingFor = input.value;
    if (input.value.trim()) wizard.data.status = "waiting";
  });
  label.append(input);
  panel.append(label);
  return panel;
}

function renderWizardTiny() {
  const panel = wizardPanel("Choose the first physical action small enough to start while tired.");
  const suggestions = STEP_SUGGESTIONS[wizard.mode] || STEP_SUGGESTIONS.project;
  const grid = document.createElement("div");
  grid.className = "wizard-option-grid";
  suggestions.forEach((step) => {
    grid.append(makeWizardChoice(step, wizard.data.nextAction === step, () => {
      wizard.data.nextAction = step;
      if (!wizard.data.steps.length) wizard.data.steps = [step];
      renderWizard();
    }, "wizard-option compact"));
  });
  panel.append(grid);

  const label = document.createElement("label");
  label.className = "wizard-field";
  label.textContent = "Custom tiny start";
  const input = document.createElement("input");
  input.value = wizard.data.nextAction;
  input.placeholder = "Example: open the DMV site";
  input.addEventListener("input", () => {
    wizard.data.nextAction = input.value;
  });
  label.append(input);
  panel.append(label);
  return panel;
}

function renderWizardSteps() {
  const panel = wizardPanel("Add a few visible steps. They can be rough and incomplete.");
  const suggestions = STEP_SUGGESTIONS[wizard.mode] || STEP_SUGGESTIONS.project;
  const grid = document.createElement("div");
  grid.className = "wizard-chip-grid";
  suggestions.forEach((step) => {
    grid.append(makeWizardChoice(step, wizard.data.steps.includes(step), () => {
      toggleArrayValue(wizard.data.steps, step);
      if (!wizard.data.nextAction && wizard.data.steps.length) wizard.data.nextAction = wizard.data.steps[0];
      renderWizard();
    }));
  });
  panel.append(grid);

  const label = document.createElement("label");
  label.className = "wizard-field";
  label.textContent = "Custom steps";
  const textarea = document.createElement("textarea");
  textarea.rows = 5;
  textarea.placeholder = "One step per line";
  textarea.value = wizard.data.steps.join("\n");
  textarea.addEventListener("input", () => {
    wizard.data.steps = textarea.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  });
  label.append(textarea);
  panel.append(label);
  return panel;
}

function renderWizardFear() {
  const panel = wizardPanel("Name the scary part. This turns dread into data.");
  const grid = document.createElement("div");
  grid.className = "wizard-chip-grid";
  ["It is late", "I might disappoint someone", "It could cost money", "I do not know the steps", "I need to send a message"].forEach((fear) => {
    grid.append(makeWizardChoice(fear, wizard.data.fear.includes(fear), () => {
      wizard.data.fear = wizard.data.fear === fear ? "" : fear;
      renderWizard();
    }));
  });
  panel.append(grid);

  const label = document.createElement("label");
  label.className = "wizard-field";
  label.textContent = "Custom scary part";
  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.value = wizard.data.fear;
  textarea.placeholder = "What are you afraid will happen?";
  textarea.addEventListener("input", () => {
    wizard.data.fear = textarea.value;
  });
  label.append(textarea);
  panel.append(label);
  return panel;
}

function renderWizardSummary() {
  const item = buildWizardItem();
  const panel = wizardPanel("This is what will be created. You can edit it later.");
  const card = document.createElement("article");
  card.className = `wizard-summary status-${item.status}`;

  const title = document.createElement("h3");
  title.textContent = item.title;
  const meta = document.createElement("p");
  meta.className = "item-meta";
  meta.textContent = [
    item.kind === "rhythm" ? "Rhythm" : "Project",
    modeMeta(item.mode).label,
    formatTimeWindow(item),
    item.area,
    statusLabel(item.status),
    item.cadence ? cadenceMeta(item.cadence).label : "",
    item.nextDue ? `Due ${formatDate(item.nextDue)}` : "",
    item.due ? `Due ${formatDate(item.due)}` : "",
    item.review ? `Review ${formatDate(item.review)}` : ""
  ].filter(Boolean).join(" / ");

  const tiny = document.createElement("div");
  tiny.className = "tiny-start";
  const tinyLabel = document.createElement("span");
  tinyLabel.textContent = item.kind === "rhythm" ? "Bare minimum" : "Tiny start";
  const tinyText = document.createElement("strong");
  tinyText.textContent = item.nextAction || firstOpenStep(item.steps) || "Open this for 5 minutes";
  tiny.append(tinyLabel, tinyText);

  const ladder = document.createElement("div");
  ladder.className = "rhythm-ladder";
  if (item.kind === "rhythm") {
    [
      ["Minimum", item.minimum],
      ["Good", item.rhythmGood],
      ["Full", item.rhythmFull]
    ].filter((entry) => entry[1]).forEach(([label, value]) => {
      const row = document.createElement("p");
      const key = document.createElement("span");
      key.textContent = label;
      const text = document.createElement("strong");
      text.textContent = value;
      row.append(key, text);
      ladder.append(row);
    });
  }

  const steps = document.createElement("ul");
  steps.className = "wizard-summary-steps";
  normalizeSteps(item.steps, item.nextAction).slice(0, 6).forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step.text;
    steps.append(li);
  });

  card.append(meta, title);
  if (ladder.childElementCount) card.append(ladder);
  else card.append(tiny);
  card.append(steps);
  panel.append(card);
  return panel;
}

function makeChoiceGroup(labelText, choices, selected, onChoose) {
  const wrap = document.createElement("div");
  wrap.className = "wizard-choice-group";
  const label = document.createElement("p");
  label.className = "choice-label";
  label.textContent = labelText;
  const grid = document.createElement("div");
  grid.className = "wizard-chip-grid";
  choices.forEach((choice) => {
    const value = choice.value ?? choice.id;
    grid.append(makeWizardChoice(choice.label, selected === value, () => onChoose(value)));
  });
  wrap.append(label, grid);
  return wrap;
}

function makeWizardChoice(label, selected, onClick, className = "wizard-chip") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${className}${selected ? " is-selected" : ""}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function toggleArrayValue(array, value) {
  const index = array.indexOf(value);
  if (index >= 0) array.splice(index, 1);
  else array.push(value);
}

function wizardNext() {
  const step = currentWizardStep();
  applyWizardDefault(step);
  if (step === "summary") {
    addItem(buildWizardItem());
    resetWizard(wizard.mode);
    showView("now");
    return;
  }
  wizard.stepIndex = Math.min(wizard.stepIndex + 1, currentWizardSteps().length - 1);
  renderWizard();
}

function wizardBack() {
  wizard.stepIndex = Math.max(0, wizard.stepIndex - 1);
  renderWizard();
}

function wizardSkip() {
  applyWizardDefault(currentWizardStep(), true);
  wizard.stepIndex = Math.min(wizard.stepIndex + 1, currentWizardSteps().length - 1);
  renderWizard();
}

function applyWizardDefault(step, skipped = false) {
  if (step === "title" && !wizard.data.title.trim()) {
    wizard.data.title = wizard.mode === "rescue" ? "Scary thing to rescue" : wizard.mode === "rhythm" ? "New rhythm" : "New project";
  }
  if (step === "cadence" && !wizard.data.minimum.trim()) {
    wizard.data.minimum = STEP_SUGGESTIONS.rhythm[0];
  }
  if (step === "ladder") {
    if (!wizard.data.minimum.trim()) wizard.data.minimum = wizard.data.nextAction.trim() || STEP_SUGGESTIONS.rhythm[0];
    if (!wizard.data.nextAction.trim()) wizard.data.nextAction = wizard.data.minimum;
  }
  if (step === "tiny" && !wizard.data.nextAction.trim()) {
    wizard.data.nextAction = STEP_SUGGESTIONS[wizard.mode][0];
  }
  if (step === "steps" && !wizard.data.steps.length) {
    wizard.data.steps = STEP_SUGGESTIONS[wizard.mode].slice(0, 5);
  }
  if (step === "waiting" && skipped && wizard.data.status === "waiting" && !wizard.data.waitingFor.trim()) {
    wizard.data.status = WIZARD_MODES[wizard.mode].defaults.status;
  }
}

function buildWizardItem() {
  const defaults = WIZARD_MODES[wizard.mode].defaults;
  const consequenceParts = [
    ...wizard.data.consequenceTags,
    wizard.data.customConsequence.trim()
  ].filter(Boolean);
  const notes = [];
  if (wizard.data.done.trim()) notes.push(`Done enough: ${wizard.data.done.trim()}`);
  if (wizard.data.fear.trim()) notes.push(`Scary part: ${wizard.data.fear.trim()}`);
  if (wizard.data.notes.trim()) notes.push(wizard.data.notes.trim());

  const nextAction = wizard.data.nextAction.trim() || STEP_SUGGESTIONS[wizard.mode][0];
  const minimum = wizard.data.minimum.trim() || nextAction;
  const rhythmGood = wizard.data.rhythmGood.trim();
  const rhythmFull = wizard.data.rhythmFull.trim();
  const steps = wizard.mode === "rhythm"
    ? [minimum, rhythmGood, rhythmFull].filter(Boolean)
    : wizard.data.steps.length ? wizard.data.steps : [nextAction];
  let status = wizard.data.status || defaults.status;
  if (wizard.data.waitingFor.trim()) status = "waiting";
  if (wizard.mode === "rescue") status = "red";
  if (wizard.mode === "rhythm") status = "active";

  return {
    kind: defaults.kind,
    title: wizard.data.title.trim() || (wizard.mode === "rhythm" ? "New rhythm" : "New project"),
    area: wizard.data.area || "Unsorted",
    mode: wizard.data.mode || dashboardMode(),
    timeWindow: wizard.data.timeWindow || "anytime",
    exactTime: wizard.data.timeWindow === "exact" ? normalizeExactTime(wizard.data.exactTime) : "",
    status,
    due: wizard.mode === "rhythm" ? "" : wizard.data.due,
    review: wizard.mode === "rhythm" ? "" : wizard.data.review || (status === "waiting" ? dateOffset(2) : ""),
    plannedFor: "",
    cadence: wizard.mode === "rhythm" ? wizard.data.cadence : "",
    trigger: wizard.mode === "rhythm" ? wizard.data.trigger.trim() : "",
    minimum: wizard.mode === "rhythm" ? minimum : "",
    rhythmGood: wizard.mode === "rhythm" ? rhythmGood : "",
    rhythmFull: wizard.mode === "rhythm" ? rhythmFull : "",
    nextDue: wizard.mode === "rhythm" ? nextRhythmDue("", wizard.data.cadence) : "",
    consequence: consequenceParts.join(", "),
    nextAction,
    importance: wizard.data.importance || defaults.importance,
    dread: wizard.data.dread || defaults.dread,
    estimate: wizard.data.estimate || defaults.estimate,
    waitingFor: wizard.data.waitingFor.trim(),
    notes: notes.join("\n"),
    steps
  };
}

function updateStep(itemId, stepId, patch) {
  const item = getItem(itemId);
  if (!item) return;
  item.steps = item.steps.map((step) => (step.id === stepId ? { ...step, ...patch } : step));
  item.updatedAt = new Date().toISOString();
  item.lastTouched = item.updatedAt;
  saveState();
  render();
}

function addStep(itemId, text) {
  const item = getItem(itemId);
  if (!item || !text.trim()) return;
  item.steps.push({ id: cryptoId(), text: text.trim(), done: false });
  item.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function removeStep(itemId, stepId) {
  const item = getItem(itemId);
  if (!item) return;
  item.steps = item.steps.filter((step) => step.id !== stepId);
  item.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function completeCurrentStep(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  if (isRhythm(item)) {
    completeRhythm(itemId);
    return;
  }
  const step = item.steps.find((entry) => !entry.done);
  if (step) {
    step.done = true;
    const finished = item.steps.every((entry) => entry.done);
    item.status = finished ? "done" : item.status === "inbox" ? "active" : item.status;
    if (finished) item.completedAt = new Date().toISOString();
    clearFocusForItem(itemId);
    item.updatedAt = new Date().toISOString();
    item.lastTouched = item.updatedAt;
    saveState();
    render();
    return;
  }
  updateItem(itemId, { status: "done" });
}

function completeItem(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  if (isRhythm(item)) {
    completeRhythm(itemId);
    return;
  }
  updateItem(itemId, {
    status: "done",
    steps: item.steps.map((step) => ({ ...step, done: true }))
  });
}

function markRhythmDone(item) {
  const now = new Date().toISOString();
  item.lastDone = todayIso();
  item.nextDue = nextRhythmDue(item.lastDone, item.cadence);
  item.status = "active";
  item.snoozedUntil = "";
  item.completedAt = now;
  item.steps = item.steps.map((step) => ({ ...step, done: false }));
  item.updatedAt = now;
  item.lastTouched = now;
}

function completeRhythm(itemId) {
  const item = getItem(itemId);
  if (!item || !isRhythm(item)) return;
  clearFocusForItem(itemId);
  markRhythmDone(item);
  saveState();
  render();
}

function undoCompleteItem(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  const now = new Date().toISOString();
  clearFocusForItem(itemId);
  if (isRhythm(item)) {
    if (item.lastDone === todayIso()) item.lastDone = "";
    item.nextDue = nextRhythmDue(item.lastDone, item.cadence);
    item.status = "active";
    item.completedAt = "";
    item.plannedFor = todayIso();
    item.snoozedUntil = "";
    item.updatedAt = now;
    item.lastTouched = now;
    saveState();
    render();
    return;
  }

  item.status = "active";
  item.completedAt = "";
  item.plannedFor = todayIso();
  item.snoozedUntil = "";
  item.steps = item.steps.map((step) => ({ ...step, done: false }));
  item.updatedAt = now;
  item.lastTouched = now;
  saveState();
  render();
}

function isRhythm(item) {
  return item.kind === "rhythm";
}

function isProject(item) {
  return item.kind !== "rhythm";
}

function isSnoozed(item) {
  const date = toDate(item.snoozedUntil);
  return date ? date.getTime() > Date.now() : false;
}

function isOpen(item) {
  return item.status !== "done" && item.status !== "paused";
}

function isCompletedToday(item) {
  if (!item) return false;
  if (isRhythm(item) && item.lastDone === todayIso()) return true;
  return item.status === "done" && String(item.completedAt || item.updatedAt || "").slice(0, 10) === todayIso();
}

function isUserVisibleItem(item) {
  return !item.system;
}

function hasActiveVisibleItems() {
  return state.items.some((item) => isUserVisibleItem(item) && isOpen(item));
}

function currentView() {
  const active = Array.from(els.views).find((panel) => panel.classList.contains("is-active"));
  return active?.dataset.viewPanel || "now";
}

function itemProgress(item) {
  if (!item.steps.length) return 0;
  const done = item.steps.filter((step) => step.done).length;
  return Math.round((done / item.steps.length) * 100);
}

function currentTinyStep(item) {
  return firstOpenStep(item.steps) || item.nextAction || "Open this for 5 minutes";
}

function activeFocusSession() {
  if (!state.focusSession) return null;
  const item = getItem(state.focusSession.itemId);
  if (!item || !isOpen(item)) {
    state.focusSession = null;
    saveState();
    return null;
  }
  return state.focusSession;
}

function isFocusItem(item) {
  const session = activeFocusSession();
  return Boolean(session && item && session.itemId === item.id);
}

function focusDurationMinutes(item) {
  return clampNumber(item?.estimate, 5, 60, 10);
}

function sessionRemainingMs(session = activeFocusSession()) {
  if (!session) return 0;
  if (!session.running) return Math.max(0, Number(session.pausedRemainingMs || 0));
  return Math.max(0, toDate(session.endsAt).getTime() - Date.now());
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function focusSessionStateText(session = activeFocusSession()) {
  if (!session) return "Ready";
  const remaining = sessionRemainingMs(session);
  if (remaining <= 0) return "Time up";
  if (!session.running) return "Paused";
  return `${formatCountdown(remaining)} left`;
}

function scoreItem(item) {
  if (!isOpen(item) || isSnoozed(item) || !isUserVisibleItem(item)) return -9999;
  if (isCompletedToday(item)) return -9999;

  let score = 0;
  if (item.status === "now") score += 120;
  if (item.status === "red") score += 100;
  if (item.status === "active") score += 45;
  if (item.status === "inbox") score += 28;
  if (item.status === "later") score -= 20;
  if (item.status === "waiting") score -= 35;

  const dueDays = daysUntil(isRhythm(item) ? item.nextDue : item.due);
  if (dueDays !== null) {
    if (dueDays < 0) score += (isRhythm(item) ? 90 : 120) + Math.min(40, Math.abs(dueDays) * 4);
    else if (dueDays === 0) score += isRhythm(item) ? 80 : 95;
    else if (dueDays <= 2) score += isRhythm(item) ? 26 : 70;
    else if (dueDays <= 7) score += isRhythm(item) ? 4 : 35;
    else if (dueDays <= 14) score += 12;
  }

  const reviewDays = daysUntil(item.review);
  if (reviewDays !== null) {
    if (reviewDays < 0) score += 45;
    else if (reviewDays === 0) score += 30;
    else if (reviewDays <= 2) score += 12;
  }

  score += item.importance * 13;
  score += item.dread * 4;
  score += item.snoozeCount * 7;
  if (item.consequence.trim()) score += 24;
  if (item.waitingFor.trim() && reviewDays !== null && reviewDays <= 0) score += 28;
  if (!item.steps.length && !item.nextAction) score -= 8;

  const touched = toDate(item.lastTouched || item.updatedAt || item.createdAt);
  if (touched) {
    const staleDays = Math.floor((Date.now() - touched.getTime()) / 86400000);
    if (staleDays >= 14) score += 30;
    else if (staleDays >= 7) score += 16;
  }

  return score;
}

function checkinScoreAdjustment(item) {
  const checkin = normalizeDailyCheckin(state.dailyCheckin);
  let score = 0;

  if (checkin.energy === "low") {
    if (item.estimate <= 10) score += 24;
    if (isRhythm(item)) score += 18;
    if (item.dread >= 5 && item.estimate > 15) score -= 12;
  } else if (checkin.energy === "high") {
    if (item.status === "red") score += 18;
    if (item.importance >= 4) score += 16;
    if (item.estimate >= 30 && item.dread <= 3) score += 10;
  } else if (checkin.energy === "medium") {
    if (item.estimate <= 15) score += 6;
  }

  if (checkin.brain === "foggy") {
    if (item.estimate <= 10) score += 18;
    if (currentTinyStep(item).length <= 42) score += 10;
    if (item.steps.length <= 2) score += 8;
  } else if (checkin.brain === "avoiding") {
    if (item.status === "red") score += 14;
    if (item.consequence.trim()) score += 12;
    if (item.estimate <= 10) score += 16;
    score += Math.min(14, item.dread * 2);
  } else if (checkin.brain === "overloaded") {
    if (isRhythm(item)) score += 18;
    if (item.estimate <= 10) score += 22;
    if (item.status === "waiting") score += 10;
    if (item.estimate >= 30) score -= 16;
  } else if (checkin.brain === "clear") {
    if (item.importance >= 4) score += 8;
  }

  return score;
}

function checkinEffectMessages(checkin = normalizeDailyCheckin(state.dailyCheckin)) {
  const messages = [];
  const energyMessages = {
    low: "Low energy: boosts short tasks and rhythms; lowers big high-dread tasks.",
    medium: "Normal energy: gives a small boost to tasks 15 minutes or less.",
    high: "High energy: boosts red-zone, important, and longer low-dread tasks."
  };
  const brainMessages = {
    clear: "Ready: gives important tasks a small boost.",
    foggy: "Foggy: boosts short, concrete tasks with few steps.",
    avoiding: "Avoiding: boosts short, scary, consequence-heavy tasks.",
    overloaded: "Overloaded: boosts rhythms, waiting checkbacks, and very small tasks."
  };
  if (energyMessages[checkin.energy]) messages.push(energyMessages[checkin.energy]);
  if (brainMessages[checkin.brain]) messages.push(brainMessages[checkin.brain]);
  if (!messages.length) messages.push("No check-in selected: Today uses due dates, rhythms, time windows, importance, dread, snoozes, and staleness.");
  return messages;
}

function checkinSummaryText(checkin = normalizeDailyCheckin(state.dailyCheckin)) {
  const parts = [];
  const energyLabels = { low: "Low energy", medium: "Normal energy", high: "High energy" };
  const brainLabels = { clear: "Ready", foggy: "Foggy", avoiding: "Avoiding", overloaded: "Overloaded" };
  if (energyLabels[checkin.energy]) parts.push(energyLabels[checkin.energy]);
  if (brainLabels[checkin.brain]) parts.push(brainLabels[checkin.brain]);
  return parts.length ? parts.join(" / ") : "No check-in";
}

function checkinReasonsForItem(item) {
  const checkin = normalizeDailyCheckin(state.dailyCheckin);
  const reasons = [];

  if (checkin.energy === "low") {
    if (item.estimate <= 10) reasons.push("low energy: short task");
    if (isRhythm(item)) reasons.push("low energy: rhythm");
    if (item.dread >= 5 && item.estimate > 15) reasons.push("low energy: big scary task lowered");
  } else if (checkin.energy === "high") {
    if (item.status === "red") reasons.push("high energy: red zone");
    if (item.importance >= 4) reasons.push("high energy: important");
    if (item.estimate >= 30 && item.dread <= 3) reasons.push("high energy: longer low-dread task");
  } else if (checkin.energy === "medium") {
    if (item.estimate <= 15) reasons.push("normal energy: manageable");
  }

  if (checkin.brain === "foggy") {
    if (item.estimate <= 10) reasons.push("foggy: short task");
    if (currentTinyStep(item).length <= 42) reasons.push("foggy: concrete tiny start");
    if (item.steps.length <= 2) reasons.push("foggy: few steps");
  } else if (checkin.brain === "avoiding") {
    if (item.status === "red") reasons.push("avoiding: red zone");
    if (item.consequence.trim()) reasons.push("avoiding: consequence");
    if (item.estimate <= 10) reasons.push("avoiding: short task");
    if (item.dread >= 3) reasons.push("avoiding: dread");
  } else if (checkin.brain === "overloaded") {
    if (isRhythm(item)) reasons.push("overloaded: rhythm");
    if (item.estimate <= 10) reasons.push("overloaded: tiny task");
    if (item.status === "waiting") reasons.push("overloaded: waiting checkback");
    if (item.estimate >= 30) reasons.push("overloaded: long task lowered");
  } else if (checkin.brain === "clear") {
    if (item.importance >= 4) reasons.push("ready: important");
  }

  return [...new Set(reasons)];
}

function recommendationReason(item, limit = 5) {
  const reasons = [];
  const dueDays = daysUntil(isRhythm(item) ? item.nextDue : item.due);
  const reviewDays = daysUntil(item.review);
  const window = timeWindowStatus(item);

  if (isRhythm(item)) reasons.push("rhythm");
  if (item.status === "red") reasons.push("red zone");
  if (dueDays !== null) {
    if (dueDays < 0) reasons.push(`overdue ${Math.abs(dueDays)}d`);
    else if (dueDays === 0) reasons.push("due today");
    else if (dueDays <= 7) reasons.push(`due in ${dueDays}d`);
  }
  checkinReasonsForItem(item).forEach((reason) => reasons.push(reason));
  if (item.consequence.trim()) reasons.push(item.consequence.trim());
  if (item.waitingFor.trim() && reviewDays !== null && reviewDays <= 0) reasons.push("waiting checkback");
  if (window.state !== "anytime") reasons.push(window.label);
  if (item.importance >= 4) reasons.push("high importance");
  if (item.snoozeCount > 0) reasons.push(`snoozed ${item.snoozeCount}x`);
  if (!reasons.length) reasons.push(item.area);

  return [...new Set(reasons)].slice(0, limit);
}

function recommendationWhyText(item, candidateReason = "") {
  const reasons = [];
  if (candidateReason && candidateReason !== "next active") reasons.push(candidateReason);
  checkinReasonsForItem(item).forEach((reason) => {
    if (!reasons.includes(reason)) reasons.push(reason);
  });
  recommendationReason(item, 6).forEach((reason) => {
    if (!reasons.includes(reason)) reasons.push(reason);
  });
  return reasons.slice(0, 4).join(" + ") || item.area;
}

function nextCardMeta(item, reason = "") {
  const parts = [];
  if (reason && reason !== "next active") parts.push(reason);
  recommendationReason(item).forEach((entry) => {
    if (entry !== item.area && !parts.includes(entry)) parts.push(entry);
  });
  if (!parts.length) parts.push(item.area);
  return parts.slice(0, 3).join(" / ");
}

function isPlannedToday(item) {
  return item.plannedFor === todayIso();
}

function isCapturedToday(item) {
  return item.status === "inbox" && String(item.createdAt || "").slice(0, 10) === todayIso();
}

function todayCandidateReason(item) {
  const dueDays = daysUntil(isRhythm(item) ? item.nextDue : item.due);
  const reviewDays = daysUntil(item.review);
  const window = timeWindowStatus(item);
  const rhythmDueToday = isRhythm(item) && dueDays !== null && dueDays <= 0;
  if (isCompletedToday(item)) return "done today";
  if (isFocusItem(item)) return "focus running";
  if (item.status === "now") return "doing now";
  if (item.status === "red") return "red zone";
  if (isPlannedToday(item)) return "planned today";
  if (isCapturedToday(item)) return "captured today";
  if (rhythmDueToday) return dueDays < 0 ? "rhythm overdue" : "rhythm due";
  if (!isRhythm(item) && dueDays !== null && dueDays <= 0) return dueDays < 0 ? "overdue" : "due today";
  if (reviewDays !== null && reviewDays <= 0 && item.waitingFor.trim()) return "waiting checkback";
  if (reviewDays !== null && reviewDays <= 0) return "review due";
  if (window.include && (!isRhythm(item) || rhythmDueToday || item.cadence === "asneeded")) return window.state === "missed" ? `${window.label} passed` : window.label;
  return "";
}

function isTodayCandidate(item, mode = dashboardMode()) {
  if (!isOpen(item) || isSnoozed(item) || isCompletedToday(item) || !isUserVisibleItem(item) || !itemMatchesMode(item, mode)) return false;
  return Boolean(todayCandidateReason(item));
}

function isTodayDashboardItem(item, mode = dashboardMode()) {
  if (!isUserVisibleItem(item) || !itemMatchesMode(item, mode)) return false;
  if (isCompletedToday(item)) return true;
  return isTodayCandidate(item, mode);
}

function todayQueueScore(item) {
  let score = scoreItem(item);
  const dueDays = daysUntil(isRhythm(item) ? item.nextDue : item.due);
  const reviewDays = daysUntil(item.review);
  const window = timeWindowStatus(item);

  if (isFocusItem(item)) score += 260;
  score += window.boost;
  if (item.mode === "both") score += 4;
  if (isRhythm(item) && dueDays !== null && dueDays <= 0) score += 50;
  if (dueDays !== null && dueDays <= 0) score += dueDays < 0 ? 80 : 55;
  if (reviewDays !== null && reviewDays <= 0) score += item.waitingFor.trim() ? 45 : 25;
  if (isPlannedToday(item)) score += 72;
  if (window.state === "current") score += 24;
  if (window.state === "upcoming") score += 10;
  if (window.state === "missed") score += 14;
  score += checkinScoreAdjustment(item);
  return score;
}

function limitEntries(entries, limit = Infinity) {
  return Number.isFinite(limit) ? entries.slice(0, limit) : entries;
}

function todayCandidateEntries(mode = dashboardMode()) {
  return state.items
    .filter((item) => isTodayCandidate(item, mode))
    .map((item) => ({
      item,
      score: todayQueueScore(item),
      reason: todayCandidateReason(item)
    }))
    .sort((a, b) => b.score - a.score || sortDateValue(a.item).localeCompare(sortDateValue(b.item)));
}

function todayDashboardEntries(mode = dashboardMode()) {
  return state.items
    .filter((item) => isTodayDashboardItem(item, mode))
    .map((item) => ({
      item,
      score: isCompletedToday(item) ? -1 : todayQueueScore(item),
      reason: todayCandidateReason(item)
    }))
    .sort((a, b) => {
      const aDone = isCompletedToday(a.item);
      const bDone = isCompletedToday(b.item);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return b.score - a.score || sortDateValue(a.item).localeCompare(sortDateValue(b.item));
    });
}

function fallbackTodayEntries(limit = 1, mode = dashboardMode()) {
  return recommendedItems(mode)
    .slice(0, limit)
    .map((entry) => ({ ...entry, reason: "next active" }));
}

function todayQueueEntries(limit = Infinity, mode = dashboardMode()) {
  const entries = todayCandidateEntries(mode);
  if (entries.length) return limitEntries(entries, limit);
  return fallbackTodayEntries(limit, mode);
}

function recommendedItems(mode = dashboardMode()) {
  return state.items
    .filter((item) => isOpen(item) && !isSnoozed(item) && !isCompletedToday(item) && itemMatchesMode(item, mode))
    .map((item) => ({ item, score: scoreItem(item) }))
    .filter((entry) => entry.score > -9999)
    .sort((a, b) => b.score - a.score || sortDateValue(a.item).localeCompare(sortDateValue(b.item)));
}

function sortDateValue(item) {
  if (isRhythm(item)) return item.nextDue || "9999-12-31";
  return item.due || item.review || "9999-12-31";
}

function sortedItems(items) {
  return [...items].sort((a, b) => {
    const scoreDiff = scoreItem(b) - scoreItem(a);
    if (scoreDiff !== 0) return scoreDiff;
    return sortDateValue(a).localeCompare(sortDateValue(b));
  });
}

function statusLabel(statusId) {
  return STATUSES.find((status) => status.id === statusId)?.label || statusId;
}

function itemMeta(item) {
  const parts = [isRhythm(item) ? "Rhythm" : "Project", modeMeta(item.mode).label, formatTimeWindow(item), item.area, statusLabel(item.status)];
  if (isRhythm(item)) {
    parts.push(cadenceMeta(item.cadence).label);
    if (item.nextDue) parts.push(`Due ${formatDate(item.nextDue)}`);
  } else if (item.due) parts.push(`Due ${formatDate(item.due)}`);
  if (item.review) parts.push(`Review ${formatDate(item.review)}`);
  if (isSnoozed(item)) parts.push(`Snoozed ${formatDateTime(item.snoozedUntil)}`);
  return parts.join(" / ");
}

function visibleItems(items) {
  return items.filter((item) => {
    if (!isUserVisibleItem(item)) return false;
    if (!itemMatchesMode(item)) return false;
    const areaOk = state.filter.area === "all" || item.area === state.filter.area;
    const statusOk = !state.filter.status || item.status === state.filter.status;
    const kindOk = !state.filter.kind || item.kind === state.filter.kind;
    return areaOk && statusOk && kindOk;
  });
}

function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className || "secondary-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

const SNOOZE_OPTIONS = [
  { id: "15min", label: "15 min" },
  { id: "hour", label: "1 hour" },
  { id: "tonight", label: "Tonight" },
  { id: "tomorrow", label: "Tomorrow" }
];

function makeSnoozeChoices(itemId, afterSnooze = () => {}) {
  const choices = document.createElement("div");
  choices.className = "snooze-choices";
  SNOOZE_OPTIONS.forEach((option) => {
    choices.append(createButton(option.label, "secondary-button snooze-choice-button", () => {
      snoozeItem(itemId, option.id);
      afterSnooze();
    }));
  });
  return choices;
}

function makeNextDetail(label, value, variant = "") {
  const row = document.createElement("div");
  row.className = `next-detail ${variant}`.trim();
  const small = document.createElement("span");
  small.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value;
  row.append(small, strong);
  return row;
}

function nextIconText(item) {
  if (isFocusItem(item) || item.status === "now") return ">";
  if (item.status === "red") return "!";
  if (item.status === "waiting") return "...";
  if (isRhythm(item)) return "R";
  if (item.mode === "work") return "W";
  return "H";
}

function priorityPillText(item, reason) {
  if (isFocusItem(item)) return focusSessionStateText();
  if (item.status === "now") return "Doing";
  if (item.status === "red") return "Red zone";
  if (reason && reason !== "next active") return reason;
  if (isRhythm(item)) return rhythmDueLabel(item);
  return statusLabel(item.status);
}

function makeEmpty(text) {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = text;
  return empty;
}

function makeChip(text, variant = "") {
  const chip = document.createElement("span");
  chip.className = `info-chip ${variant}`.trim();
  chip.textContent = text;
  return chip;
}

function itemTone(item) {
  if (item.status === "red") return "red";
  if (item.status === "waiting") return "waiting";
  if (isRhythm(item)) return "rhythm";
  const areaTones = {
    "Work": "work",
    "Health / Medical": "health",
    "Home / Admin": "home",
    "Money": "money",
    "Writing": "writing",
    "Body / Exercise": "body",
    "Relationships": "relationships"
  };
  return areaTones[item.area] || "other";
}

function itemGlyph(item) {
  if (item.status === "red") return "!";
  if (item.status === "waiting") return "...";
  if (isRhythm(item)) return "R";
  const areaGlyphs = {
    "Work": "W",
    "Health / Medical": "+",
    "Home / Admin": "H",
    "Money": "$",
    "Writing": "P",
    "Body / Exercise": "B",
    "Relationships": "S"
  };
  return areaGlyphs[item.area] || "U";
}

function timelineBucket(entry, topItemId) {
  const item = entry.item;
  const window = timeWindowStatus(item);
  if (isCompletedToday(item)) return "done";
  if (item.id === topItemId || isFocusItem(item) || item.status === "now") return "now";
  if (window.state === "missed") return "missed";
  if (window.state === "upcoming" || window.state === "future") return "later";
  return "next";
}

function renderTodayTimeline(entries, topItemId = "") {
  if (!els.todayTimeline) return;
  els.todayTimeline.replaceChildren();
  const groups = [
    { id: "now", label: "Now" },
    { id: "next", label: "Next" },
    { id: "later", label: "Later" },
    { id: "missed", label: "Missed" },
    { id: "done", label: "Done" }
  ];
  const buckets = Object.fromEntries(groups.map((group) => [group.id, []]));
  entries.forEach((entry) => {
    buckets[timelineBucket(entry, topItemId)].push(entry);
  });

  if (!entries.length) {
    els.todayTimeline.append(makeEmpty("No timeline for this mode yet"));
    return;
  }

  groups.forEach((group) => {
    const card = document.createElement("article");
    card.className = `timeline-group timeline-${group.id}`;
    const head = document.createElement("div");
    head.className = "timeline-head";
    const title = document.createElement("strong");
    title.textContent = group.label;
    const count = document.createElement("span");
    count.textContent = String(buckets[group.id].length);
    head.append(title, count);

    const list = document.createElement("div");
    list.className = "timeline-items";
    if (buckets[group.id].length) {
      buckets[group.id].slice(0, 1).forEach((entry) => list.append(makeTimelineItem(entry)));
      if (buckets[group.id].length > 1) {
        const more = document.createElement("p");
        more.className = "timeline-more";
        more.textContent = `+${buckets[group.id].length - 1} more`;
        list.append(more);
      }
    } else {
      const empty = document.createElement("p");
      empty.className = "timeline-empty";
      empty.textContent = "Clear";
      list.append(empty);
    }
    card.append(head, list);
    els.todayTimeline.append(card);
  });
}

function makeTimelineItem(entry) {
  const item = entry.item;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `timeline-item tone-${itemTone(item)}`;
  button.addEventListener("click", () => openDetail(item.id));
  const glyph = document.createElement("span");
  glyph.className = "item-glyph";
  glyph.textContent = itemGlyph(item);
  const copy = document.createElement("span");
  copy.className = "timeline-copy";
  const title = document.createElement("strong");
  title.textContent = item.title;
  const meta = document.createElement("span");
  meta.textContent = [entry.reason, formatTimeWindow(item)].filter(Boolean).join(" / ");
  copy.append(title, meta);
  button.append(glyph, copy);
  return button;
}

function makeFocusPill(item) {
  const session = activeFocusSession();
  const pill = document.createElement("button");
  pill.type = "button";
  pill.className = "focus-pill";
  pill.addEventListener("click", openFocusDialog);

  const label = document.createElement("span");
  label.textContent = session?.running ? "Doing now" : "Doing paused";
  const time = document.createElement("strong");
  time.dataset.focusRemaining = item.id;
  time.textContent = focusSessionStateText(session);
  pill.append(label, time);
  return pill;
}

function renderFocusAnchor() {
  if (!els.focusAnchor) return;
  const session = activeFocusSession();
  const item = session ? getItem(session.itemId) : null;
  els.focusAnchor.replaceChildren();
  els.focusAnchor.hidden = !session || !item;
  if (!session || !item) return;

  const remaining = sessionRemainingMs(session);
  const durationMs = Math.max(1, Number(session.durationMinutes || 10) * 60000);
  const completePercent = Math.min(100, Math.max(0, ((durationMs - remaining) / durationMs) * 100));

  const main = document.createElement("button");
  main.type = "button";
  main.className = "focus-anchor-main";
  main.addEventListener("click", openFocusDialog);

  const label = document.createElement("span");
  label.className = "focus-anchor-label";
  label.textContent = session.running ? "Doing now" : remaining <= 0 ? "Time up" : "Paused";
  const title = document.createElement("strong");
  title.textContent = item.title;
  const step = document.createElement("span");
  step.className = "focus-anchor-step";
  step.textContent = currentTinyStep(item);
  main.append(label, title, step);

  const time = document.createElement("button");
  time.type = "button";
  time.className = "focus-anchor-time";
  time.dataset.focusRemaining = item.id;
  time.textContent = focusSessionStateText(session);
  time.addEventListener("click", openFocusDialog);

  const progress = document.createElement("div");
  progress.className = "progress-line focus-anchor-line";
  progress.setAttribute("aria-hidden", "true");
  const progressBar = document.createElement("span");
  progressBar.style.width = `${completePercent}%`;
  progress.append(progressBar);

  const actions = document.createElement("div");
  actions.className = "focus-anchor-actions";
  actions.append(
    createButton(isRhythm(item) ? "Done today" : "Done step", "primary-button small-button", completeFocusSession),
    createButton(session.running ? "Pause" : "Resume", "secondary-button small-button", pauseFocusSession),
    createButton("1 hour", "secondary-button small-button", () => snoozeFocusSession("hour")),
    createButton("+5 min", "secondary-button small-button", () => extendFocusSession(5))
  );

  els.focusAnchor.append(main, time, progress, actions);
}

function templateMode(template) {
  return template.mode || dashboardMode();
}

function renderTemplates() {
  if (!els.templateGrid) return;
  els.templateGrid.replaceChildren();
  STARTER_TEMPLATES.forEach((template) => els.templateGrid.append(makeTemplateCard(template)));
}

function templateById(id) {
  return STARTER_TEMPLATES.find((template) => template.id === id);
}

function existingTemplateItem(template) {
  if (!template) return null;
  const mode = templateMode(template);
  return state.items.find((item) => (
    item.starterTemplateId === template.id
    || (item.title === template.title && item.mode === mode && item.kind === template.kind)
  ));
}

function renderLifeRailStarter() {
  if (!els.lifeRailStarter) return;
  els.lifeRailStarter.replaceChildren();

  LIFE_RAIL_STARTERS.forEach((rail) => {
    const templates = rail.templateIds.map(templateById).filter(Boolean);
    const done = templates.every(existingTemplateItem);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `life-rail-button${done ? " is-added" : ""}`;
    const title = document.createElement("strong");
    title.textContent = rail.label;
    const copy = document.createElement("span");
    copy.textContent = done ? "Added" : templates.map((template) => template.title).join(", ");
    button.append(title, copy);
    button.addEventListener("click", () => addLifeRail(rail));
    els.lifeRailStarter.append(button);
  });

  const addThree = document.createElement("button");
  addThree.type = "button";
  addThree.className = "life-rail-button primary";
  const title = document.createElement("strong");
  title.textContent = "Add three rails";
  const copy = document.createElement("span");
  copy.textContent = "Body, house, and work anchors";
  addThree.append(title, copy);
  addThree.addEventListener("click", () => {
    LIFE_RAIL_STARTERS.forEach((rail) => addLifeRail(rail, { openDetail: false, targetMode: "home" }));
  });
  els.lifeRailStarter.append(addThree);
}

function addLifeRail(rail, options = {}) {
  const templates = rail.templateIds.map(templateById).filter(Boolean);
  let created = null;
  templates.forEach((template) => {
    if (!existingTemplateItem(template)) created = createFromTemplate(template, { openDetail: false, renderAfter: false }) || created;
  });
  if (options.targetMode && DASHBOARD_MODES.some((entry) => entry.id === options.targetMode)) {
    state.mode = options.targetMode;
  }
  saveState();
  render();
  showView("now");
  if (created && options.openDetail !== false) openDetail(created.id);
}

function makeTemplateCard(template) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "template-card";
  const title = document.createElement("strong");
  title.textContent = template.title;
  const copy = document.createElement("span");
  copy.textContent = template.description;
  const meta = document.createElement("small");
  meta.textContent = [
    template.kind === "rhythm" ? "Rhythm" : "Project",
    modeMeta(templateMode(template)).label,
    timeWindowMeta(template.timeWindow).label
  ].join(" / ");
  button.append(title, copy, meta);
  button.addEventListener("click", () => createFromTemplate(template));
  return button;
}

function createFromTemplate(template, options = {}) {
  const shouldOpenDetail = options.openDetail !== false;
  const shouldRender = options.renderAfter !== false;
  const mode = templateMode(template);
  const existing = existingTemplateItem(template);
  if (existing) {
    if (mode !== dashboardMode() && DASHBOARD_MODES.some((entry) => entry.id === mode)) state.mode = mode;
    if (shouldRender) {
      saveState();
      render();
      showView("now");
      if (shouldOpenDetail) openDetail(existing.id);
    }
    return existing;
  }
  const item = addItem({
    ...template,
    title: template.title,
    status: template.status || (template.kind === "rhythm" ? "active" : "inbox"),
    mode,
    area: template.area || (mode === "work" ? "Work" : "Unsorted"),
    starterTemplateId: template.id,
    plannedFor: "",
    review: template.review || ""
  });
  if (mode !== dashboardMode() && DASHBOARD_MODES.some((entry) => entry.id === mode)) state.mode = mode;
  if (shouldRender) {
    saveState();
    render();
    showView("now");
    if (shouldOpenDetail) openDetail(item.id);
  }
  return item;
}

function renderCheckin() {
  const checkin = normalizeDailyCheckin(state.dailyCheckin);
  if (els.checkinSummaryText) els.checkinSummaryText.textContent = checkinSummaryText(checkin);
  els.energyButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.energy === checkin.energy);
    button.setAttribute("aria-pressed", button.dataset.energy === checkin.energy ? "true" : "false");
  });
  els.brainButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.brain === checkin.brain);
    button.setAttribute("aria-pressed", button.dataset.brain === checkin.brain ? "true" : "false");
  });
  if (els.clearCheckinButton) els.clearCheckinButton.hidden = !checkin.energy && !checkin.brain;
  if (els.checkinEffect) {
    els.checkinEffect.replaceChildren();
    checkinEffectMessages(checkin).forEach((message) => {
      const line = document.createElement("p");
      line.textContent = message;
      els.checkinEffect.append(line);
    });
  }
}

function setCheckin(patch) {
  state.dailyCheckin = {
    ...normalizeDailyCheckin(state.dailyCheckin),
    date: todayIso(),
    ...patch
  };
  saveState();
  render();
}

function clearCheckin() {
  state.dailyCheckin = createDailyCheckin();
  saveState();
  render();
}

function renderRecommendation() {
  const todayEntries = todayCandidateEntries();
  const dashboardEntries = todayDashboardEntries();
  const entries = todayEntries.length ? todayEntries : fallbackTodayEntries(1);
  const [top] = entries;
  if (els.todayModeLabel) els.todayModeLabel.textContent = `${modeMeta().label} mode`;
  if (els.todayWindowLabel) {
    const current = timeWindowMeta(currentTimeWindowId());
    els.todayWindowLabel.textContent = `${current.label} window`;
  }
  els.modeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.modeOption === dashboardMode()));
  document.body.dataset.mode = dashboardMode();
  if (els.todayQueueCount) els.todayQueueCount.textContent = `${dashboardEntries.length} ${dashboardEntries.length === 1 ? "task" : "tasks"}`;
  els.recommendationPanel.replaceChildren();
  renderTodayTimeline(dashboardEntries, top?.item.id || "");
  if (els.todayQueueList) els.todayQueueList.replaceChildren();

  if (!top) {
    const panel = document.createElement("article");
    panel.className = "now-card empty-now";
    const band = document.createElement("div");
    band.className = "next-band";
    const bandLabel = document.createElement("span");
    bandLabel.textContent = "Automatic queue";
    const bandPill = document.createElement("strong");
    bandPill.textContent = modeMeta().label;
    band.append(bandLabel, bandPill);
    const body = document.createElement("div");
    body.className = "next-card-body";
    const title = document.createElement("h3");
    title.textContent = dashboardEntries.length ? "Today is clear" : "Add the first thing for today";
    const copy = document.createElement("p");
    copy.textContent = dashboardEntries.length
      ? `No ${modeMeta().label.toLowerCase()} item is asking for attention right now.`
      : `No ${modeMeta().label.toLowerCase()} item is asking for attention yet.`;
    const actions = document.createElement("div");
    actions.className = "now-actions";
    actions.append(createButton("Add item", "primary-button", () => showView("wizard")));
    body.append(title, copy, actions);
    panel.append(band, body);
    els.recommendationPanel.append(panel);
    if (els.todayQueueList) {
      if (dashboardEntries.length) renderTodayQueueList(dashboardEntries, "");
      else els.todayQueueList.append(makeEmpty("Nothing has to be done today in this mode"));
    }
    return;
  }

  const item = top.item;
  const session = isFocusItem(item) ? activeFocusSession() : null;
  const isDoing = Boolean(session || item.status === "now");
  const panel = document.createElement("article");
  panel.className = `now-card status-${item.status}${isDoing ? " is-doing" : ""}`;

  const band = document.createElement("div");
  band.className = "next-band";
  const bandLabel = document.createElement("span");
  bandLabel.textContent = isDoing ? "Doing now" : "Recommended next action";
  const bandPill = document.createElement("strong");
  bandPill.textContent = priorityPillText(item, top.reason);
  if (session) bandPill.dataset.focusRemaining = item.id;
  band.append(bandLabel, bandPill);

  const body = document.createElement("div");
  body.className = "next-card-body";

  const main = document.createElement("button");
  main.type = "button";
  main.className = "next-main";
  main.addEventListener("click", () => openDetail(item.id));
  const icon = document.createElement("span");
  icon.className = "next-icon";
  icon.textContent = nextIconText(item);
  const titleWrap = document.createElement("span");
  titleWrap.className = "next-title-wrap";
  const meta = document.createElement("span");
  meta.className = "item-meta";
  meta.textContent = nextCardMeta(item, top.reason);
  const title = document.createElement("h3");
  title.textContent = item.title;
  const openHint = document.createElement("span");
  openHint.className = "next-open-hint";
  openHint.textContent = "Open details";
  titleWrap.append(meta, title, openHint);
  main.append(icon, titleWrap);

  const doneSteps = item.steps.filter((step) => step.done).length;
  const timeText = session ? focusSessionStateText(session) : isRhythm(item)
    ? `${item.estimate} min minimum / ${cadenceMeta(item.cadence).label}${item.lastDone ? ` / last done ${formatDate(item.lastDone)}` : ""}`
    : `${item.estimate} min / ${doneSteps} of ${item.steps.length || 1} steps`;
  const whyText = recommendationWhyText(item, top.reason);
  const detailGrid = document.createElement("div");
  detailGrid.className = "next-detail-grid";
  const timeDetail = makeNextDetail("Time", timeText, "time");
  if (session) timeDetail.querySelector("strong").dataset.focusRemaining = item.id;
  detailGrid.append(
    makeNextDetail("Why", whyText, "why"),
    makeNextDetail("Tiny start", currentTinyStep(item), "tiny"),
    timeDetail
  );

  const reasonStrip = document.createElement("div");
  reasonStrip.className = "next-reason-strip";
  recommendationReason(item, 6).forEach((reason, index) => {
    reasonStrip.append(makeChip(reason, index === 0 ? "strong" : ""));
  });

  const progress = document.createElement("div");
  progress.className = "progress-line next-progress";
  progress.setAttribute("aria-hidden", "true");
  const progressBar = document.createElement("span");
  progressBar.style.width = `${itemProgress(item)}%`;
  progress.append(progressBar);

  const actions = document.createElement("div");
  actions.className = "now-actions";
  if (session) {
    actions.append(createButton(isRhythm(item) ? "Done today" : "Done step", "primary-button action-button", () => completeCurrentStep(item.id)));
    actions.append(createButton(session.running ? "Pause" : "Resume", "secondary-button action-button", pauseFocusSession));
    actions.append(createButton(isProject(item) ? "Stuck" : "Timer", "secondary-button action-button", () => {
      if (isProject(item)) openStuck(item.id);
      else openFocusDialog();
    }));
  } else if (item.status === "now") {
    actions.append(createButton(isRhythm(item) ? "Done today" : "Done step", "primary-button action-button", () => completeCurrentStep(item.id)));
    actions.append(createButton("Start timer", "secondary-button action-button", () => startFocusSession(item.id)));
    actions.append(createButton(isProject(item) ? "Stuck" : "Details", "secondary-button action-button", () => {
      if (isProject(item)) openStuck(item.id);
      else openDetail(item.id);
    }));
  } else {
    actions.append(createButton("Start doing", "primary-button action-button", () => startDoingItem(item.id)));
    actions.append(createButton("Timer", "secondary-button action-button", () => startFocusSession(item.id)));
    actions.append(createButton(isRhythm(item) ? "Done today" : "Done step", "secondary-button action-button", () => completeCurrentStep(item.id)));
    actions.append(createButton(isProject(item) ? "Stuck" : "Details", "secondary-button action-button", () => {
      if (isProject(item)) openStuck(item.id);
      else openDetail(item.id);
    }));
  }

  body.append(main, detailGrid, reasonStrip, progress);
  if (isFocusItem(item)) body.append(makeFocusPill(item));
  body.append(actions, makeSnoozeChoices(item.id));
  panel.append(band, body);
  els.recommendationPanel.append(panel);
  if (els.todayQueueList) {
    if (dashboardEntries.length) {
      renderTodayQueueList(dashboardEntries, item.id);
    } else {
      els.todayQueueList.append(makeEmpty("No must-do items today"));
    }
  }
}

function todayQueueGroup(entry, topItemId = "") {
  return timelineBucket(entry, topItemId);
}

function renderTodayQueueList(entries, topItemId = "") {
  if (!els.todayQueueList) return;
  els.todayQueueList.replaceChildren();
  const groups = [
    { id: "now", label: "Now" },
    { id: "next", label: "Next" },
    { id: "later", label: "Later" },
    { id: "missed", label: "Missed" },
    { id: "done", label: "Done" }
  ];
  const buckets = Object.fromEntries(groups.map((group) => [group.id, []]));
  entries.forEach((entry) => buckets[todayQueueGroup(entry, topItemId)].push(entry));

  let rank = 1;
  groups.forEach((group) => {
    const bucket = buckets[group.id];
    if (!bucket.length) return;
    const section = document.createElement("section");
    section.className = `today-queue-group queue-group-${group.id}`;
    const heading = document.createElement("div");
    heading.className = "today-queue-group-heading";
    const title = document.createElement("strong");
    title.textContent = group.label;
    const count = document.createElement("span");
    count.textContent = String(bucket.length);
    heading.append(title, count);
    const list = document.createElement("div");
    list.className = "today-queue-group-list";
    bucket.forEach((entry) => {
      list.append(makeTodayQueueRow(entry, rank, entry.item.id === topItemId));
      if (!isCompletedToday(entry.item)) rank += 1;
    });
    section.append(heading, list);
    els.todayQueueList.append(section);
  });
}

function makeTodayQueueRow(entry, index, isCurrent = false) {
  const item = entry.item;
  const doneToday = isCompletedToday(item);
  const row = document.createElement("article");
  row.className = `today-queue-row status-${item.status} tone-${itemTone(item)}${isCurrent ? " is-current" : ""}${doneToday ? " is-done-today" : ""}`;
  if (isCurrent) row.setAttribute("aria-current", "true");

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "queue-open";
  openButton.addEventListener("click", () => openDetail(item.id));

  const rank = document.createElement("span");
  rank.className = "queue-rank";
  rank.textContent = doneToday ? "OK" : String(index);

  const copy = document.createElement("span");
  copy.className = "queue-copy";
  const title = document.createElement("strong");
  title.textContent = item.title;
  const detail = document.createElement("span");
  detail.textContent = doneToday ? "Done today" : currentTinyStep(item);
  copy.append(title, detail);

  const meta = document.createElement("span");
  meta.className = "queue-meta";
  meta.textContent = [isCurrent ? "Next" : "", entry.reason, formatTimeWindow(item), doneToday ? "" : `${item.estimate} min`].filter(Boolean).join(" / ");

  const actions = document.createElement("div");
  actions.className = "queue-row-actions";
  if (doneToday) {
    const undoButton = document.createElement("button");
    undoButton.type = "button";
    undoButton.className = "queue-action-button queue-undo-button";
    undoButton.textContent = "Undo";
    undoButton.setAttribute("aria-label", `Undo completion for ${item.title}`);
    undoButton.addEventListener("click", () => undoCompleteItem(item.id));
    actions.append(undoButton);
  } else {
    const doingButton = document.createElement("button");
    doingButton.type = "button";
    doingButton.className = "queue-action-button queue-doing-button";
    doingButton.textContent = item.status === "now" ? "Doing" : "Do";
    doingButton.disabled = item.status === "now";
    doingButton.setAttribute("aria-label", `Make ${item.title} the Doing item`);
    doingButton.addEventListener("click", () => startDoingItem(item.id));

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.className = "queue-action-button queue-done-button";
    doneButton.textContent = "Done";
    doneButton.setAttribute("aria-label", `Mark ${item.title} done`);
    doneButton.addEventListener("click", () => completeItem(item.id));
    actions.append(doingButton, doneButton);
  }

  openButton.append(rank, copy, meta);
  row.append(openButton, actions);
  return row;
}

function makeMiniItem(item) {
  const row = document.createElement("article");
  row.className = `mini-item status-${item.status}`;
  const title = document.createElement("h3");
  title.textContent = item.title;
  const meta = document.createElement("p");
  meta.textContent = `${item.area} / ${currentTinyStep(item)}`;
  const actions = document.createElement("div");
  actions.className = "mini-actions";
  actions.append(
    createButton("Now", "mini-button", () => updateItem(item.id, { status: "now", snoozedUntil: "" })),
    createButton("Edit", "mini-button", () => openEdit(item.id))
  );
  row.append(title, meta, actions);
  return row;
}

function renderMiniList(container, items, emptyText) {
  if (!container) return;
  container.replaceChildren();
  if (!items.length) {
    container.append(makeEmpty(emptyText));
    return;
  }
  items.forEach((item) => container.append(makeMiniItem(item)));
}

function rhythmDueDays(item) {
  const dueDays = daysUntil(item.nextDue);
  return dueDays === null ? 9999 : dueDays;
}

function rhythmStatus(item) {
  if (isSnoozed(item)) return "snoozed";
  if (item.lastDone === todayIso()) return "done";
  if (item.status === "red") return "late";
  if (item.status === "now") return "due";
  const dueDays = rhythmDueDays(item);
  if (dueDays < 0) return "late";
  if (dueDays === 0) return "due";
  if (dueDays === 9999) return "asneeded";
  return "upcoming";
}

function rhythmDueLabel(item) {
  if (isSnoozed(item)) return `snoozed until ${formatDateTime(item.snoozedUntil)}`;
  const dueDays = rhythmDueDays(item);
  if (item.lastDone === todayIso()) return "done today";
  if (dueDays === 9999) return "as needed";
  if (dueDays < 0) return `${Math.abs(dueDays)}d overdue`;
  if (dueDays === 0) return "due today";
  if (dueDays === 1) return "due tomorrow";
  return `due in ${dueDays}d`;
}

function rhythmBadgeText(item) {
  if (isSnoozed(item)) return "snoozed";
  const dueDays = rhythmDueDays(item);
  if (item.lastDone === todayIso()) return "ok";
  if (dueDays < 0) return "late";
  if (dueDays === 0) return "due";
  if (dueDays === 9999) return "as needed";
  return `${dueDays}d`;
}

function visibleRhythms() {
  return sortedItems(state.items.filter((item) => (
    isRhythm(item)
    && isUserVisibleItem(item)
    && isOpen(item)
    && itemMatchesMode(item)
  )));
}

function rhythmsDue(limit = 5) {
  return visibleRhythms()
    .filter((item) => ["late", "due"].includes(rhythmStatus(item)))
    .slice(0, limit);
}

function renderRhythmsDue() {
  if (!els.rhythmDueList) return;
  renderRhythmDashboard();
}

function renderRhythmDashboard() {
  const rhythms = visibleRhythms();
  const due = rhythms.filter((item) => ["late", "due"].includes(rhythmStatus(item)));
  const upcoming = rhythms.filter((item) => ["upcoming", "asneeded"].includes(rhythmStatus(item))).slice(0, 6);
  const all = rhythms;

  if (els.rhythmLateCount) els.rhythmLateCount.textContent = String(rhythms.filter((item) => rhythmStatus(item) === "late").length);
  if (els.rhythmDueCount) els.rhythmDueCount.textContent = String(rhythms.filter((item) => rhythmStatus(item) === "due").length);
  if (els.rhythmDoneCount) els.rhythmDoneCount.textContent = String(rhythms.filter((item) => rhythmStatus(item) === "done").length);
  if (els.rhythmTotalCount) els.rhythmTotalCount.textContent = String(rhythms.length);

  renderRhythmList(els.rhythmDueList, due, "Nothing due in this mode", false);
  renderRhythmList(els.rhythmUpcomingList, upcoming, "Nothing coming up", true);
  renderRhythmList(els.rhythmAllList, all, "No rhythms yet", true);
}

function renderRhythmList(container, items, emptyText, compact = false) {
  if (!container) return;
  container.replaceChildren();
  if (!items.length) {
    container.append(makeEmpty(emptyText));
    return;
  }
  items.forEach((item) => container.append(makeRhythmCard(item, compact)));
}

function makeRhythmCard(item, compact = false) {
  const card = document.createElement("article");
  card.className = `rhythm-card rhythm-${rhythmStatus(item)} status-${item.status}${compact ? " is-compact" : ""}`;

  const top = document.createElement("div");
  top.className = "rhythm-card-top";
  const copy = document.createElement("div");
  const meta = document.createElement("p");
  meta.className = "item-meta";
  meta.textContent = [
    cadenceMeta(item.cadence).label,
    rhythmDueLabel(item),
    item.lastDone ? `last ${formatDate(item.lastDone)}` : ""
  ].filter(Boolean).join(" / ");
  const title = document.createElement("h3");
  title.textContent = item.title;
  copy.append(meta, title);
  const badge = document.createElement("span");
  badge.className = "count-badge";
  badge.textContent = rhythmBadgeText(item);
  top.append(copy, badge);

  const minimum = document.createElement("div");
  minimum.className = "tiny-start compact";
  const minimumLabel = document.createElement("span");
  minimumLabel.textContent = "Minimum";
  const minimumText = document.createElement("strong");
  minimumText.textContent = item.minimum || currentTinyStep(item);
  minimum.append(minimumLabel, minimumText);

  const actions = document.createElement("div");
  actions.className = "rhythm-actions";
  actions.append(
    createButton("Done", "primary-button", () => completeRhythm(item.id)),
    createButton("Make now", "secondary-button", () => {
      startDoingItem(item.id);
      showView("now");
    }),
    createButton("Tomorrow", "secondary-button", () => snoozeItem(item.id, "tomorrow")),
    createButton("Edit", "ghost-button", () => openEdit(item.id))
  );

  card.append(top, minimum, actions);
  return card;
}

function makeItemCard(item) {
  const node = els.itemCardTemplate.content.firstElementChild.cloneNode(true);
  node.classList.add(`status-${item.status}`);
  node.querySelector(".item-meta").textContent = itemMeta(item);
  node.querySelector(".item-title").textContent = item.title;
  node.querySelector(".progress-line span").style.width = `${itemProgress(item)}%`;
  node.querySelector(".edit-button").addEventListener("click", () => openEdit(item.id));

  const priorityRow = node.querySelector(".priority-row");
  recommendationReason(item).forEach((reason, index) => priorityRow.append(makeChip(reason, index === 0 ? "strong" : "")));
  priorityRow.append(makeChip(`${item.estimate} min`));
  priorityRow.append(makeChip(`I${item.importance}`));
  priorityRow.append(makeChip(`D${item.dread}`));

  const nextBox = node.querySelector(".next-step-box");
  nextBox.textContent = currentTinyStep(item);

  const stepList = node.querySelector(".step-list");
  if (item.steps.length) {
    item.steps.slice(0, 6).forEach((step) => {
      const li = document.createElement("li");
      li.className = `step-item${step.done ? " is-done" : ""}`;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = step.done;
      checkbox.setAttribute("aria-label", `Complete ${step.text}`);
      checkbox.addEventListener("change", () => updateStep(item.id, step.id, { done: checkbox.checked }));
      const span = document.createElement("span");
      span.className = "step-text";
      span.textContent = step.text;
      li.append(checkbox, span);
      stepList.append(li);
    });
  } else {
    stepList.append(makeEmpty("Needs a tiny step"));
  }

  const actions = node.querySelector(".item-actions");
  actions.append(
    createButton("Now", "status-button", () => updateItem(item.id, { status: "now", snoozedUntil: "" })),
    createButton("Red", "status-button red-button", () => updateItem(item.id, { status: "red", snoozedUntil: "" })),
    createButton("Wait", "status-button wait-button", () => updateItem(item.id, { status: "waiting" })),
    createButton("Later", "status-button", () => updateItem(item.id, { status: "later" })),
    createButton("Done", "status-button done-button", () => completeItem(item.id)),
    createButton("Stuck", "status-button", () => openStuck(item.id))
  );

  return node;
}

function renderStats() {
  const count = (status) => state.items.filter((item) => isUserVisibleItem(item) && itemMatchesMode(item) && item.status === status).length;
  els.redCount.textContent = count("red");
  els.inboxCount.textContent = count("inbox");
  els.waitingCount.textContent = count("waiting");
  els.activeCount.textContent = count("active") + count("now");
}

function renderProjects() {
  els.projectList.replaceChildren();
  const items = visibleItems(sortedItems(state.items));
  if (!items.length) {
    els.projectList.append(makeEmpty("Nothing in this view"));
    return;
  }
  items.forEach((item) => els.projectList.append(makeItemCard(item)));
}

function renderAreaFilter() {
  const current = state.filter.area || "all";
  els.areaFilter.replaceChildren(new Option("All areas", "all"));
  AREAS.forEach((area) => els.areaFilter.append(new Option(area, area)));
  els.areaFilter.value = AREAS.includes(current) || current === "all" ? current : "all";
}

function renderStatusFilters() {
  els.statusFilters.replaceChildren();
  const statuses = [{ id: "", label: "All" }, ...STATUSES];
  statuses.forEach((status) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${state.filter.status === status.id ? " is-active" : ""}`;
    button.textContent = status.label;
    button.addEventListener("click", () => {
      state.filter.status = status.id;
      saveState();
      render();
    });
    els.statusFilters.append(button);
  });
}

function renderMap() {
  const svg = els.mindMap;
  svg.replaceChildren();

  const activeItems = state.items.filter((item) => isOpen(item) && isUserVisibleItem(item) && itemMatchesMode(item));
  const areaCounts = AREAS.map((area) => {
    const items = activeItems.filter((item) => item.area === area);
    return {
      area,
      count: items.length,
      red: items.filter((item) => item.status === "red").length,
      score: items.reduce((sum, item) => sum + Math.max(0, scoreItem(item)), 0)
    };
  }).filter((entry) => entry.count > 0 || entry.area === "Unsorted");

  const center = { x: 550, y: 380 };
  const radiusX = 390;
  const radiusY = 250;
  const nodes = areaCounts.map((entry, index) => {
    const angle = (Math.PI * 2 * index) / areaCounts.length - Math.PI / 2;
    return {
      ...entry,
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY,
      nodeW: 190,
      nodeH: 78
    };
  });

  nodes.forEach((entry) => createSvgLine(svg, center.x, center.y, entry.x, entry.y));
  createMapNode(svg, center.x - 130, center.y - 44, 260, 88, "Life", `${activeItems.length} open`, "center", () => {
    state.filter.area = "all";
    state.filter.status = "";
    saveState();
    render();
    showView("projects");
  });

  nodes.forEach((entry) => {
    createMapNode(
      svg,
      entry.x - entry.nodeW / 2,
      entry.y - entry.nodeH / 2,
      entry.nodeW,
      entry.nodeH,
      entry.area,
      `${entry.count} open / ${entry.red} red`,
      entry.red ? "urgent" : "",
      () => {
        state.filter.area = entry.area;
        state.filter.status = "";
        saveState();
        render();
        showView("projects");
      }
    );
  });

  const focusItems = recommendedItems().slice(0, 4).map((entry) => entry.item);
  renderMiniList(els.mapFocus, focusItems, "No active map items");
}

function createSvgLine(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("class", "map-line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  svg.append(line);
}

function createMapNode(svg, x, y, width, height, label, subtext, className, onClick) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", `map-node ${className}`.trim());
  group.setAttribute("tabindex", "0");
  group.setAttribute("role", "button");
  group.setAttribute("aria-label", `${label}, ${subtext}`);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("rx", 8);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x + width / 2);
  text.setAttribute("y", y + 31);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "21");
  text.textContent = truncate(label, 19);

  const small = document.createElementNS("http://www.w3.org/2000/svg", "text");
  small.setAttribute("class", "subtext");
  small.setAttribute("x", x + width / 2);
  small.setAttribute("y", y + 58);
  small.setAttribute("text-anchor", "middle");
  small.textContent = subtext;

  group.append(rect, text, small);
  group.addEventListener("click", onClick);
  group.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  });
  svg.append(group);
}

function truncate(text, length) {
  return text.length > length ? `${text.slice(0, length - 3)}...` : text;
}

function reviewItems() {
  return sortedItems(state.items.filter((item) => {
    if (!isOpen(item) || !isUserVisibleItem(item) || !itemMatchesMode(item)) return false;
    const dueDays = daysUntil(isRhythm(item) ? item.nextDue : item.due);
    const reviewDays = daysUntil(item.review);
    const touched = toDate(item.lastTouched || item.updatedAt || item.createdAt);
    const stale = touched ? (Date.now() - touched.getTime()) / 86400000 >= 7 : false;
    return item.status === "red" || dueDays !== null && dueDays <= 7 || reviewDays !== null && reviewDays <= 0 || stale;
  })).slice(0, 8);
}

function renderReview() {
  renderMiniList(els.reviewList, reviewItems(), "No review items");
}

function renderRecurring() {
  if (!els.recurringList) return;
  els.recurringList.replaceChildren();
  const rhythms = sortedItems(state.items.filter((item) => isRhythm(item) && isUserVisibleItem(item) && itemMatchesMode(item)));
  if (!rhythms.length) {
    els.recurringList.append(makeEmpty("No rhythm items"));
    return;
  }

  rhythms.forEach((item) => {
    const card = document.createElement("article");
    card.className = "recurring-card";
    const top = document.createElement("div");
    top.className = "recurring-top";
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = [
      cadenceMeta(item.cadence).label,
      rhythmDueLabel(item),
      item.trigger || "No trigger",
      item.minimum || "No minimum"
    ].join(" / ");
    copy.append(title, detail);
    const badge = document.createElement("span");
    badge.className = "count-badge";
    badge.textContent = rhythmBadgeText(item);
    top.append(copy, badge);

    const actions = document.createElement("div");
    actions.className = "recurring-actions";
    actions.append(
      createButton(item.lastDone === todayIso() ? "Done today" : "Mark done", "mini-button", () => {
        markRhythmDone(item);
        saveState();
        render();
      }),
      createButton("Make now", "mini-button", () => {
        updateItem(item.id, { status: "now", snoozedUntil: "" });
        showView("now");
      }),
      createButton("Edit", "mini-button", () => openEdit(item.id))
    );
    card.append(top, actions);
    els.recurringList.append(card);
  });
}

function populateSelect(select, options, selected) {
  select.replaceChildren();
  options.forEach((option) => {
    if (typeof option === "string") select.append(new Option(option, option, false, option === selected));
    else select.append(new Option(option.label, option.id, false, option.id === selected));
  });
}

function populateFormSelects() {
  populateSelect(els.editKind, ITEM_KINDS, "project");
  populateSelect(els.editArea, AREAS, "Unsorted");
  populateSelect(els.editStatus, STATUSES, "inbox");
  populateSelect(els.editMode, MODES, "home");
  populateSelect(els.editTimeWindow, TIME_WINDOWS, "anytime");
  populateSelect(els.editCadence, CADENCES, "weekly");
  populateSelect(els.editImportance, [1, 2, 3, 4, 5].map((n) => ({ id: String(n), label: String(n) })), "3");
  populateSelect(els.editDread, [1, 2, 3, 4, 5].map((n) => ({ id: String(n), label: String(n) })), "3");
  populateSelect(els.editEstimate, ESTIMATES.map((n) => ({ id: String(n), label: `${n} min` })), "10");
}

function captureLooseThing(title) {
  if (!title) return;
  const tinyStart = suggestedTinyStart(title, "project");
  return addItem({
    title,
    status: "inbox",
    area: dashboardMode() === "work" ? "Work" : "Unsorted",
    mode: dashboardMode(),
    nextAction: tinyStart,
    steps: [tinyStart],
    plannedFor: "",
    review: ""
  });
}

function renderCaptureFollowups() {
  [els.quickCaptureFollowup, els.addCaptureFollowup].forEach((panel) => {
    if (!panel) return;
    panel.replaceChildren();
    const item = getItem(captureFollowupItemId);
    panel.hidden = !item;
    if (!item) return;

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Tiny start";
    const title = document.createElement("h3");
    title.textContent = item.title;
    const copy = document.createElement("p");
    copy.textContent = "Make this easier to start later.";

    const form = document.createElement("form");
    form.className = "capture-followup-form";
    const label = document.createElement("label");
    label.className = "sr-only";
    label.setAttribute("for", `${panel.id}Input`);
    label.textContent = "Tiny start";
    const input = document.createElement("input");
    input.id = `${panel.id}Input`;
    input.value = currentTinyStep(item);
    input.autocomplete = "off";
    const actions = document.createElement("div");
    actions.className = "capture-followup-actions";
    actions.append(
      createButton("Save tiny start", "primary-button small-button", () => saveCaptureTinyStart(item.id, input.value)),
      createButton("Skip", "secondary-button small-button", dismissCaptureFollowup)
    );
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveCaptureTinyStart(item.id, input.value);
    });
    form.append(label, input, actions);
    panel.append(eyebrow, title, copy, form);
  });
}

function saveCaptureTinyStart(itemId, text) {
  const item = getItem(itemId);
  if (!item) return;
  const tinyStart = text.trim() || currentTinyStep(item) || suggestedTinyStart(item.title, item.kind);
  const steps = item.steps.length
    ? item.steps.map((step, index) => (index === 0 ? { ...step, text: tinyStart } : step))
    : [{ id: cryptoId(), text: tinyStart, done: false }];
  updateItem(itemId, {
    nextAction: tinyStart,
    steps
  });
  captureFollowupItemId = "";
  renderCaptureFollowups();
}

function dismissCaptureFollowup() {
  captureFollowupItemId = "";
  renderCaptureFollowups();
}

function voiceSupport() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function voiceTarget(target) {
  if (target === "add") return { input: els.addCaptureInput, status: els.addVoiceStatus };
  return { input: els.quickCaptureInput, status: els.quickVoiceStatus };
}

function setVoiceStatus(target, message) {
  const { status } = voiceTarget(target);
  if (status) status.textContent = message || "";
}

function startVoiceCapture(target = "quick") {
  const Recognition = voiceSupport();
  const { input } = voiceTarget(target);
  if (!input) return;
  if (!Recognition) {
    setVoiceStatus(target, "Voice capture is not supported in this browser.");
    return;
  }

  if (voiceRecognition) {
    voiceRecognition.stop();
    voiceRecognition = null;
  }

  const recognition = new Recognition();
  voiceRecognition = recognition;
  recognition.lang = navigator.language || "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  setVoiceStatus(target, "Listening. Review the words before tapping Add.");

  recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();
    if (!transcript) return;
    input.value = [input.value.trim(), transcript].filter(Boolean).join(" ");
    input.focus();
    setVoiceStatus(target, "Dictation added. Review it, then tap Add.");
  });

  recognition.addEventListener("error", (event) => {
    const reason = event.error === "not-allowed" ? "Microphone permission was blocked." : "Voice capture stopped before it heard anything.";
    setVoiceStatus(target, reason);
  });

  recognition.addEventListener("end", () => {
    if (voiceRecognition === recognition) voiceRecognition = null;
  });

  try {
    recognition.start();
  } catch {
    setVoiceStatus(target, "Voice capture could not start in this browser.");
    voiceRecognition = null;
  }
}

function quickCapture(event) {
  event.preventDefault();
  const title = els.quickCaptureInput.value.trim();
  const item = captureLooseThing(title);
  if (!item) return;
  captureFollowupItemId = item.id;
  els.quickCaptureInput.value = "";
  renderCaptureFollowups();
}

function addCapture(event) {
  event.preventDefault();
  const title = els.addCaptureInput.value.trim();
  const item = captureLooseThing(title);
  if (!item) return;
  captureFollowupItemId = item.id;
  els.addCaptureInput.value = "";
  renderCaptureFollowups();
}

function splitBrainDump(text) {
  return String(text || "")
    .split(/\r?\n|;|(?:\.\s+)/)
    .map((entry) => entry.replace(/^[-*0-9.)\s]+/, "").trim())
    .filter((entry) => entry.length >= 3)
    .slice(0, 20);
}

function inferBrainKind(text) {
  const lower = text.toLowerCase();
  if (/\b(daily|weekly|monthly|every|each|routine|habit|always)\b/.test(lower)) return "rhythm";
  if (/\b(overdue|late|urgent|scary|avoid|avoiding|panic|rescue|red)\b/.test(lower)) return "rescue";
  if (/\b(maybe|someday|later|eventually|idea)\b/.test(lower)) return "later";
  return "project";
}

function suggestedTinyStart(text, kind) {
  const lower = text.toLowerCase();
  if (kind === "rhythm") return `Do the smallest version of ${text}`;
  if (kind === "rescue") return "Open this for 5 minutes";
  if (lower.includes("call")) return "Find the phone number";
  if (lower.includes("email") || lower.includes("message")) return "Open a blank message";
  if (lower.includes("clean")) return "Clear one visible surface";
  if (lower.includes("write")) return "Open the document";
  if (lower.includes("pay")) return "Open the bill or account";
  return "Define the next visible action";
}

function extractBrainDump() {
  const lines = splitBrainDump(els.brainDumpInput.value);
  brainDumpCandidates = lines.map((text) => {
    const kind = inferBrainKind(text);
    return {
      id: cryptoId(),
      selected: true,
      title: text,
      kind,
      tiny: suggestedTinyStart(text, kind)
    };
  });
  renderBrainDumpCandidates();
}

function updateBrainCandidate(id, patch) {
  brainDumpCandidates = brainDumpCandidates.map((candidate) => {
    if (candidate.id !== id) return candidate;
    const next = { ...candidate, ...patch };
    if (patch.kind && !patch.tiny) next.tiny = suggestedTinyStart(next.title, next.kind);
    return next;
  });
  renderBrainDumpCandidates();
}

function renderBrainDumpCandidates() {
  if (!els.brainCandidateList) return;
  els.brainCandidateList.replaceChildren();
  if (els.saveBrainDumpButton) els.saveBrainDumpButton.hidden = !brainDumpCandidates.length;
  if (!brainDumpCandidates.length) {
    els.brainCandidateList.append(makeEmpty("Paste a few thoughts, then tap Find tasks"));
    return;
  }

  brainDumpCandidates.forEach((candidate) => {
    const row = document.createElement("article");
    row.className = "brain-candidate";

    const keep = document.createElement("input");
    keep.type = "checkbox";
    keep.checked = candidate.selected;
    keep.addEventListener("change", () => updateBrainCandidate(candidate.id, { selected: keep.checked }));

    const title = document.createElement("input");
    title.value = candidate.title;
    title.addEventListener("change", () => updateBrainCandidate(candidate.id, {
      title: title.value.trim() || candidate.title,
      tiny: suggestedTinyStart(title.value.trim() || candidate.title, candidate.kind)
    }));

    const kind = document.createElement("select");
    [
      { id: "project", label: "Project" },
      { id: "rhythm", label: "Rhythm" },
      { id: "rescue", label: "Rescue" },
      { id: "later", label: "Later" }
    ].forEach((option) => kind.append(new Option(option.label, option.id, false, option.id === candidate.kind)));
    kind.addEventListener("change", () => updateBrainCandidate(candidate.id, { kind: kind.value }));

    const tiny = document.createElement("input");
    tiny.value = candidate.tiny;
    tiny.addEventListener("change", () => updateBrainCandidate(candidate.id, { tiny: tiny.value.trim() || candidate.tiny }));

    const remove = createButton("x", "icon-button small", () => {
      brainDumpCandidates = brainDumpCandidates.filter((entry) => entry.id !== candidate.id);
      renderBrainDumpCandidates();
    });

    row.append(keep, title, kind, tiny, remove);
    els.brainCandidateList.append(row);
  });
}

function saveBrainDumpCandidates() {
  const selected = brainDumpCandidates.filter((candidate) => candidate.selected && candidate.title.trim());
  selected.forEach((candidate) => {
    const kind = candidate.kind === "rhythm" ? "rhythm" : "project";
    const status = candidate.kind === "rescue" ? "red" : candidate.kind === "later" ? "later" : kind === "rhythm" ? "active" : "active";
    addItem({
      title: candidate.title.trim(),
      kind,
      status,
      mode: dashboardMode(),
      area: dashboardMode() === "work" ? "Work" : "Unsorted",
      cadence: kind === "rhythm" ? "weekly" : "",
      nextDue: kind === "rhythm" ? todayIso() : "",
      timeWindow: "anytime",
      nextAction: candidate.tiny.trim() || suggestedTinyStart(candidate.title, candidate.kind),
      minimum: kind === "rhythm" ? candidate.tiny.trim() || suggestedTinyStart(candidate.title, candidate.kind) : "",
      consequence: candidate.kind === "rescue" ? "Rescue this before it grows" : "",
      estimate: candidate.kind === "rescue" ? 10 : 15,
      importance: candidate.kind === "rescue" ? 5 : 3,
      dread: candidate.kind === "rescue" ? 5 : 3,
      steps: [candidate.tiny.trim() || suggestedTinyStart(candidate.title, candidate.kind)]
    });
  });
  brainDumpCandidates = [];
  if (els.brainDumpInput) els.brainDumpInput.value = "";
  renderBrainDumpCandidates();
  showView("now");
}

function openDetail(itemId) {
  const item = getItem(itemId);
  if (!item || !els.detailDialog) return;
  renderDetail(item);
  if (!els.detailDialog.open) els.detailDialog.showModal();
}

function renderDetail(item) {
  els.detailMeta.textContent = itemMeta(item);
  els.detailTitle.textContent = item.title;
  els.detailBody.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "detail-summary";
  const reasonRow = document.createElement("div");
  reasonRow.className = "reason-row";
  recommendationReason(item).forEach((reason, index) => reasonRow.append(makeChip(reason, index === 0 ? "strong" : "")));
  reasonRow.append(makeChip(`${item.estimate} min`));

  const tiny = document.createElement("div");
  tiny.className = "tiny-start";
  const tinyLabel = document.createElement("span");
  tinyLabel.textContent = isRhythm(item) ? "Minimum" : "Tiny start";
  const tinyText = document.createElement("strong");
  tinyText.textContent = currentTinyStep(item);
  tiny.append(tinyLabel, tinyText);

  const progress = document.createElement("div");
  progress.className = "progress-line";
  progress.setAttribute("aria-hidden", "true");
  const progressBar = document.createElement("span");
  progressBar.style.width = `${itemProgress(item)}%`;
  progress.append(progressBar);
  if (isRhythm(item)) {
    const ladder = document.createElement("div");
    ladder.className = "rhythm-ladder";
    [
      ["Minimum", item.minimum],
      ["Good", item.rhythmGood],
      ["Full", item.rhythmFull]
    ].filter((entry) => entry[1]).forEach(([label, value]) => {
      const row = document.createElement("p");
      const key = document.createElement("span");
      key.textContent = label;
      const text = document.createElement("strong");
      text.textContent = value;
      row.append(key, text);
      ladder.append(row);
    });
    summary.append(reasonRow);
    if (ladder.childElementCount) summary.append(ladder);
    else summary.append(tiny);
    summary.append(progress);
  } else {
    summary.append(reasonRow, tiny, progress);
  }
  if (isFocusItem(item)) summary.append(makeFocusPill(item));

  const steps = document.createElement("div");
  steps.className = "detail-steps";
  const stepTitle = document.createElement("h3");
  stepTitle.textContent = isRhythm(item) ? "Rhythm steps" : "Project steps";
  const list = document.createElement("div");
  list.className = "detail-step-list";
  if (item.steps.length) {
    item.steps.forEach((step) => {
      const label = document.createElement("label");
      label.className = `detail-step-row${step.done ? " is-done" : ""}`;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = step.done;
      checkbox.addEventListener("change", () => {
        updateStep(item.id, step.id, { done: checkbox.checked });
        const updated = getItem(item.id);
        if (updated && els.detailDialog.open) renderDetail(updated);
      });
      const text = document.createElement("span");
      text.textContent = step.text;
      label.append(checkbox, text);
      list.append(label);
    });
  } else {
    list.append(makeEmpty("No steps yet"));
  }
  steps.append(stepTitle, list);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  actions.append(createButton(isFocusItem(item) ? "Resume timer" : item.status === "now" ? "Doing" : "Start doing", "primary-button", () => {
    els.detailDialog.close();
    if (isFocusItem(item)) openFocusDialog();
    else startDoingItem(item.id);
  }));
  if (!isFocusItem(item)) {
    actions.append(createButton("Timer", "secondary-button", () => {
      els.detailDialog.close();
      startFocusSession(item.id);
    }));
  }
  actions.append(createButton(isRhythm(item) ? "Done today" : "Done step", "secondary-button", () => {
    completeCurrentStep(item.id);
    els.detailDialog.close();
  }));
  if (isProject(item)) {
    actions.append(
      createButton("Stuck", "secondary-button", () => {
        els.detailDialog.close();
        openStuck(item.id);
      }),
      createButton("Break down", "secondary-button", () => {
        addBreakdown(item.id);
        const updated = getItem(item.id);
        if (updated) renderDetail(updated);
      })
    );
  }
  actions.append(createButton("Edit", "ghost-button", () => {
    els.detailDialog.close();
    openEdit(item.id);
  }));

  els.detailBody.append(summary, steps, actions, makeSnoozeChoices(item.id, () => {
    if (els.detailDialog.open) els.detailDialog.close();
  }));
}

function openEdit(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  els.editItemId.value = item.id;
  els.editDialogTitle.textContent = item.title;
  els.editTitle.value = item.title;
  els.editKind.value = item.kind;
  els.editArea.value = item.area;
  els.editStatus.value = item.status;
  els.editMode.value = item.mode || "home";
  els.editTimeWindow.value = item.timeWindow || "anytime";
  els.editExactTime.value = item.exactTime || "";
  els.editDue.value = item.due;
  els.editReview.value = item.review;
  els.editImportance.value = String(item.importance);
  els.editDread.value = String(item.dread);
  els.editEstimate.value = String(item.estimate);
  els.editWaitingFor.value = item.waitingFor;
  els.editCadence.value = item.cadence || "weekly";
  els.editLastDone.value = item.lastDone || "";
  els.editNextDue.value = item.nextDue || "";
  els.editTrigger.value = item.trigger || "";
  els.editMinimum.value = item.minimum || "";
  els.editRhythmGood.value = item.rhythmGood || "";
  els.editRhythmFull.value = item.rhythmFull || "";
  els.editNextAction.value = item.nextAction;
  els.editConsequence.value = item.consequence;
  els.editNotes.value = item.notes;
  els.editStepInput.value = "";
  renderEditSteps(item);
  els.itemDialog.showModal();
}

function renderEditSteps(item) {
  els.editStepsList.replaceChildren();
  if (!item.steps.length) {
    els.editStepsList.append(makeEmpty("No steps yet"));
    return;
  }

  item.steps.forEach((step) => {
    const row = document.createElement("div");
    row.className = "edit-step-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = step.done;
    checkbox.addEventListener("change", () => updateStep(item.id, step.id, { done: checkbox.checked }));
    const input = document.createElement("input");
    input.value = step.text;
    input.addEventListener("change", () => updateStep(item.id, step.id, { text: input.value.trim() || step.text }));
    const remove = createButton("x", "icon-button small", () => removeStep(item.id, step.id));
    row.append(checkbox, input, remove);
    els.editStepsList.append(row);
  });
}

function saveEdit(event) {
  event.preventDefault();
  const id = els.editItemId.value;
  if (!id) return;
  updateItem(id, {
    kind: normalizeKind(els.editKind.value),
    title: els.editTitle.value.trim() || "Untitled",
    area: els.editArea.value,
    status: els.editStatus.value,
    mode: els.editMode.value,
    timeWindow: els.editTimeWindow.value,
    exactTime: els.editTimeWindow.value === "exact" ? els.editExactTime.value : "",
    due: els.editDue.value,
    review: els.editReview.value,
    cadence: normalizeKind(els.editKind.value) === "rhythm" ? els.editCadence.value : "",
    lastDone: normalizeKind(els.editKind.value) === "rhythm" ? els.editLastDone.value : "",
    trigger: normalizeKind(els.editKind.value) === "rhythm" ? els.editTrigger.value.trim() : "",
    minimum: normalizeKind(els.editKind.value) === "rhythm" ? els.editMinimum.value.trim() || els.editNextAction.value.trim() : "",
    rhythmGood: normalizeKind(els.editKind.value) === "rhythm" ? els.editRhythmGood.value.trim() : "",
    rhythmFull: normalizeKind(els.editKind.value) === "rhythm" ? els.editRhythmFull.value.trim() : "",
    nextDue: normalizeKind(els.editKind.value) === "rhythm"
      ? els.editNextDue.value || nextRhythmDue(els.editLastDone.value || getItem(id)?.lastDone || "", els.editCadence.value)
      : "",
    importance: Number(els.editImportance.value),
    dread: Number(els.editDread.value),
    estimate: Number(els.editEstimate.value),
    waitingFor: els.editWaitingFor.value.trim(),
    nextAction: els.editNextAction.value.trim() || (normalizeKind(els.editKind.value) === "rhythm" ? els.editMinimum.value.trim() : ""),
    consequence: els.editConsequence.value.trim(),
    notes: els.editNotes.value.trim()
  });
  els.itemDialog.close();
}

function addBreakdown(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  const existing = item.steps.map((step) => step.text.toLowerCase());
  const additions = [
    "Open the place where this lives for 5 minutes",
    "Find the next missing piece",
    "Do or send one small piece",
    "Update this item"
  ].filter((text) => !existing.includes(text.toLowerCase()));
  item.steps.push(...additions.map((text) => ({ id: cryptoId(), text, done: false })));
  item.nextAction = item.nextAction || additions[0] || item.nextAction;
  if (item.status === "inbox") item.status = "active";
  item.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function snoozeItem(itemId, duration) {
  const item = getItem(itemId);
  if (!item) return;
  const snoozedUntil = {
    "15min": addMinutes(15),
    hour: addHours(1),
    tonight: nextAtHour(18),
    tomorrow: tomorrowAt(9)
  }[duration] || addHours(1);
  updateItem(itemId, {
    snoozedUntil,
    snoozeCount: item.snoozeCount + 1
  }, { touch: false });
  syncFocusTimer();
}

function startDoingItem(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  const now = new Date().toISOString();
  if (state.focusSession?.itemId === itemId) state.focusSession = null;
  updateItem(itemId, {
    status: "now",
    plannedFor: todayIso(),
    snoozedUntil: "",
    completedAt: "",
    updatedAt: now,
    lastTouched: now
  });
  syncFocusTimer();
}

function startFocusSession(itemId, minutes, options = {}) {
  const item = getItem(itemId);
  if (!item) return;
  const now = new Date();
  const durationMinutes = clampNumber(minutes, 1, 180, focusDurationMinutes(item));
  state.focusSession = {
    itemId,
    startedAt: now.toISOString(),
    endsAt: new Date(now.getTime() + durationMinutes * 60000).toISOString(),
    durationMinutes,
    running: true,
    pausedRemainingMs: 0,
    alertEnabled: state.focusSession?.alertEnabled || false,
    notifiedAt: ""
  };
  if (["inbox", "active", "later"].includes(item.status)) item.status = "now";
  item.plannedFor = todayIso();
  item.snoozedUntil = "";
  item.completedAt = "";
  item.updatedAt = now.toISOString();
  item.lastTouched = now.toISOString();
  saveState();
  render();
  syncFocusTimer();
  if (options.openTimer) openFocusDialog();
}

function clearFocusSession() {
  if (!state.focusSession) return;
  state.focusSession = null;
  saveState();
  syncFocusTimer();
}

function clearFocusForItem(itemId) {
  if (state.focusSession?.itemId === itemId) state.focusSession = null;
}

function openFocusDialog() {
  if (!activeFocusSession()) return;
  renderFocusDialog();
  if (!els.focusDialog.open) els.focusDialog.showModal();
  syncFocusTimer();
}

function updateFocusDisplays() {
  const session = activeFocusSession();
  const item = session ? getItem(session.itemId) : null;
  if (!session || !item) {
    renderFocusAnchor();
    return;
  }
  const remaining = sessionRemainingMs(session);
  const durationMs = Math.max(1, Number(session.durationMinutes || 10) * 60000);
  const completePercent = Math.min(100, Math.max(0, ((durationMs - remaining) / durationMs) * 100));
  const timeText = formatCountdown(remaining);
  const stateText = focusSessionStateText(session);

  document.querySelectorAll("[data-focus-remaining]").forEach((node) => {
    node.textContent = stateText;
  });
  renderFocusAnchor();

  if (!els.focusDialog.open) return;
  els.focusMeta.textContent = itemMeta(item);
  els.focusTitle.textContent = item.title;
  els.focusStateLabel.textContent = remaining <= 0 ? "Time is up" : session.running ? "Doing now" : "Paused";
  els.focusTime.textContent = timeText;
  els.focusProgressBar.style.width = `${completePercent}%`;
  els.focusStep.textContent = currentTinyStep(item);
  els.focusDoneButton.textContent = isRhythm(item) ? "Done today" : "Done step";
  els.focusPauseButton.textContent = session.running ? "Pause" : "Resume";
  if (els.focusSnoozeChoices) {
    els.focusSnoozeChoices.replaceChildren();
    els.focusSnoozeChoices.append(...Array.from(makeSnoozeChoices(item.id, () => {
      if (els.focusDialog.open) els.focusDialog.close();
    }).children));
  }

  const canRequestAlert = "Notification" in window;
  els.focusNotifyButton.hidden = !canRequestAlert;
  if (canRequestAlert) {
    els.focusNotifyButton.disabled = Notification.permission === "denied";
    if (Notification.permission === "granted" && session.alertEnabled) els.focusNotifyButton.textContent = "Alert on";
    else if (Notification.permission === "denied") els.focusNotifyButton.textContent = "Alerts blocked";
    else els.focusNotifyButton.textContent = "Enable alert";
  }
}

function renderFocusDialog() {
  updateFocusDisplays();
}

function syncFocusTimer() {
  window.clearInterval(focusTimerId);
  focusTimerId = 0;
  if (!activeFocusSession()) return;
  tickFocusSession();
  focusTimerId = window.setInterval(tickFocusSession, 1000);
}

function maybeSendFocusAlert(item) {
  const session = activeFocusSession();
  if (!session || !session.alertEnabled || session.notifiedAt) return;
  session.notifiedAt = new Date().toISOString();
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Focus time is up", {
      body: item ? item.title : "Check your current step"
    });
  }
  saveState();
}

function tickFocusSession() {
  const session = activeFocusSession();
  if (!session) {
    window.clearInterval(focusTimerId);
    focusTimerId = 0;
    return;
  }
  const item = getItem(session.itemId);
  const remaining = sessionRemainingMs(session);
  if (remaining <= 0 && session.running) {
    session.running = false;
    session.pausedRemainingMs = 0;
    maybeSendFocusAlert(item);
    saveState();
  }
  updateFocusDisplays();
}

function pauseFocusSession() {
  const session = activeFocusSession();
  if (!session) return;
  if (session.running) {
    session.pausedRemainingMs = sessionRemainingMs(session);
    session.running = false;
  } else {
    session.endsAt = new Date(Date.now() + Math.max(60000, session.pausedRemainingMs)).toISOString();
    session.pausedRemainingMs = 0;
    session.running = true;
    session.notifiedAt = "";
  }
  saveState();
  render();
  updateFocusDisplays();
}

function extendFocusSession(minutes = 5) {
  const session = activeFocusSession();
  if (!session) return;
  const extraMs = minutes * 60000;
  const remaining = sessionRemainingMs(session);
  session.durationMinutes += minutes;
  session.endsAt = new Date(Date.now() + remaining + extraMs).toISOString();
  session.pausedRemainingMs = 0;
  session.running = true;
  session.notifiedAt = "";
  saveState();
  syncFocusTimer();
}

function completeFocusSession() {
  const session = activeFocusSession();
  if (!session) return;
  const itemId = session.itemId;
  state.focusSession = null;
  saveState();
  completeCurrentStep(itemId);
  if (els.focusDialog.open) els.focusDialog.close();
  syncFocusTimer();
}

function snoozeFocusSession(duration = "hour") {
  const session = activeFocusSession();
  if (!session) return;
  const itemId = session.itemId;
  state.focusSession = null;
  saveState();
  snoozeItem(itemId, duration);
  if (els.focusDialog.open) els.focusDialog.close();
  syncFocusTimer();
}

async function enableFocusAlert() {
  const session = activeFocusSession();
  if (!session || !("Notification" in window)) return;
  let permission = Notification.permission;
  if (permission === "default") permission = await Notification.requestPermission();
  session.alertEnabled = permission === "granted";
  saveState();
  updateFocusDisplays();
}

function openStuck(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  stuckItemId = itemId;
  els.stuckTitle.textContent = item.title;
  els.stuckCopy.textContent = currentTinyStep(item);
  els.stuckNote.value = "";
  els.stuckDialog.showModal();
}

function saveStuckNote() {
  const item = getItem(stuckItemId);
  if (!item) return;
  const note = els.stuckNote.value.trim();
  if (!note) return;
  const stamp = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date());
  const notes = [item.notes, `${stamp}: ${note}`].filter(Boolean).join("\n");
  updateItem(item.id, { notes });
  els.stuckDialog.close();
}

function handleStuckAction(action) {
  if (!stuckItemId) return;
  if (action === "tiny") {
    const item = getItem(stuckItemId);
    if (item && item.status === "inbox") item.status = "active";
    addStep(stuckItemId, "Open this for 5 minutes");
  }
  if (action === "red") updateItem(stuckItemId, { status: "red", snoozedUntil: "" });
  if (["15min", "hour", "tonight", "tomorrow"].includes(action)) snoozeItem(stuckItemId, action);
  els.stuckDialog.close();
}

function addRecurring() {
  resetWizard("rhythm");
  showAddMode("wizard");
  showView("wizard");
}

function backupAgeText() {
  const date = toDate(state.lastBackupAt);
  if (!date) return "No backup exported from this browser yet.";
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return "Last backup: today.";
  if (days === 1) return "Last backup: yesterday.";
  return `Last backup: ${days} days ago.`;
}

function renderBackupStatus() {
  if (els.backupStatus) {
    const date = toDate(state.lastBackupAt);
    const stale = !date || Date.now() - date.getTime() > 7 * 86400000;
    els.backupStatus.className = `backup-status${stale ? " needs-backup" : ""}`;
    els.backupStatus.textContent = `${backupAgeText()} ${stale ? "This browser has no recent backup." : "Recent backup marker is saved locally."}`;
  }
  renderSyncStatus();

  const canNotify = "Notification" in window;
  if (els.rhythmAlertButton) {
    els.rhythmAlertButton.hidden = !canNotify;
    els.rhythmAlertButton.disabled = canNotify && Notification.permission === "denied";
    if (!canNotify) els.rhythmAlertButton.textContent = "Alerts unavailable";
    else if (Notification.permission === "denied") els.rhythmAlertButton.textContent = "Alerts blocked";
    else if (state.alerts?.rhythmEnabled) els.rhythmAlertButton.textContent = "Due alerts on";
    else els.rhythmAlertButton.textContent = "Enable due alerts";
  }
  if (els.alertStatus) {
    if (!canNotify) els.alertStatus.textContent = "This browser does not support notifications.";
    else if (Notification.permission === "denied") els.alertStatus.textContent = "Notifications are blocked in this browser.";
    else if (state.alerts?.rhythmEnabled) els.alertStatus.textContent = "Due rhythm alerts are on for this browser. They are gentle and rate-limited.";
    else els.alertStatus.textContent = "Alerts are optional and depend on this browser allowing notifications.";
  }
}

function setBackupFeedback(message, tone = "ok") {
  if (!els.backupFeedback) return;
  els.backupFeedback.textContent = message;
  els.backupFeedback.className = `backup-feedback ${tone}`;
}

function publicSyncConfig() {
  const config = window.LCC_SYNC_CONFIG || {};
  return {
    enabled: config.enabled === true,
    provider: config.provider || "supabase",
    supabaseUrl: String(config.supabaseUrl || "").trim(),
    supabaseAnonKey: String(config.supabaseAnonKey || "").trim(),
    supabaseJsUrl: String(config.supabaseJsUrl || SUPABASE_JS_URL).trim(),
    redirectUrl: String(config.redirectUrl || "").trim()
  };
}

function syncConfigReady(config = publicSyncConfig()) {
  return config.enabled && config.provider === "supabase" && Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

function syncStatusInfo() {
  const config = publicSyncConfig();
  const ready = syncConfigReady(config);
  if (!config.enabled) {
    return {
      badge: "Off",
      tone: "warn",
      status: "Sync is off. This browser is still the only live copy unless you export a backup.",
      copy: "Add Supabase public config in sync-config.js to enable the next login/sync step."
    };
  }
  if (!ready) {
    return {
      badge: "Config needed",
      tone: "warn",
      status: "Sync is enabled but Supabase URL or public anon key is missing.",
      copy: "Only the Supabase URL and anon key belong in the static app. Never add the service role key."
    };
  }
  if (state.sync?.userEmail) {
    return {
      badge: "Signed in",
      tone: "ok",
      status: `Signed in as ${state.sync.userEmail}. Sync stores one private Supabase JSON document.`,
      copy: state.sync.lastSyncedAt ? `Last synced ${formatDateTime(state.sync.lastSyncedAt)}.` : "No sync has run in this browser yet."
    };
  }
  return {
    badge: "Ready",
    tone: "ok",
    status: "Supabase public config is present. Send a login link, then run manual Sync now.",
    copy: "First login will ask whether to upload this browser, use the cloud copy, or stay local."
  };
}

function renderSyncStatus() {
  const info = syncStatusInfo();
  if (els.syncStatusBadge) {
    els.syncStatusBadge.textContent = info.badge;
    els.syncStatusBadge.className = `sync-badge ${info.tone}`;
  }
  if (els.syncStatus) {
    els.syncStatus.textContent = info.status;
    els.syncStatus.className = `sync-status ${info.tone}`;
  }
  if (els.syncCopy) els.syncCopy.textContent = info.copy;
  if (els.syncEmail) {
    const emailRow = els.syncEmail.closest(".sync-email-row");
    if (emailRow) emailRow.hidden = Boolean(state.sync?.userEmail);
    els.syncEmail.disabled = !syncConfigReady();
  }
  if (els.syncLoginButton) {
    els.syncLoginButton.hidden = Boolean(state.sync?.userEmail);
    els.syncLoginButton.disabled = false;
  }
  [els.syncGoogleButton, els.syncAppleButton].forEach((button) => {
    if (!button) return;
    button.hidden = Boolean(state.sync?.userEmail);
    button.disabled = false;
  });
  if (els.syncNowButton) els.syncNowButton.disabled = false;
  if (els.syncLogoutButton) {
    els.syncLogoutButton.hidden = !state.sync?.userEmail;
    els.syncLogoutButton.disabled = false;
  }
}

function setSyncFeedback(message, tone = "ok") {
  if (!els.syncFeedback) return;
  els.syncFeedback.textContent = message;
  els.syncFeedback.className = `sync-feedback ${tone}`;
}

function requireSyncReady(actionLabel) {
  const config = publicSyncConfig();
  if (!config.enabled) {
    setSyncFeedback(`${actionLabel} is blocked because sync is off. Add Supabase public config in sync-config.js first.`, "warn");
    return false;
  }
  if (!syncConfigReady(config)) {
    setSyncFeedback(`${actionLabel} is blocked because Supabase URL or anon key is missing.`, "warn");
    return false;
  }
  return true;
}

async function getSupabaseClient() {
  if (!requireSyncReady("Sync")) return null;
  if (!supabaseClientPromise) {
    const config = publicSyncConfig();
    supabaseClientPromise = import(config.supabaseJsUrl)
      .then((module) => module.createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true
        }
      }))
      .catch((error) => {
        supabaseClientPromise = null;
        throw error;
      });
  }
  return supabaseClientPromise;
}

function syncEmailValue() {
  return String(els.syncEmail?.value || "").trim();
}

function syncRedirectUrl() {
  return publicSyncConfig().redirectUrl || window.location.href.split("#")[0];
}

function syncDisplayEmail(user) {
  return user?.email || user?.user_metadata?.email || "";
}

function updateSyncSession(user, status = "signed-in") {
  const previousLastSaved = state.lastSaved || "";
  state.sync = normalizeSyncState({
    ...state.sync,
    enabled: true,
    userId: user?.id || "",
    userEmail: syncDisplayEmail(user),
    status,
    lastSessionCheckedAt: new Date().toISOString(),
    lastError: ""
  });
  saveState({ lastSaved: previousLastSaved });
  renderSyncStatus();
}

function clearSyncSession(status = "ready") {
  const previousLastSaved = state.lastSaved || "";
  state.sync = normalizeSyncState({
    ...state.sync,
    userId: "",
    userEmail: "",
    status,
    lastError: ""
  });
  saveState({ lastSaved: previousLastSaved });
  renderSyncStatus();
}

async function currentSyncUser() {
  const client = await getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  const user = data?.user || null;
  if (user) updateSyncSession(user);
  return user;
}

async function restoreSyncSession() {
  if (!syncConfigReady()) return;
  try {
    const user = await currentSyncUser();
    if (!user && state.sync?.userEmail) clearSyncSession("ready");
  } catch (error) {
    state.sync = normalizeSyncState({ ...state.sync, lastError: error.message || "Session restore failed." });
    saveState({ keepLastSaved: true });
    renderSyncStatus();
  }
}

async function syncLogin() {
  if (!requireSyncReady("Login")) return;
  const email = syncEmailValue();
  if (!email) {
    setSyncFeedback("Enter your email first, then send the login link.", "warn");
    return;
  }
  try {
    const client = await getSupabaseClient();
    if (!client) return;
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: syncRedirectUrl() }
    });
    if (error) throw error;
    setSyncFeedback("Login link sent. Open it on this same device/browser, then come back and press Sync now.", "ok");
  } catch (error) {
    setSyncFeedback(`Login failed: ${error.message || "Supabase could not send the link."}`, "warn");
  }
}

async function syncProviderLogin(provider) {
  const providerLabel = provider === "apple" ? "Apple" : "Google";
  if (!requireSyncReady(`${providerLabel} login`)) return;
  try {
    const client = await getSupabaseClient();
    if (!client) return;
    const { error } = await client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: syncRedirectUrl() }
    });
    if (error) throw error;
    setSyncFeedback(`Opening ${providerLabel} login. Return here after sign-in, then press Sync now.`, "ok");
  } catch (error) {
    setSyncFeedback(`${providerLabel} login failed: ${error.message || "Supabase could not start provider login."}`, "warn");
  }
}

async function syncLogout() {
  if (!state.sync?.userEmail && !syncConfigReady()) {
    setSyncFeedback("No cloud session is active in this browser.", "warn");
    return;
  }
  try {
    if (syncConfigReady()) {
      const client = await getSupabaseClient();
      if (client) await client.auth.signOut();
    }
  } catch {
    // Local sign-out still matters even if the remote call fails.
  }
  clearSyncSession("ready");
  setSyncFeedback("Signed out. Task data stayed in this browser.", "ok");
}

function cloudItemCount(row) {
  const items = row?.state_json?.items;
  return Array.isArray(items) ? items.length : 0;
}

function openItemCount() {
  return state.items.filter(isOpen).length;
}

function syncSummaryText(row) {
  const cloudText = row ? `${cloudItemCount(row)} cloud items, last changed ${formatDateTime(row.server_updated_at)}.` : "No cloud copy exists yet.";
  return `This browser has ${state.items.length} total items and ${openItemCount()} open items. ${cloudText}`;
}

function openSyncChoice(reason, row = null) {
  syncChoiceContext = { reason, row };
  if (els.syncChoiceMeta) els.syncChoiceMeta.textContent = reason === "conflict" ? "Sync conflict" : "First sync";
  if (els.syncChoiceTitle) {
    els.syncChoiceTitle.textContent = reason === "conflict"
      ? "Choose which copy wins"
      : "Choose what becomes the cloud copy";
  }
  if (els.syncChoiceSummary) els.syncChoiceSummary.textContent = syncSummaryText(row);
  if (els.syncChoiceCopy) {
    els.syncChoiceCopy.textContent = row
      ? "Upload this browser replaces the cloud JSON. Use cloud copy replaces this browser after normalizing the cloud data."
      : "There is no cloud copy yet. Upload this browser is the normal first step.";
  }
  if (els.syncDownloadButton) els.syncDownloadButton.disabled = !row;
  if (els.syncChoiceDialog && !els.syncChoiceDialog.open) els.syncChoiceDialog.showModal();
}

async function fetchCloudState(userId) {
  const client = await getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client
    .from("user_state")
    .select("state_json,state_version,client_updated_at,server_updated_at,last_sync_client_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

function hasLocalChangedSinceSync() {
  if (!state.sync?.lastSyncedAt) return true;
  const saved = toDate(state.lastSaved);
  const synced = toDate(state.sync.lastSyncedAt);
  if (!saved || !synced) return true;
  return saved.getTime() > synced.getTime() + 1000;
}

function hasCloudChangedSinceSync(row) {
  if (!row) return false;
  if (!state.sync?.lastSyncedServerUpdatedAt) return true;
  return row.server_updated_at !== state.sync.lastSyncedServerUpdatedAt;
}

function markSyncComplete(serverUpdatedAt, user) {
  const syncedAt = new Date().toISOString();
  state.sync = normalizeSyncState({
    ...state.sync,
    enabled: true,
    userId: user.id,
    userEmail: syncDisplayEmail(user),
    lastSyncedAt: syncedAt,
    lastSyncedServerUpdatedAt: serverUpdatedAt || "",
    lastSessionCheckedAt: syncedAt,
    status: "signed-in",
    lastError: ""
  });
  saveState({ lastSaved: syncedAt });
}

async function uploadLocalToCloud() {
  const user = await currentSyncUser();
  if (!user) {
    setSyncFeedback("Sync needs login first.", "warn");
    return;
  }
  const client = await getSupabaseClient();
  if (!client) return;
  const localSnapshot = normalizeData(cloneData(state));
  const clientUpdatedAt = state.lastSaved || new Date().toISOString();
  const { data, error } = await client
    .from("user_state")
    .upsert({
      user_id: user.id,
      state_json: localSnapshot,
      state_version: localSnapshot.version,
      client_updated_at: clientUpdatedAt,
      last_sync_client_id: state.sync.clientId
    }, { onConflict: "user_id" })
    .select("server_updated_at")
    .single();
  if (error) throw error;
  markSyncComplete(data?.server_updated_at, user);
  if (els.syncChoiceDialog?.open) els.syncChoiceDialog.close();
  render();
  setSyncFeedback("Uploaded this browser to Supabase.", "ok");
}

async function downloadCloudToLocal(row) {
  const user = await currentSyncUser();
  if (!user) {
    setSyncFeedback("Sync needs login first.", "warn");
    return;
  }
  if (!row?.state_json) {
    setSyncFeedback("No cloud copy exists yet. Upload this browser first.", "warn");
    return;
  }
  const currentClientId = state.sync?.clientId || createSyncState().clientId;
  const cloud = normalizeData(row.state_json);
  state = normalizeData({
    ...cloud,
    sync: {
      ...cloud.sync,
      clientId: currentClientId,
      enabled: true,
      userId: user.id,
      userEmail: syncDisplayEmail(user),
      lastSyncedAt: new Date().toISOString(),
      lastSyncedServerUpdatedAt: row.server_updated_at || "",
      lastSessionCheckedAt: new Date().toISOString(),
      status: "signed-in",
      lastError: ""
    }
  });
  saveState({ lastSaved: state.sync.lastSyncedAt });
  if (els.syncChoiceDialog?.open) els.syncChoiceDialog.close();
  render();
  setSyncFeedback("Downloaded the Supabase cloud copy into this browser.", "ok");
}

async function syncNow() {
  if (!requireSyncReady("Sync now")) return;
  try {
    const user = await currentSyncUser();
    if (!user) {
      setSyncFeedback("Sync now needs login first. Send the login link, open it, then try again.", "warn");
      return;
    }
    const row = await fetchCloudState(user.id);
    if (!state.sync?.lastSyncedAt) {
      openSyncChoice("first", row);
      setSyncFeedback(row ? "Choose Upload this browser or Use cloud copy before the first sync." : "No cloud copy found. Upload this browser when you are ready.", "warn");
      return;
    }
    const localChanged = hasLocalChangedSinceSync();
    const cloudChanged = hasCloudChangedSinceSync(row);
    if (localChanged && cloudChanged) {
      openSyncChoice("conflict", row);
      setSyncFeedback("Both this browser and the cloud changed. Choose which copy wins.", "warn");
      return;
    }
    if (cloudChanged && row) {
      await downloadCloudToLocal(row);
      return;
    }
    await uploadLocalToCloud();
  } catch (error) {
    setSyncFeedback(`Sync failed: ${error.message || "Supabase could not complete manual sync."}`, "warn");
  }
}

async function uploadChoice() {
  try {
    await uploadLocalToCloud();
  } catch (error) {
    setSyncFeedback(`Upload failed: ${error.message || "Supabase could not save this browser."}`, "warn");
  }
}

async function downloadChoice() {
  try {
    await downloadCloudToLocal(syncChoiceContext?.row || null);
  } catch (error) {
    setSyncFeedback(`Download failed: ${error.message || "Supabase cloud copy could not be used."}`, "warn");
  }
}

function exportData() {
  state.lastBackupAt = new Date().toISOString();
  saveState();
  const snapshot = JSON.stringify(state, null, 2);
  const blob = new Blob([snapshot], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `life-command-center-${todayIso()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  renderBackupStatus();
  setBackupFeedback("Backup exported. Keep that file somewhere you can find if this browser is lost.", "ok");
}

function importData(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const next = normalizeData(JSON.parse(String(reader.result)));
      if (!confirm("Replace this browser's local command center with the imported backup? Export first if you are unsure.")) return;
      state = next;
      saveState();
      render();
      renderBackupStatus();
      setBackupFeedback("Backup imported into this browser.", "ok");
    } catch {
      setBackupFeedback("Import failed. That file was not a valid command center backup.", "warn");
      alert("That file was not a valid command center backup.");
    }
  });
  reader.readAsText(file);
}

function rhythmAlertKey() {
  return `${todayIso()}-${dashboardMode()}-${currentTimeWindowId()}`;
}

function dueRhythmAlertItems() {
  return state.items.filter((item) => {
    if (!isRhythm(item) || !isOpen(item) || isSnoozed(item) || !itemMatchesMode(item)) return false;
    const dueDays = daysUntil(item.nextDue);
    const window = timeWindowStatus(item);
    return dueDays !== null && dueDays <= 0 && (window.state === "current" || item.timeWindow === "anytime");
  });
}

function maybeSendRhythmDueAlert() {
  if (!state.alerts?.rhythmEnabled || !("Notification" in window) || Notification.permission !== "granted") return;
  const key = rhythmAlertKey();
  if (state.alerts.rhythmNotifiedKey === key) return;
  const items = dueRhythmAlertItems();
  if (!items.length) return;
  state.alerts.rhythmNotifiedKey = key;
  const [first] = items;
  new Notification("Rhythm due now", {
    body: items.length === 1 ? first.title : `${first.title} and ${items.length - 1} more`
  });
  saveState();
}

async function enableRhythmAlerts() {
  if (!("Notification" in window)) return;
  let permission = Notification.permission;
  if (permission === "default") permission = await Notification.requestPermission();
  state.alerts = {
    ...normalizeAlertSettings(state.alerts),
    rhythmEnabled: permission === "granted"
  };
  saveState();
  renderBackupStatus();
  maybeSendRhythmDueAlert();
}

function showView(view) {
  const navView = view === "map" ? "projects" : view;
  els.navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === navView));
  els.views.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
}

function maybeOpenEmptyWizard() {
  if (hasActiveVisibleItems()) {
    emptyWizardAutoOpened = false;
    return;
  }
  if (emptyWizardAutoOpened || currentView() !== "now") return;
  emptyWizardAutoOpened = true;
  resetWizard("project");
  showAddMode("wizard");
  showView("wizard");
}

function bindEvents() {
  els.todayLabel.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date());

  els.quickCaptureForm.addEventListener("submit", quickCapture);
  els.addCaptureForm.addEventListener("submit", addCapture);
  document.querySelectorAll("[data-voice-target]").forEach((button) => {
    button.addEventListener("click", () => startVoiceCapture(button.dataset.voiceTarget));
  });
  els.extractBrainDumpButton.addEventListener("click", extractBrainDump);
  els.clearBrainDumpButton.addEventListener("click", () => {
    brainDumpCandidates = [];
    els.brainDumpInput.value = "";
    renderBrainDumpCandidates();
  });
  els.saveBrainDumpButton.addEventListener("click", saveBrainDumpCandidates);
  els.energyButtons.forEach((button) => button.addEventListener("click", () => {
    setCheckin({ energy: state.dailyCheckin?.energy === button.dataset.energy ? "" : button.dataset.energy });
  }));
  els.brainButtons.forEach((button) => button.addEventListener("click", () => {
    setCheckin({ brain: state.dailyCheckin?.brain === button.dataset.brain ? "" : button.dataset.brain });
  }));
  els.clearCheckinButton.addEventListener("click", clearCheckin);
  els.addChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showAddMode(button.dataset.addMode);
      if (addMode === "wizard") resetWizard(wizard.mode);
    });
  });
  els.resetWizardButton.addEventListener("click", () => resetWizard(wizard.mode));
  els.wizardBackButton.addEventListener("click", wizardBack);
  els.wizardSkipButton.addEventListener("click", wizardSkip);
  els.wizardNextButton.addEventListener("click", wizardNext);
  els.refreshNowButton.addEventListener("click", render);

  els.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.modeOption;
      saveState();
      render();
      showView("now");
    });
  });

  els.navButtons.forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.querySelectorAll("[data-filter-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter.status = state.filter.status === button.dataset.filterStatus ? "" : button.dataset.filterStatus;
      state.filter.area = "all";
      saveState();
      render();
      showView("projects");
    });
  });

  els.areaFilter.addEventListener("change", () => {
    state.filter.area = els.areaFilter.value;
    saveState();
    render();
  });

  els.clearFilterButton.addEventListener("click", () => {
    state.filter.area = "all";
    state.filter.status = "";
    saveState();
    render();
  });
  els.openMapButton.addEventListener("click", () => showView("map"));

  els.markReviewedButton.addEventListener("click", () => {
    state.lastReviewed = new Date().toISOString();
    saveState();
    render();
  });

  els.addRhythmButtons.forEach((button) => button.addEventListener("click", addRecurring));
  els.backupToolsButton.addEventListener("click", () => {
    renderBackupStatus();
    els.backupDialog.showModal();
  });
  els.closeBackupButton.addEventListener("click", () => els.backupDialog.close());
  els.exportButton.addEventListener("click", exportData);
  els.importButton.addEventListener("click", () => els.importFile.click());
  els.syncLoginButton.addEventListener("click", syncLogin);
  els.syncGoogleButton.addEventListener("click", () => syncProviderLogin("google"));
  els.syncAppleButton.addEventListener("click", () => syncProviderLogin("apple"));
  els.syncLogoutButton.addEventListener("click", syncLogout);
  els.syncNowButton.addEventListener("click", syncNow);
  els.closeSyncChoiceButton.addEventListener("click", () => els.syncChoiceDialog.close());
  els.syncUploadButton.addEventListener("click", uploadChoice);
  els.syncDownloadButton.addEventListener("click", downloadChoice);
  els.syncExportFirstButton.addEventListener("click", exportData);
  els.syncStayLocalButton.addEventListener("click", () => {
    if (els.syncChoiceDialog.open) els.syncChoiceDialog.close();
    setSyncFeedback("Stayed local. Nothing was uploaded or replaced.", "ok");
  });
  els.rhythmAlertButton.addEventListener("click", enableRhythmAlerts);
  els.importFile.addEventListener("change", () => {
    const [file] = els.importFile.files;
    if (file) importData(file);
    els.importFile.value = "";
  });

  els.closeEditButton.addEventListener("click", () => els.itemDialog.close());
  els.closeDetailButton.addEventListener("click", () => els.detailDialog.close());
  els.closeFocusButton.addEventListener("click", () => els.focusDialog.close());
  els.focusDoneButton.addEventListener("click", completeFocusSession);
  els.focusPauseButton.addEventListener("click", pauseFocusSession);
  els.focusAddFiveButton.addEventListener("click", () => extendFocusSession(5));
  els.focusSnoozeButton.addEventListener("click", () => snoozeFocusSession("hour"));
  els.focusNotifyButton.addEventListener("click", enableFocusAlert);
  els.editForm.addEventListener("submit", saveEdit);
  els.editStepAddButton.addEventListener("click", () => {
    const id = els.editItemId.value;
    addStep(id, els.editStepInput.value);
    const item = getItem(id);
    if (item) renderEditSteps(item);
    els.editStepInput.value = "";
  });
  els.deleteItemButton.addEventListener("click", () => {
    const id = els.editItemId.value;
    const item = getItem(id);
    if (!item) return;
    if (confirm(`Delete "${item.title}"?`)) {
      deleteItem(id);
      els.itemDialog.close();
    }
  });

  els.closeStuckButton.addEventListener("click", () => els.stuckDialog.close());
  els.saveStuckNoteButton.addEventListener("click", saveStuckNote);
  document.querySelectorAll("[data-stuck-action]").forEach((button) => {
    button.addEventListener("click", () => handleStuckAction(button.dataset.stuckAction));
  });
}

function render() {
  ensureTodayPlan();
  ensureDailyCheckin();
  renderStats();
  renderCheckin();
  renderWizard();
  showAddMode();
  renderLifeRailStarter();
  renderBrainDumpCandidates();
  renderCaptureFollowups();
  renderTemplates();
  renderRecommendation();
  renderRhythmsDue();
  renderAreaFilter();
  renderStatusFilters();
  renderProjects();
  renderMap();
  renderReview();
  renderBackupStatus();
  syncFocusTimer();
  maybeSendRhythmDueAlert();
  maybeOpenEmptyWizard();
}

populateFormSelects();
bindEvents();
render();
restoreSyncSession();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
