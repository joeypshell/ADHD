const STORAGE_KEY = "life-command-center-v1";

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
  { id: "now", label: "Today / Now" },
  { id: "active", label: "Active" },
  { id: "waiting", label: "Waiting" },
  { id: "paused", label: "Paused" },
  { id: "done", label: "Done" }
];

const STATUS_ACTIONS = [
  { id: "now", label: "Now" },
  { id: "red", label: "Red" },
  { id: "active", label: "Active" },
  { id: "waiting", label: "Waiting" },
  { id: "done", label: "Done" }
];

const DEFAULT_DATA = {
  version: 1,
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
      minimum: "Update Today / Now",
      lastDone: ""
    },
    {
      id: cryptoId(),
      title: "Weekly reset",
      cadence: "Weekly",
      trigger: "Chosen reset day",
      minimum: "Review Red, Board, Waiting",
      lastDone: ""
    },
    {
      id: cryptoId(),
      title: "Monthly audit",
      cadence: "Monthly",
      trigger: "First weekend or chosen date",
      minimum: "Check renewals, medical, money, car, home",
      lastDone: ""
    }
  ]
};

let state = loadState();

const els = {
  todayLabel: document.querySelector("#todayLabel"),
  captureForm: document.querySelector("#captureForm"),
  captureInput: document.querySelector("#captureInput"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  tabs: document.querySelectorAll(".tab-button"),
  views: document.querySelectorAll("[data-view-panel]"),
  redCount: document.querySelector("#redCount"),
  nowCount: document.querySelector("#nowCount"),
  waitingCount: document.querySelector("#waitingCount"),
  inboxCount: document.querySelector("#inboxCount"),
  redPanelCount: document.querySelector("#redPanelCount"),
  inboxPanelCount: document.querySelector("#inboxPanelCount"),
  nowList: document.querySelector("#nowList"),
  redList: document.querySelector("#redList"),
  inboxList: document.querySelector("#inboxList"),
  boardColumns: document.querySelector("#boardColumns"),
  areaFilter: document.querySelector("#areaFilter"),
  buildNowButton: document.querySelector("#buildNowButton"),
  clearFilterButton: document.querySelector("#clearFilterButton"),
  mindMap: document.querySelector("#mindMap"),
  mapFocus: document.querySelector("#mapFocus"),
  recurringList: document.querySelector("#recurringList"),
  addRecurringButton: document.querySelector("#addRecurringButton"),
  itemTemplate: document.querySelector("#itemTemplate")
};

function cryptoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return cloneData(DEFAULT_DATA);
  try {
    const parsed = JSON.parse(stored);
    return normalizeData(parsed);
  } catch {
    return cloneData(DEFAULT_DATA);
  }
}

