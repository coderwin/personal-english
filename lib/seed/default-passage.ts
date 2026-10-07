import type { Passage } from "@/lib/domain/types";

export const DEFAULT_PASSAGE_ID = "seed-01";

/** Minimal seed for listen screen v0; matched narration comes in seed-content issue. */
export const defaultPassage: Passage = {
  id: DEFAULT_PASSAGE_ID,
  title: "Morning routine",
  transcript:
    "I've been trying to figure out why some sentences feel easy when I read them, but fall apart when I hear them. This morning I listened to the same line three times. I knew every word on the page. Still, the middle clause vanished in the audio. That gap is what I want to record, not my quiz score.",
  audioUrl: "/audio/seed-01.mp3",
  difficulty: "A2",
};
