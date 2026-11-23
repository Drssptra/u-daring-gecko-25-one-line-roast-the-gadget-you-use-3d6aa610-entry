// One-Line Roast: The Gadget You Use Every Day
// Writes the entry text to $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt).
// The entry is a fixed string constant — both grader runs write identical bytes.
// Node 22, standard library only.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My smartwatch throws a parade every time I stand up, then guilt-trips me for sitting down — all I did was walk to the fridge.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Gate self-check: UTF-8, 1–200 Unicode code points, not only whitespace.
const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(
    `entry must be 1-200 characters, got ${codePoints} characters`
  );
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(`wrote entry.txt (${codePoints} characters)`);