function normalizeData(data) {
  const normalized = {
    ...cloneData(DEFAULT_DATA),
    ...data,
    filter: { area: "all", status: "", ...(data.filter || {}) },
    items: Array.isArray(data.items) ? data.items : [],
    recurring: Array.isArray(data.recurring) ? data.recurring : DEFAULT_DATA.recurring
  };

  normalized.items = normalized.items.map((item) => ({
    id: item.id || cryptoId(),
    title: item.title || "Untitled",
    area: AREAS.includes(item.area) ? item.area : "Unsorted",
    status: STATUSES.some((status) => status.id === item.status) ? item.status : "inbox",
    due: item.due || "",
    review: item.review || "",
    consequence: item.consequence || "",
    waitingFor: item.waitingFor || "",
    notes: item.notes || "",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    steps: Array.isArray(item.steps)
      ? item.steps.map((step) => ({
          id: step.id || cryptoId(),
          text: step.text || "",
          done: Boolean(step.done)
        })).filter((step) => step.text.trim())
      : []
  }));

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

function saveState() {
  state.lastSaved = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sortedItems(items) {
  return [...items].sort((a, b) => {
    const dueA = a.due || "9999-12-31";
    const dueB = b.due || "9999-12-31";
    if (dueA !== dueB) return dueA.localeCompare(dueB);
    return a.createdAt.localeCompare(b.createdAt);
  });
}

function itemProgress(item) {
  if (!item.steps.length) return 0;
  const done = item.steps.filter((step) => step.done).length;
  return Math.round((done / item.steps.length) * 100);
}

function statusLabel(statusId) {
  return STATUSES.find((status) => status.id === statusId)?.label || statusId;
}

function itemSubtitle(item) {
  const parts = [item.area, statusLabel(item.status)];
  if (item.due) parts.push(`Due ${formatDate(item.due)}`);
  if (item.review) parts.push(`Review ${formatDate(item.review)}`);
  return parts.join(" / ");
}

function visibleItems(items) {
  return items.filter((item) => {
    const areaOk = state.filter.area === "all" || item.area === state.filter.area;
    const statusOk = !state.filter.status || item.status === state.filter.status;
    return areaOk && statusOk;
  });
}

function addItem(title, status = "inbox") {
  const item = {
    id: cryptoId(),
    title: title.trim(),
    area: "Unsorted",
    status,
    due: "",
    review: "",
    consequence: "",
    waitingFor: "",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: []
  };
  state.items.unshift(item);
  saveState();
  render();
}

function updateItem(id, patch) {
  state.items = state.items.map((item) => (
    item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
  ));
  saveState();
  render();
}

function deleteItem(id) {
  state.items = state.items.filter((item) => item.id !== id);
  saveState();
  render();
}

function addStep(itemId, text) {
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item || !text.trim()) return;
  item.steps.push({ id: cryptoId(), text: text.trim(), done: false });
  item.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function updateStep(itemId, stepId, patch) {
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) return;
  item.steps = item.steps.map((step) => (step.id === stepId ? { ...step, ...patch } : step));
  item.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function removeStep(itemId, stepId) {
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) return;
  item.steps = item.steps.filter((step) => step.id !== stepId);
  item.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function makeItemCard(item) {
  const node = els.itemTemplate.content.firstElementChild.cloneNode(true);
  node.classList.add(`status-${item.status}`);
  node.querySelector(".item-meta").textContent = itemSubtitle(item);
  node.querySelector(".item-title").textContent = item.title;
  node.querySelector(".progress-line span").style.width = `${itemProgress(item)}%`;

  const moreButton = node.querySelector(".more-button");
  const editor = node.querySelector(".item-editor");
  moreButton.addEventListener("click", () => {
    editor.open = !editor.open;
  });

  const stepList = node.querySelector(".step-list");
  if (item.steps.length) {
    item.steps.forEach((step) => {
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

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "step-remove";
      remove.textContent = "x";
      remove.setAttribute("aria-label", `Remove ${step.text}`);
      remove.addEventListener("click", () => removeStep(item.id, step.id));

      li.append(checkbox, span, remove);
      stepList.append(li);
    });
  } else {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No steps yet";
    stepList.append(li);
  }

  const stepForm = node.querySelector(".step-form");
  const stepInput = stepForm.querySelector("input");
  stepForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addStep(item.id, stepInput.value);
  });

  const actions = node.querySelector(".item-actions");
  STATUS_ACTIONS.filter((action) => action.id !== item.status).forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.nextStatus = action.id;
    button.textContent = action.label;
    button.addEventListener("click", () => updateItem(item.id, { status: action.id }));
    actions.append(button);
  });

  const titleInput = node.querySelector(".edit-title");
  titleInput.value = item.title;
  titleInput.addEventListener("change", () => updateItem(item.id, { title: titleInput.value || item.title }));

  const areaSelect = node.querySelector(".edit-area");
  AREAS.forEach((area) => areaSelect.append(new Option(area, area, false, area === item.area)));
  areaSelect.addEventListener("change", () => updateItem(item.id, { area: areaSelect.value }));

  const statusSelect = node.querySelector(".edit-status");
  STATUSES.forEach((status) => statusSelect.append(new Option(status.label, status.id, false, status.id === item.status)));
  statusSelect.addEventListener("change", () => updateItem(item.id, { status: statusSelect.value }));

  const dueInput = node.querySelector(".edit-due");
  dueInput.value = item.due;
  dueInput.addEventListener("change", () => updateItem(item.id, { due: dueInput.value }));

  const reviewInput = node.querySelector(".edit-review");
  reviewInput.value = item.review;
  reviewInput.addEventListener("change", () => updateItem(item.id, { review: reviewInput.value }));

  const waitingInput = node.querySelector(".edit-waiting");
  waitingInput.value = item.waitingFor;
  waitingInput.addEventListener("change", () => updateItem(item.id, { waitingFor: waitingInput.value }));

  const consequenceInput = node.querySelector(".edit-consequence");
  consequenceInput.value = item.consequence;
  consequenceInput.addEventListener("change", () => updateItem(item.id, { consequence: consequenceInput.value }));

  const notesInput = node.querySelector(".edit-notes");
  notesInput.value = item.notes;
  notesInput.addEventListener("change", () => updateItem(item.id, { notes: notesInput.value }));

  node.querySelector(".delete-button").addEventListener("click", () => {
    if (confirm(`Delete "${item.title}"?`)) deleteItem(item.id);
  });

  return node;
}

