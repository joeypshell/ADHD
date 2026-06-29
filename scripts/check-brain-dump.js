const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("app.js", "utf8");
const functionNames = [
  "normalizeBrainDumpFragment",
  "brainDumpLooksActionable",
  "splitBrainDumpSegment",
  "splitBrainDump"
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
vm.runInContext(`${functionNames.map(extractFunction).join("\n")}\nthis.splitBrainDump = splitBrainDump;`, context);

function assertTasks(input, expected) {
  const actual = context.splitBrainDump(input);
  const missing = expected.filter((task) => !actual.includes(task));
  if (missing.length) {
    throw new Error(`Expected ${JSON.stringify(input)} to include ${JSON.stringify(missing)}, got ${JSON.stringify(actual)}`);
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

console.log("OK: brain dump extraction checks passed");
