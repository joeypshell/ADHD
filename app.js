const STORAGE_KEY = "life-command-center-v2";
const LEGACY_STORAGE_KEY = "life-command-center-v1";

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

const DEFAULT_RHYTHMS = [];

const STARTER_RHYTHM_TITLES = new Set([
  "weekly reset",
  "clean kitchen",
  "get gas",
  "work out",
  "monthly audit"
]);

const DEFAULT_DATA = {
  version: 5,
  createdAt: new Date().toISOString(),
  lastReviewed: "",
  mode: "home",
  filter: { area: "all", status: "" },
  todayPlan: createDailyPlan(),
  focusSession: null,
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
    steps: ["mode", "title", "context", "area", "cadence", "window", "tiny", "summary"],
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

const els = {
  todayLabel: document.querySelector("#todayLabel"),
  todayModeLabel: document.querySelector("#todayModeLabel"),
  todayWindowLabel: document.querySelector("#todayWindowLabel"),
  todayQueueList: document.querySelector("#todayQueueList"),
  modeButtons: document.querySelectorAll("[data-mode-option]"),
  quickCaptureForm: document.querySelector("#quickCaptureForm"),
  quickCaptureInput: document.querySelector("#quickCaptureInput"),
  addChoiceButtons: document.querySelectorAll("[data-add-mode]"),
  addPanels: document.querySelectorAll("[data-add-panel]"),
  addCaptureForm: document.querySelector("#addCaptureForm"),
  addCaptureInput: document.querySelector("#addCaptureInput"),
  templateGrid: document.querySelector("#templateGrid"),
  recommendationPanel: document.querySelector("#recommendationPanel"),
  refreshNowButton: document.querySelector("#refreshNowButton"),
  backupToolsButton: document.querySelector("#backupToolsButton"),
  backupDialog: document.querySelector("#backupDialog"),
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
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
    lastTouched: input.lastTouched || input.updatedAt || input.createdAt || "",
    snoozedUntil: input.snoozedUntil || "",
    snoozeCount: Number(input.snoozeCount || 0),
    steps: normalizeSteps(input.steps || [minimum], minimum)
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
    version: 5,
    mode: DASHBOARD_MODES.some((mode) => mode.id === data.mode) ? data.mode : "home",
    filter: { area: "all", status: "", kind: "", ...(data.filter || {}) },
    todayPlan: normalizeDailyPlan(data.todayPlan),
    focusSession: normalizeFocusSession(data.focusSession),
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
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    lastTouched: item.lastTouched || item.updatedAt || item.createdAt || "",
    snoozedUntil: item.snoozedUntil || "",
    snoozeCount: Number(item.snoozeCount || 0),
    steps
  };
}

