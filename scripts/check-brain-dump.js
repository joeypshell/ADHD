const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("app.js", "utf8");
const functionNames = [
  "normalizeBrainDumpFragment",
  "brainDumpLooksActionable",
  "splitBrainDumpSegment",
  "splitBrainDump",
  "inferBrainKind",
  "inferBrainArea",
  "inferBrainCadence"
];

function extractFunction(name) {
  const match = new RegExp(`function\\s+${name}\\s*\\(`).exec(source);
  if (!match) throw new Error(`Missing function ${name}`);
  const start = match.index;
  const braceStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Could not parse function ${name}`);
}

const context = {};
vm.createContext(context);
vm.runInContext(
  `function dashboardMode() { return "home"; }\n${functionNames.map(extractFunction).join("\n")}\nthis.splitBrainDump = splitBrainDump;\nthis.inferBrainKind = inferBrainKind;\nthis.inferBrainArea = inferBrainArea;\nthis.inferBrainCadence = inferBrainCadence;`,
  context
);

function assertTasks(input, expected) {
  const actual = context.splitBrainDump(input);
  const missing = expected.filter((task) => !actual.includes(task));
  if (missing.length) {
    throw new Error(`Expected ${JSON.stringify(input)} to include ${JSON.stringify(missing)}, got ${JSON.stringify(actual)}`);
  }
}

function assertInference(input, expected) {
  const kind = context.inferBrainKind(input);
  const area = context.inferBrainArea(input, kind);
  if (expected.kind && kind !== expected.kind) {
    throw new Error(`Expected ${JSON.stringify(input)} kind ${expected.kind}, got ${kind}`);
  }
  if (expected.area && area !== expected.area) {
    throw new Error(`Expected ${JSON.stringify(input)} area ${expected.area}, got ${area}`);
  }
  if (expected.cadence) {
    const cadence = context.inferBrainCadence(input);
    if (cadence !== expected.cadence) {
      throw new Error(`Expected ${JSON.stringify(input)} cadence ${expected.cadence}, got ${cadence}`);
    }
  }
}

assertTasks(
  "renew sticker, ask clinic about tests, clean kitchen tonight",
  ["renew sticker", "ask clinic about tests", "clean kitchen tonight"]
);

assertTasks(
  "I need to get gas and also do dishes then plan dinner",
  ["get gas", "do dishes", "plan dinner"]
);

assertTasks(
  "- call dentist\n- pay bill\n- workout",
  ["call dentist", "pay bill", "workout"]
);

assertTasks(
  "remember to upload tests; maybe write novel scene. renew sticker",
  ["upload tests", "write novel scene", "renew sticker"]
);

assertInference("renew sticker", { kind: "rescue", area: "Home / Admin" });
assertInference("call doctor", { kind: "project", area: "Health / Medical" });
assertInference("call vet", { kind: "project", area: "Health / Medical" });
assertInference("text mom", { kind: "project", area: "Relationships" });
assertInference("call client", { kind: "project", area: "Work" });
assertInference("call girlfriend", { kind: "project", area: "Relationships" });
assertInference("do work project", { kind: "project", area: "Work" });
assertInference("build deck", { kind: "project", area: "Home / Admin" });
assertInference("cook dinner", { kind: "rhythm", area: "Home / Admin" });
assertInference("pick up kids", { kind: "project", area: "Relationships" });
assertInference("work out", { kind: "rhythm", area: "Body / Exercise", cadence: "daily" });

console.log("OK: brain dump extraction checks passed");
