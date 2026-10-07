import type { CauseTag } from "./types";

export const CAUSE_TAGS: readonly CauseTag[] = [
  "word",
  "structure",
  "sound",
] as const;

export const CAUSE_TAG_LABELS: Record<CauseTag, string> = {
  word: "단어",
  structure: "문장 구조",
  sound: "소리",
};