function renderItemList(container, items, emptyText = "Nothing here") {
  container.replaceChildren();
  const filtered = visibleItems(sortedItems(items));
  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }
  filtered.forEach((item) => container.append(makeItemCard(item)));
}

function renderStats() {
  const count = (status) => state.items.filter((item) => item.status === status).length;
  els.redCount.textContent = count("red");
  els.nowCount.textContent = count("now");
  els.waitingCount.textContent = count("waiting");
  els.inboxCount.textContent = count("inbox");
  els.redPanelCount.textContent = count("red");
  els.inboxPanelCount.textContent = count("inbox");
}

function renderLaunch() {
  renderItemList(els.nowList, state.items.filter((item) => item.status === "now"), "Pick up to 3");
  renderItemList(els.redList, state.items.filter((item) => item.status === "red"), "No red items");
  renderItemList(els.inboxList, state.items.filter((item) => item.status === "inbox"), "Inbox empty");
}

function renderBoard() {
  els.boardColumns.replaceChildren();
  const visibleStatuses = ["inbox", "red", "now", "active", "waiting", "paused", "done"];

  visibleStatuses.forEach((statusId) => {
    const column = document.createElement("section");
    column.className = "board-column";

    const title = document.createElement("div");
    title.className = "board-column-title";
    const h3 = document.createElement("h3");
    h3.textContent = statusLabel(statusId);
    const count = document.createElement("span");
    count.className = "count-badge";
    count.textContent = visibleItems(state.items.filter((item) => item.status === statusId)).length;
    title.append(h3, count);

    const list = document.createElement("div");
    list.className = "board-column-list";
    renderItemList(list, state.items.filter((item) => item.status === statusId), "Empty");

    column.append(title, list);
    els.boardColumns.append(column);
  });
}

function renderAreaFilter() {
  const current = els.areaFilter.value || state.filter.area;
  els.areaFilter.replaceChildren(new Option("All areas", "all"));
  AREAS.forEach((area) => els.areaFilter.append(new Option(area, area)));
  els.areaFilter.value = AREAS.includes(current) || current === "all" ? current : "all";
}

function renderMap() {
  const svg = els.mindMap;
  svg.replaceChildren();

  const activeItems = state.items.filter((item) => item.status !== "done" && item.status !== "paused");
  const areaCounts = AREAS.map((area) => ({
    area,
    count: activeItems.filter((item) => item.area === area).length,
    red: activeItems.filter((item) => item.area === area && item.status === "red").length,
    now: activeItems.filter((item) => item.area === area && item.status === "now").length
  })).filter((entry) => entry.count > 0 || entry.area === "Unsorted");

  const center = { x: 550, y: 380 };
  const radiusX = 390;
  const radiusY = 250;
  const nodes = areaCounts.map((entry, index) => {
    const angle = (Math.PI * 2 * index) / areaCounts.length - Math.PI / 2;
    const x = center.x + Math.cos(angle) * radiusX;
    const y = center.y + Math.sin(angle) * radiusY;
    return { ...entry, x, y, nodeW: 190, nodeH: 74 };
  });

  nodes.forEach((entry) => createSvgLine(svg, center.x, center.y, entry.x, entry.y));

  createMapNode(svg, center.x - 125, center.y - 42, 250, 84, "Life Command Center", `${activeItems.length} active`, "center", () => {
    state.filter.area = "all";
    state.filter.status = "";
    saveState();
    render();
    showView("board");
  });

  nodes.forEach((entry) => {
    createMapNode(
      svg,
      entry.x - entry.nodeW / 2,
      entry.y - entry.nodeH / 2,
      entry.nodeW,
      entry.nodeH,
      entry.area,
      `${entry.count} active / ${entry.red} red / ${entry.now} now`,
      "",
      () => {
        state.filter.area = entry.area;
        state.filter.status = "";
        saveState();
        render();
        showView("board");
      }
    );
  });

  renderMapFocus();
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
  group.setAttribute("class", `map-node ${className}`);
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
  text.setAttribute("y", y + 30);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "21");
  text.textContent = truncate(label, 19);

  const small = document.createElementNS("http://www.w3.org/2000/svg", "text");
  small.setAttribute("class", "subtext");
  small.setAttribute("x", x + width / 2);
  small.setAttribute("y", y + 55);
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