function normalizeRhythmItem(item) {
  const minimum = item.minimum || item.nextAction || "Do the minimum version";
  const cadence = normalizeCadence(item.cadence || "weekly");
  const lastDone = item.lastDone || "";
  const title = String(item.title || "Recurring rhythm").trim();
  const untouchedStarter = STARTER_RHYTHM_TITLES.has(title.toLowerCase())
    && !item.lastDone
    && !item.notes
    && !item.waitingFor
    && !item.snoozeCount;
  const steps = normalizeStepObjects(item.steps);
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
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    lastTouched: item.lastTouched || item.updatedAt || item.createdAt || "",
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

function normalizeStatus(status) {
  return STATUSES.some((entry) => entry.id === status) ? status : "inbox";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (Number.isNaN(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function saveState() {
  state.lastSaved = new Date().toISOString();
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
    return {
      ...item,
      ...patch,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastTouched: "",
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
  addMode = ["capture", "template", "wizard"].includes(mode) ? mode : "capture";
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

  const minimumLabel = document.createElement("label");
  minimumLabel.className = "wizard-field";
  minimumLabel.textContent = "Minimum version";
  const minimumInput = document.createElement("input");
  minimumInput.value = wizard.data.minimum;
  minimumInput.placeholder = "Example: clear one surface for 5 minutes";
  minimumInput.addEventListener("input", () => {
    wizard.data.minimum = minimumInput.value;
    if (!wizard.data.nextAction.trim()) wizard.data.nextAction = minimumInput.value;
  });
  minimumLabel.append(minimumInput);

  panel.append(triggerLabel, minimumLabel);
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
  tinyLabel.textContent = "Tiny start";
  const tinyText = document.createElement("strong");
  tinyText.textContent = item.nextAction || firstOpenStep(item.steps) || "Open this for 5 minutes";
  tiny.append(tinyLabel, tinyText);

  const steps = document.createElement("ul");
  steps.className = "wizard-summary-steps";
  normalizeSteps(item.steps, item.nextAction).slice(0, 6).forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step.text;
    steps.append(li);
  });

  card.append(meta, title, tiny, steps);
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
  const steps = wizard.mode === "rhythm"
    ? [minimum]
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
    if (item.status === "inbox") item.status = "active";
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

function recommendationReason(item) {
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
  if (item.consequence.trim()) reasons.push(item.consequence.trim());
  if (item.waitingFor.trim() && reviewDays !== null && reviewDays <= 0) reasons.push("waiting checkback");
  if (window.state !== "anytime") reasons.push(window.label);
  if (item.importance >= 4) reasons.push("high importance");
  if (item.snoozeCount > 0) reasons.push(`snoozed ${item.snoozeCount}x`);
  if (!reasons.length) reasons.push(item.area);

  return reasons.slice(0, 3);
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

function todayCandidateReason(item) {
  const dueDays = daysUntil(isRhythm(item) ? item.nextDue : item.due);
  const reviewDays = daysUntil(item.review);
  const window = timeWindowStatus(item);
  if (isFocusItem(item)) return "focus running";
  if (item.status === "now") return "doing now";
  if (item.status === "red") return "red zone";
  if (isPlannedToday(item)) return "planned today";
  if (isRhythm(item) && dueDays !== null && dueDays <= 0) return dueDays < 0 ? "rhythm overdue" : "rhythm due";
  if (!isRhythm(item) && dueDays !== null && dueDays <= 0) return dueDays < 0 ? "overdue" : "due today";
  if (reviewDays !== null && reviewDays <= 0 && item.waitingFor.trim()) return "waiting checkback";
  if (reviewDays !== null && reviewDays <= 0) return "review due";
  if (window.include) return window.state === "missed" ? `${window.label} passed` : window.label;
  return "";
}

function isTodayCandidate(item, mode = dashboardMode()) {
  if (!isOpen(item) || isSnoozed(item) || !isUserVisibleItem(item) || !itemMatchesMode(item, mode)) return false;
  return Boolean(todayCandidateReason(item));
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
  return score;
}

function todayQueueEntries(limit = 8, mode = dashboardMode()) {
  const entries = state.items
    .filter((item) => isTodayCandidate(item, mode))
    .map((item) => ({
      item,
      score: todayQueueScore(item),
      reason: todayCandidateReason(item)
    }))
    .sort((a, b) => b.score - a.score || sortDateValue(a.item).localeCompare(sortDateValue(b.item)));

  if (entries.length) return entries.slice(0, limit);

  return recommendedItems(mode)
    .slice(0, limit)
    .map((entry) => ({ ...entry, reason: "next active" }));
}

function recommendedItems(mode = dashboardMode()) {
  return state.items
    .filter((item) => isOpen(item) && !isSnoozed(item) && itemMatchesMode(item, mode))
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

function templateMode(template) {
  return template.mode || dashboardMode();
}

function renderTemplates() {
  if (!els.templateGrid) return;
  els.templateGrid.replaceChildren();
  STARTER_TEMPLATES.forEach((template) => els.templateGrid.append(makeTemplateCard(template)));
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

function createFromTemplate(template) {
  const mode = templateMode(template);
  const item = addItem({
    ...template,
    title: template.title,
    status: template.status || (template.kind === "rhythm" ? "active" : "inbox"),
    mode,
    area: template.area || (mode === "work" ? "Work" : "Unsorted"),
    plannedFor: "",
    review: template.review || ""
  });
  if (mode !== dashboardMode() && DASHBOARD_MODES.some((entry) => entry.id === mode)) state.mode = mode;
  saveState();
  render();
  showView("now");
  openDetail(item.id);
}

function renderRecommendation() {
  const entries = todayQueueEntries(8);
  const [top] = entries;
  if (els.todayModeLabel) els.todayModeLabel.textContent = `${modeMeta().label} mode`;
  if (els.todayWindowLabel) {
    const current = timeWindowMeta(currentTimeWindowId());
    els.todayWindowLabel.textContent = `${current.label} window`;
  }
  els.modeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.modeOption === dashboardMode()));
  document.body.dataset.mode = dashboardMode();
  els.recommendationPanel.replaceChildren();
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
    title.textContent = "Add the first thing for today";
    const copy = document.createElement("p");
    copy.textContent = `No ${modeMeta().label.toLowerCase()} item is asking for attention yet.`;
    const actions = document.createElement("div");
    actions.className = "now-actions";
    actions.append(createButton("Add item", "primary-button", () => showView("wizard")));
    body.append(title, copy, actions);
    panel.append(band, body);
    els.recommendationPanel.append(panel);
    if (els.todayQueueList) els.todayQueueList.append(makeEmpty("Nothing queued for this mode"));
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
  const whyText = item.consequence.trim() || top.reason || recommendationReason(item)[0] || item.area;
  const detailGrid = document.createElement("div");
  detailGrid.className = "next-detail-grid";
  const timeDetail = makeNextDetail("Time", timeText, "time");
  if (session) timeDetail.querySelector("strong").dataset.focusRemaining = item.id;
  detailGrid.append(
    makeNextDetail("Why", whyText, "why"),
    makeNextDetail("Tiny start", currentTinyStep(item), "tiny"),
    timeDetail
  );

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
    actions.append(createButton("Snooze", "secondary-button action-button", () => snoozeFocusSession()));
    actions.append(createButton(isProject(item) ? "Stuck" : "Timer", "secondary-button action-button", () => {
      if (isProject(item)) openStuck(item.id);
      else openFocusDialog();
    }));
  } else if (item.status === "now") {
    actions.append(createButton(isRhythm(item) ? "Done today" : "Done step", "primary-button action-button", () => completeCurrentStep(item.id)));
    actions.append(createButton("Start timer", "secondary-button action-button", () => startFocusSession(item.id)));
    actions.append(createButton("Snooze", "secondary-button action-button", () => snoozeItem(item.id, "hour")));
    actions.append(createButton(isProject(item) ? "Stuck" : "Details", "secondary-button action-button", () => {
      if (isProject(item)) openStuck(item.id);
      else openDetail(item.id);
    }));
  } else {
    actions.append(createButton("Start doing", "primary-button action-button", () => startFocusSession(item.id)));
    actions.append(createButton(isRhythm(item) ? "Done today" : "Done step", "secondary-button action-button", () => completeCurrentStep(item.id)));
    actions.append(createButton("Snooze", "secondary-button action-button", () => snoozeItem(item.id, "hour")));
    actions.append(createButton(isProject(item) ? "Stuck" : "Details", "secondary-button action-button", () => {
      if (isProject(item)) openStuck(item.id);
      else openDetail(item.id);
    }));
  }

  body.append(main, detailGrid, progress);
  if (isFocusItem(item)) body.append(makeFocusPill(item));
  body.append(actions);
  panel.append(band, body);
  els.recommendationPanel.append(panel);
  if (els.todayQueueList) {
    const queue = entries.slice(1);
    if (queue.length) {
      queue.forEach((entry, index) => els.todayQueueList.append(makeTodayQueueRow(entry, index)));
    } else {
      els.todayQueueList.append(makeEmpty("Nothing else is queued"));
    }
  }
}

function makeTodayQueueRow(entry, index) {
  const item = entry.item;
  const row = document.createElement("button");
  row.type = "button";
  row.className = `today-queue-row status-${item.status}`;
  row.addEventListener("click", () => openDetail(item.id));

  const rank = document.createElement("span");
  rank.className = "queue-rank";
  rank.textContent = String(index + 1);

  const copy = document.createElement("span");
  copy.className = "queue-copy";
  const title = document.createElement("strong");
  title.textContent = item.title;
  const detail = document.createElement("span");
  detail.textContent = currentTinyStep(item);
  copy.append(title, detail);

  const meta = document.createElement("span");
  meta.className = "queue-meta";
  meta.textContent = [entry.reason, formatTimeWindow(item), `${item.estimate} min`].filter(Boolean).join(" / ");

  row.append(rank, copy, meta);
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
      updateItem(item.id, { status: "now", snoozedUntil: "", plannedFor: todayIso() });
      showView("now");
    }),
    createButton("Snooze", "secondary-button", () => snoozeItem(item.id, "tomorrow")),
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
  return addItem({
    title,
    status: "inbox",
    area: dashboardMode() === "work" ? "Work" : "Unsorted",
    mode: dashboardMode(),
    plannedFor: "",
    review: ""
  });
}

function quickCapture(event) {
  event.preventDefault();
  const title = els.quickCaptureInput.value.trim();
  if (!captureLooseThing(title)) return;
  els.quickCaptureInput.value = "";
}

function addCapture(event) {
  event.preventDefault();
  const title = els.addCaptureInput.value.trim();
  const item = captureLooseThing(title);
  if (!item) return;
  els.addCaptureInput.value = "";
  showView("now");
  openDetail(item.id);
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
  summary.append(reasonRow, tiny, progress);
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
  actions.append(createButton(isFocusItem(item) ? "Resume" : "Start", "primary-button", () => {
    els.detailDialog.close();
    if (isFocusItem(item)) openFocusDialog();
    else startFocusSession(item.id);
  }));
  actions.append(createButton(isRhythm(item) ? "Done today" : "Done step", "secondary-button", () => {
    completeCurrentStep(item.id);
    els.detailDialog.close();
  }));
  actions.append(createButton("Snooze", "secondary-button", () => {
    snoozeItem(item.id, "hour");
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

  els.detailBody.append(summary, steps, actions);
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
  const snoozedUntil = duration === "tomorrow" ? tomorrowAt(9) : addHours(1);
  updateItem(itemId, {
    snoozedUntil,
    snoozeCount: item.snoozeCount + 1
  }, { touch: false });
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
  if (!session || !item) return;
  const remaining = sessionRemainingMs(session);
  const durationMs = Math.max(1, Number(session.durationMinutes || 10) * 60000);
  const completePercent = Math.min(100, Math.max(0, ((durationMs - remaining) / durationMs) * 100));
  const timeText = formatCountdown(remaining);
  const stateText = focusSessionStateText(session);

  document.querySelectorAll("[data-focus-remaining]").forEach((node) => {
    node.textContent = stateText;
  });

  if (!els.focusDialog.open) return;
  els.focusMeta.textContent = itemMeta(item);
  els.focusTitle.textContent = item.title;
  els.focusStateLabel.textContent = remaining <= 0 ? "Time is up" : session.running ? "Doing now" : "Paused";
  els.focusTime.textContent = timeText;
  els.focusProgressBar.style.width = `${completePercent}%`;
  els.focusStep.textContent = currentTinyStep(item);
  els.focusDoneButton.textContent = isRhythm(item) ? "Done today" : "Done step";
  els.focusPauseButton.textContent = session.running ? "Pause" : "Resume";

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

function snoozeFocusSession() {
  const session = activeFocusSession();
  if (!session) return;
  const itemId = session.itemId;
  state.focusSession = null;
  saveState();
  snoozeItem(itemId, "hour");
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
  if (action === "hour") snoozeItem(stuckItemId, "hour");
  if (action === "tomorrow") snoozeItem(stuckItemId, "tomorrow");
  els.stuckDialog.close();
}

function addRecurring() {
  resetWizard("rhythm");
  showAddMode("wizard");
  showView("wizard");
}

function exportData() {
  const snapshot = JSON.stringify(state, null, 2);
  const blob = new Blob([snapshot], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `life-command-center-${todayIso()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const next = normalizeData(JSON.parse(String(reader.result)));
      if (!confirm("Replace this browser's command center with the imported backup?")) return;
      state = next;
      saveState();
      render();
    } catch {
      alert("That file was not a valid command center backup.");
    }
  });
  reader.readAsText(file);
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
  els.backupToolsButton.addEventListener("click", () => els.backupDialog.showModal());
  els.closeBackupButton.addEventListener("click", () => els.backupDialog.close());
  els.exportButton.addEventListener("click", exportData);
  els.importButton.addEventListener("click", () => els.importFile.click());
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
  els.focusSnoozeButton.addEventListener("click", snoozeFocusSession);
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
  renderStats();
  renderWizard();
  showAddMode();
  renderTemplates();
  renderRecommendation();
  renderRhythmsDue();
  renderAreaFilter();
  renderStatusFilters();
  renderProjects();
  renderMap();
  renderReview();
  syncFocusTimer();
  maybeOpenEmptyWizard();
}

populateFormSelects();
bindEvents();
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
