import type { Passage } from "@/lib/domain/types";

import { SEED_PASSAGES } from "./seed-passages";

/** UTC calendar day index (stable across time zones for a given UTC date). */
export function utcDayNumber(date: Date = new Date()): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      86_400_000,
  );
}

/** One passage per UTC day; rotates through `SEED_PASSAGES`. */
export function getPassageForDate(date: Date = new Date()): Passage {
  if (SEED_PASSAGES.length === 0) {
    throw new Error("No seed passages configured");
  }
  const index = utcDayNumber(date) % SEED_PASSAGES.length;
  return SEED_PASSAGES[index]!;
}
