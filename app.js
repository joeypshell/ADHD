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
  { id: "now", label: "Now" },
  { id: "active", label: "Active" },
  { id: "waiting", label: "Waiting" },
  { id: "later", label: "Later" },
  { id: "paused", label: "Paused" },
  { id: "done", label: "Done" }
];

const ESTIMATES = [5, 10, 15, 30, 60];

const DEFAULT_DATA = {
  version: 2,
  createdAt: new Date().toISOString(),
  lastReviewed: "",
  filter: { area: "all", status: "" },
  items: [],
  recurring: [
    {
      id: cryptoId(),
      title: "Daily launch",
      cadence: "Daily",
      trigger: "Before work or messages",
      minimum: "Pick one action",
      lastDone: ""
    },
    {
      id: cryptoId(),
      title: "Shutdown",
      cadence: "Daily",
      trigger: "End of workday or evening",
      minimum: "Update the open loops",
      lastDone: ""
    },
    {
      id: cryptoId(),
      title: "Weekly reset",
      cadence: "Weekly",
      trigger: "Chosen reset day",
      minimum: "Review Red, Waiting, due dates",
      lastDone: ""
    }
  ]
};

let state = loadState();
let stuckItemId = "";

const els = {
  todayLabel: document.querySelector("#todayLabel"),
  quickCaptureForm: document.querySelector("#quickCaptureForm"),
  quickCaptureInput: document.querySelector("#quickCaptureInput"),
  recommendationPanel: document.querySelector("#recommendationPanel"),
  refreshNowButton: document.querySelector("#refreshNowButton"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  navButtons: document.querySelectorAll(".nav-button"),
  views: document.querySelectorAll("[data-view-panel]"),
  redCount: document.querySelector("#redCount"),
  inboxCount: document.querySelector("#inboxCount"),
  waitingCount: document.querySelector("#waitingCount"),
  activeCount: document.querySelector("#activeCount"),
  nextQueueList: document.querySelector("#nextQueueList"),
  redZoneList: document.querySelector("#redZoneList"),
  itemForm: document.querySelector("#itemForm"),
  clearItemFormButton: document.querySelector("#clearItemFormButton"),
  itemTitle: document.querySelector("#itemTitle"),
  itemArea: document.querySelector("#itemArea"),
  itemStatus: document.querySelector("#itemStatus"),
  itemDue: document.querySelector("#itemDue"),
  itemReview: document.querySelector("#itemReview"),
  itemImportance: document.querySelector("#itemImportance"),
  itemDread: document.querySelector("#itemDread"),
  itemEstimate: document.querySelector("#itemEstimate"),
  itemWaitingFor: document.querySelector("#itemWaitingFor"),
  itemNextAction: document.querySelector("#itemNextAction"),
  itemConsequence: document.querySelector("#itemConsequence"),
  itemSteps: document.querySelector("#itemSteps"),
  itemNotes: document.querySelector("#itemNotes"),
  projectList: document.querySelector("#projectList"),
  areaFilter: document.querySelector("#areaFilter"),
  statusFilters: document.querySelector("#statusFilters"),
  clearFilterButton: document.querySelector("#clearFilterButton"),
  mindMap: document.querySelector("#mindMap"),
  mapFocus: document.querySelector("#mapFocus"),
  reviewList: document.querySelector("#reviewList"),
  recurringList: document.querySelector("#recurringList"),
  addRecurringButton: document.querySelector("#addRecurringButton"),
  markReviewedButton: document.querySelector("#markReviewedButton"),
  itemDialog: document.querySelector("#itemDialog"),
  editForm: document.querySelector("#editForm"),
  closeEditButton: document.querySelector("#closeEditButton"),
  editDialogTitle: document.querySelector("#editDialogTitle"),
  editItemId: document.querySelector("#editItemId"),
  editTitle: document.querySelector("#editTitle"),
  editArea: document.querySelector("#editArea"),
  editStatus: document.querySelector("#editStatus"),
  editDue: document.querySelector("#editDue"),
  editReview: document.querySelector("#editReview"),
  editImportance: document.querySelector("#editImportance"),
  editDread: document.querySelector("#editDread"),
  editEstimate: document.querySelector("#editEstimate"),
  editWaitingFor: document.querySelector("#editWaitingFor"),
  editNextAction: document.querySelector("#editNextAction"),
  editConsequence: document.querySelector("#editConsequence"),
  editNotes: document.querySelector("#editNotes"),
  editStepsList: document.querySelector("#editStepsList"),
  editStepInput: document.querySelector("#editStepInput"),
  editStepAddButton: document.querySelector("#editStepAddButton"),
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
  const normalized = {
    ...cloneData(DEFAULT_DATA),
    ...data,
    version: 2,
    filter: { area: "all", status: "", ...(data.filter || {}) },
    items: Array.isArray(data.items) ? data.items : [],
    recurring: Array.isArray(data.recurring) ? data.recurring : DEFAULT_DATA.recurring
  };

  normalized.items = normalized.items.map((item) => {
    const steps = Array.isArray(item.steps)
      ? item.steps.map((step) => ({
          id: step.id || cryptoId(),
          text: String(step.text || "").trim(),
          done: Boolean(step.done)
        })).filter((step) => step.text)
      : [];

    return {
      id: item.id || cryptoId(),
      title: String(item.title || "Untitled").trim(),
      area: AREAS.includes(item.area) ? item.area : "Unsorted",
      status: normalizeStatus(item.status),
      due: item.due || "",
      review: item.review || "",
      consequence: item.consequence || "",
      nextAction: item.nextAction || firstOpenStep(steps) || "",
      importance: clampNumber(item.importance, 1, 5, 3),
      dread: clampNumber(item.dread, 1, 5, 3),
      estimate: ESTIMATES.includes(Number(item.estimate)) ? Number(item.estimate) : 10,
      waitingFor: item.waitingFor || "",
      notes: item.notes || "",
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      lastTouched: item.lastTouched || item.updatedAt || item.createdAt || "",
      snoozedUntil: item.snoozedUntil || "",
      snoozeCount: Number(item.snoozeCount || 0),
      steps
    };
  });

  normalized.recurring = normalized.recurring.map((item) => ({
    id: item.id || cryptoId(),
    title: item.title || "Recurring item",
    cadence: item.cadence || "Weekly",
    trigger: item.trigger || "",
    minimum: item.minimum || "",
    lastDone: item.lastDone || ""
  }));

  return normalized;
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
  const item = normalizeData({
    items: [{
      id: cryptoId(),
      title: input.title,
      area: input.area || "Unsorted",
      status: input.status || "inbox",
      due: input.due || "",
      review: input.review || "",
      consequence: input.consequence || "",
      nextAction: input.nextAction || "",
      importance: input.importance || 3,
      dread: input.dread || 3,
      estimate: input.estimate || 10,
      waitingFor: input.waitingFor || "",
      notes: input.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastTouched: "",
      steps: normalizeSteps(input.steps || [], input.nextAction)
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
  const step = item.steps.find((entry) => !entry.done);
  if (step) {
    step.done = true;
    if (item.status === "inbox") item.status = "active";
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
  updateItem(itemId, {
    status: "done",
    steps: item.steps.map((step) => ({ ...step, done: true }))
  });
}

function isSnoozed(item) {
  const date = toDate(item.snoozedUntil);
  return date ? date.getTime() > Date.now() : false;
}

function isOpen(item) {
  return item.status !== "done" && item.status !== "paused";
}

function itemProgress(item) {
  if (!item.steps.length) return 0;
  const done = item.steps.filter((step) => step.done).length;
  return Math.round((done / item.steps.length) * 100);
}

function currentTinyStep(item) {
  return firstOpenStep(item.steps) || item.nextAction || "Open this for 5 minutes";
}

function scoreItem(item) {
  if (!isOpen(item) || isSnoozed(item)) return -9999;

  let score = 0;
  if (item.status === "now") score += 120;
  if (item.status === "red") score += 100;
  if (item.status === "active") score += 45;
  if (item.status === "inbox") score += 28;
  if (item.status === "later") score -= 20;
  if (item.status === "waiting") score -= 35;

  const dueDays = daysUntil(item.due);
  if (dueDays !== null) {
    if (dueDays < 0) score += 120 + Math.min(40, Math.abs(dueDays) * 4);
    else if (dueDays === 0) score += 95;
    else if (dueDays <= 2) score += 70;
    else if (dueDays <= 7) score += 35;
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
  const dueDays = daysUntil(item.due);
  const reviewDays = daysUntil(item.review);

  if (item.status === "red") reasons.push("red zone");
  if (dueDays !== null) {
    if (dueDays < 0) reasons.push(`overdue ${Math.abs(dueDays)}d`);
    else if (dueDays === 0) reasons.push("due today");
    else if (dueDays <= 7) reasons.push(`due in ${dueDays}d`);
  }
  if (item.consequence.trim()) reasons.push(item.consequence.trim());
  if (item.waitingFor.trim() && reviewDays !== null && reviewDays <= 0) reasons.push("waiting checkback");
  if (item.importance >= 4) reasons.push("high importance");
  if (item.snoozeCount > 0) reasons.push(`snoozed ${item.snoozeCount}x`);
  if (!reasons.length) reasons.push(item.area);

  return reasons.slice(0, 3);
}

function recommendedItems() {
  return state.items
    .filter((item) => isOpen(item) && !isSnoozed(item))
    .map((item) => ({ item, score: scoreItem(item) }))
    .filter((entry) => entry.score > -9999)
    .sort((a, b) => b.score - a.score || sortDateValue(a.item).localeCompare(sortDateValue(b.item)));
}

function sortDateValue(item) {
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
  const parts = [item.area, statusLabel(item.status)];
  if (item.due) parts.push(`Due ${formatDate(item.due)}`);
  if (item.review) parts.push(`Review ${formatDate(item.review)}`);
  if (isSnoozed(item)) parts.push(`Snoozed ${formatDateTime(item.snoozedUntil)}`);
  return parts.join(" / ");
}

function visibleItems(items) {
  return items.filter((item) => {
    const areaOk = state.filter.area === "all" || item.area === state.filter.area;
    const statusOk = !state.filter.status || item.status === state.filter.status;
    return areaOk && statusOk;
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

function renderRecommendation() {
  const [top, ...rest] = recommendedItems();
  els.recommendationPanel.replaceChildren();

  if (!top) {
    els.nextQueueList.replaceChildren(makeEmpty("Nothing queued"));
    const panel = document.createElement("article");
    panel.className = "now-card empty-now";
    const title = document.createElement("h3");
    title.textContent = "Capture the next loose thing";
    const copy = document.createElement("p");
    copy.textContent = "No active item is asking for attention.";
    const actions = document.createElement("div");
    actions.className = "now-actions";
    actions.append(createButton("Capture", "primary-button", () => showView("capture")));
    panel.append(title, copy, actions);
    els.recommendationPanel.append(panel);
    return;
  }

  const item = top.item;
  const panel = document.createElement("article");
  panel.className = `now-card status-${item.status}`;

  const meta = document.createElement("p");
  meta.className = "item-meta";
  meta.textContent = itemMeta(item);

  const title = document.createElement("h3");
  title.textContent = item.title;

  const reasonRow = document.createElement("div");
  reasonRow.className = "reason-row";
  recommendationReason(item).forEach((reason, index) => {
    reasonRow.append(makeChip(reason, index === 0 ? "strong" : ""));
  });

  const tiny = document.createElement("div");
  tiny.className = "tiny-start";
  const tinyLabel = document.createElement("span");
  tinyLabel.textContent = "Tiny start";
  const tinyText = document.createElement("strong");
  tinyText.textContent = currentTinyStep(item);
  tiny.append(tinyLabel, tinyText);

  const progress = document.createElement("div");
  progress.className = "progress-line";
  progress.setAttribute("aria-hidden", "true");
  const progressBar = document.createElement("span");
  progressBar.style.width = `${itemProgress(item)}%`;
  progress.append(progressBar);

  const stepMeta = document.createElement("p");
  stepMeta.className = "soft-copy";
  const doneSteps = item.steps.filter((step) => step.done).length;
  stepMeta.textContent = `${item.estimate} min / ${doneSteps} of ${item.steps.length || 1} steps`;

  const actions = document.createElement("div");
  actions.className = "now-actions";
  actions.append(
    createButton("Done", "primary-button", () => completeCurrentStep(item.id)),
    createButton("Stuck", "secondary-button", () => openStuck(item.id)),
    createButton("Snooze", "secondary-button", () => snoozeItem(item.id, "hour")),
    createButton("Break down", "secondary-button", () => addBreakdown(item.id)),
    createButton("Edit", "ghost-button", () => openEdit(item.id))
  );

  panel.append(meta, title, reasonRow, tiny, progress, stepMeta, actions);
  els.recommendationPanel.append(panel);

  renderMiniList(els.nextQueueList, rest.slice(0, 4).map((entry) => entry.item), "Nothing queued");
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
  container.replaceChildren();
  if (!items.length) {
    container.append(makeEmpty(emptyText));
    return;
  }
  items.forEach((item) => container.append(makeMiniItem(item)));
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
  const count = (status) => state.items.filter((item) => item.status === status).length;
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

  const activeItems = state.items.filter((item) => isOpen(item));
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
    if (!isOpen(item)) return false;
    const dueDays = daysUntil(item.due);
    const reviewDays = daysUntil(item.review);
    const touched = toDate(item.lastTouched || item.updatedAt || item.createdAt);
    const stale = touched ? (Date.now() - touched.getTime()) / 86400000 >= 7 : false;
    return item.status === "red" || dueDays !== null && dueDays <= 7 || reviewDays !== null && reviewDays <= 0 || stale;
  })).slice(0, 8);
}

function renderReview() {
  renderMiniList(els.reviewList, reviewItems(), "No review items");
  renderRecurring();
}

function renderRecurring() {
  els.recurringList.replaceChildren();
  if (!state.recurring.length) {
    els.recurringList.append(makeEmpty("No rhythm items"));
    return;
  }

  state.recurring.forEach((item) => {
    const card = document.createElement("article");
    card.className = "recurring-card";
    const top = document.createElement("div");
    top.className = "recurring-top";
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = `${item.cadence} / ${item.trigger || "No trigger"} / ${item.minimum || "No minimum"}`;
    copy.append(title, detail);
    const badge = document.createElement("span");
    badge.className = "count-badge";
    badge.textContent = item.lastDone === todayIso() ? "ok" : "0";
    top.append(copy, badge);

    const actions = document.createElement("div");
    actions.className = "recurring-actions";
    actions.append(
      createButton(item.lastDone === todayIso() ? "Done today" : "Mark done", "mini-button", () => {
        item.lastDone = todayIso();
        saveState();
        render();
      }),
      createButton("Make now", "mini-button", () => {
        addItem({
          title: item.title,
          status: "now",
          area: "Unsorted",
          nextAction: item.minimum || "Open this for 5 minutes",
          steps: [item.minimum || "Open this for 5 minutes"]
        });
        showView("now");
      })
    );
    card.append(top, actions);
    els.recurringList.append(card);
  });
}

function renderRedZone() {
  const items = sortedItems(state.items.filter((item) => item.status === "red" && isOpen(item))).slice(0, 5);
  renderMiniList(els.redZoneList, items, "No red items");
}

function populateSelect(select, options, selected) {
  select.replaceChildren();
  options.forEach((option) => {
    if (typeof option === "string") select.append(new Option(option, option, false, option === selected));
    else select.append(new Option(option.label, option.id, false, option.id === selected));
  });
}

function populateFormSelects() {
  populateSelect(els.itemArea, AREAS, "Unsorted");
  populateSelect(els.itemStatus, STATUSES, "inbox");
  populateSelect(els.editArea, AREAS, "Unsorted");
  populateSelect(els.editStatus, STATUSES, "inbox");
  populateSelect(els.editImportance, [1, 2, 3, 4, 5].map((n) => ({ id: String(n), label: String(n) })), "3");
  populateSelect(els.editDread, [1, 2, 3, 4, 5].map((n) => ({ id: String(n), label: String(n) })), "3");
  populateSelect(els.editEstimate, ESTIMATES.map((n) => ({ id: String(n), label: `${n} min` })), "10");
}

function clearItemForm() {
  els.itemForm.reset();
  els.itemArea.value = "Unsorted";
  els.itemStatus.value = "inbox";
  els.itemImportance.value = "3";
  els.itemDread.value = "3";
  els.itemEstimate.value = "10";
}

function createItemFromForm(event) {
  event.preventDefault();
  const title = els.itemTitle.value.trim();
  if (!title) return;

  addItem({
    title,
    area: els.itemArea.value,
    status: els.itemStatus.value,
    due: els.itemDue.value,
    review: els.itemReview.value,
    importance: Number(els.itemImportance.value),
    dread: Number(els.itemDread.value),
    estimate: Number(els.itemEstimate.value),
    waitingFor: els.itemWaitingFor.value.trim(),
    nextAction: els.itemNextAction.value.trim(),
    consequence: els.itemConsequence.value.trim(),
    steps: els.itemSteps.value,
    notes: els.itemNotes.value.trim()
  });
  clearItemForm();
  showView("now");
}

function quickCapture(event) {
  event.preventDefault();
  const title = els.quickCaptureInput.value.trim();
  if (!title) return;
  addItem({ title, status: "inbox", area: "Unsorted" });
  els.quickCaptureInput.value = "";
}

function openEdit(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  els.editItemId.value = item.id;
  els.editDialogTitle.textContent = item.title;
  els.editTitle.value = item.title;
  els.editArea.value = item.area;
  els.editStatus.value = item.status;
  els.editDue.value = item.due;
  els.editReview.value = item.review;
  els.editImportance.value = String(item.importance);
  els.editDread.value = String(item.dread);
  els.editEstimate.value = String(item.estimate);
  els.editWaitingFor.value = item.waitingFor;
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
    title: els.editTitle.value.trim() || "Untitled",
    area: els.editArea.value,
    status: els.editStatus.value,
    due: els.editDue.value,
    review: els.editReview.value,
    importance: Number(els.editImportance.value),
    dread: Number(els.editDread.value),
    estimate: Number(els.editEstimate.value),
    waitingFor: els.editWaitingFor.value.trim(),
    nextAction: els.editNextAction.value.trim(),
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
  const title = prompt("Recurring item name");
  if (!title || !title.trim()) return;
  const cadence = prompt("Cadence", "Weekly") || "Weekly";
  const trigger = prompt("Trigger", "Chosen day/time") || "";
  const minimum = prompt("Minimum version", "Touch it for 5 minutes") || "";

  state.recurring.unshift({
    id: cryptoId(),
    title: title.trim(),
    cadence: cadence.trim(),
    trigger: trigger.trim(),
    minimum: minimum.trim(),
    lastDone: ""
  });
  saveState();
  render();
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
  els.navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  els.views.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
}

function bindEvents() {
  els.todayLabel.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date());

  els.quickCaptureForm.addEventListener("submit", quickCapture);
  els.itemForm.addEventListener("submit", createItemFromForm);
  els.clearItemFormButton.addEventListener("click", clearItemForm);
  els.refreshNowButton.addEventListener("click", render);

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

  els.markReviewedButton.addEventListener("click", () => {
    state.lastReviewed = new Date().toISOString();
    saveState();
    render();
  });

  els.addRecurringButton.addEventListener("click", addRecurring);
  els.exportButton.addEventListener("click", exportData);
  els.importButton.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", () => {
    const [file] = els.importFile.files;
    if (file) importData(file);
    els.importFile.value = "";
  });

  els.closeEditButton.addEventListener("click", () => els.itemDialog.close());
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
  renderStats();
  renderRecommendation();
  renderRedZone();
  renderAreaFilter();
  renderStatusFilters();
  renderProjects();
  renderMap();
  renderReview();
}

populateFormSelects();
bindEvents();
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
