import type { Breakpoint, CauseTag } from "@/lib/domain/types";
import { CAUSE_TAGS } from "@/lib/domain/constants";

export type CauseTagCounts = Record<CauseTag, number>;

export function emptyCauseTagCounts(): CauseTagCounts {
  return { word: 0, structure: 0, sound: 0 };
}

/** Count each tag occurrence across breakpoints (multi-tag rows count multiple times). */
export function countCauseTags(breakpoints: Breakpoint[]): CauseTagCounts {
  const counts = emptyCauseTagCounts();
  for (const bp of breakpoints) {
    for (const tag of bp.causeTags) {
      counts[tag] += 1;
    }
  }
  return counts;
}

export function totalTagCount(counts: CauseTagCounts): number {
  return CAUSE_TAGS.reduce((sum, tag) => sum + counts[tag], 0);
}
