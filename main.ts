// One-Line Roast: The Gadget You Use Every Day
//
// Entrypoint contract: emit exactly one roast line as
// $MAKEFUN_OUTPUT_DIR/entry.txt, with no trailing newline, so the two
// grader runs produce byte-identical output. The roast itself is a fixed
// literal below; nothing here is random, generated, or fetched.
//
// Runtime: Node 22, standard library only, no network, deterministic.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// The entry
// ---------------------------------------------------------------------------

const ROAST =
  "My phone's face unlock recognises me everywhere except at 7 a.m., when apparently some stranger broke into my own bed.";

// Gate limits from the competition rules (competition.yaml).
const GATE = { minCodePoints: 1, maxCodePoints: 200 } as const;

// ---------------------------------------------------------------------------
// Validation — gather every problem, then report them together
// ---------------------------------------------------------------------------

type Violation = string;

function collectViolations(text: string): Violation[] {
  const problems: Violation[] = [];
  const length = Array.from(text).length;

  if (length < GATE.minCodePoints || length > GATE.maxCodePoints) {
    problems.push(
      `length ${length} code points is outside ${GATE.minCodePoints}-${GATE.maxCodePoints}`,
    );
  }
  if (/^\s*$/.test(text)) {
    problems.push("entry is empty or whitespace only");
  }
  if (/[\r\n]/.test(text)) {
    problems.push("entry must be a single line (no CR or LF)");
  }
  if (text !== text.trim()) {
    problems.push("entry has leading or trailing whitespace");
  }
  return problems;
}

function assertGate(text: string): void {
  const problems = collectViolations(text);
  if (problems.length > 0) {
    throw new Error(`invalid entry: ${problems.join("; ")}`);
  }
}

// ---------------------------------------------------------------------------
// Output location
// ---------------------------------------------------------------------------

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return resolve(fromEnv && fromEnv.length > 0 ? fromEnv : "/output");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  assertGate(ROAST);

  const dir = outputDir();
  const target = resolve(dir, "entry.txt");
  await mkdir(dir, { recursive: true });
  await writeFile(target, ROAST, "utf8");

  // Read-back verification: the bytes on disk must be exactly the entry,
  // byte for byte — no added newline, no encoding drift. Fail loudly
  // instead of leaving a subtly wrong file behind for the grader.
  const written = await readFile(target);
  const expected = Buffer.from(ROAST, "utf8");
  if (!written.equals(expected)) {
    throw new Error(
      `read-back mismatch: entry.txt is ${written.length} bytes, expected ${expected.length} bytes`,
    );
  }
  if (written.length > 0 && written[written.length - 1] === 0x0a) {
    throw new Error("read-back mismatch: entry.txt ends with a newline");
  }

  // Stdout may carry a trailing newline; the file must not.
  console.log(ROAST);
}

await main();