function renderMapFocus() {
  const items = sortedItems(state.items.filter((item) => item.status === "red" || item.status === "now")).slice(0, 6);
  els.mapFocus.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No red or now items";
    els.mapFocus.append(empty);
    return;
  }
  items.forEach((item) => els.mapFocus.append(makeItemCard(item)));
}

function renderRecurring() {
  els.recurringList.replaceChildren();
  if (!state.recurring.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No recurring items";
    els.recurringList.append(empty);
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
    const done = document.createElement("button");
    done.type = "button";
    done.textContent = item.lastDone === todayIso() ? "Done today" : "Mark done";
    done.addEventListener("click", () => {
      item.lastDone = todayIso();
      saveState();
      render();
    });
    const makeTask = document.createElement("button");
    makeTask.type = "button";
    makeTask.textContent = "Make task";
    makeTask.addEventListener("click", () => addItem(item.title, "now"));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      if (confirm(`Remove "${item.title}"?`)) {
        state.recurring = state.recurring.filter((entry) => entry.id !== item.id);
        saveState();
        render();
      }
    });
    actions.append(done, makeTask, remove);
    card.append(top, actions);
    els.recurringList.append(card);
  });
}

function buildNow() {
  const currentNow = state.items.filter((item) => item.status === "now");
  const openSlots = Math.max(0, 3 - currentNow.length);
  if (!openSlots) return;

  const candidates = sortedItems(state.items.filter((item) => (
    item.status === "red" || item.status === "active" || item.status === "inbox"
  ))).slice(0, openSlots);

  candidates.forEach((item) => {
    item.status = "now";
    if (!item.steps.length) {
      item.steps.push({ id: cryptoId(), text: "Open this for 5 minutes", done: false });
    }
    item.updatedAt = new Date().toISOString();
  });
  saveState();
  render();
}

function addRecurring() {
  const title = prompt("Recurring item name");
  if (!title?.trim()) return;
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
      if (!confirm("Replace this browser's command center with the imported snapshot?")) return;
      state = next;
      saveState();
      render();
    } catch {
      alert("That file was not a valid command center snapshot.");
    }
  });
  reader.readAsText(file);
}

function showView(view) {
  els.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  els.views.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
}

function bindEvents() {
  els.todayLabel.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date());

  els.captureForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addItem(els.captureInput.value);
    els.captureInput.value = "";
    els.captureInput.focus();
  });

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view));
  });

  document.querySelectorAll("[data-filter-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter.status = state.filter.status === button.dataset.filterStatus ? "" : button.dataset.filterStatus;
      saveState();
      render();
      showView("board");
    });
  });

  els.areaFilter.addEventListener("change", () => {
    state.filter.area = els.areaFilter.value;
    saveState();
    render();
  });

  els.buildNowButton.addEventListener("click", buildNow);
  els.clearFilterButton.addEventListener("click", () => {
    state.filter.area = "all";
    state.filter.status = "";
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
}

function render() {
  renderAreaFilter();
  els.areaFilter.value = state.filter.area;
  renderStats();
  renderLaunch();
  renderBoard();
  renderMap();
  renderRecurring();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

bindEvents();
render();
