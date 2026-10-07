import seedDefinitions from "@/content/seed-passages.json";
import { withBasePath } from "@/lib/base-path";
import type { Passage } from "@/lib/domain/types";

export interface SeedPassageDefinition {
  id: string;
  title: string;
  transcript: string;
  audioFile: string;
  difficulty?: string;
}

const definitions = seedDefinitions as SeedPassageDefinition[];

export function definitionToPassage(def: SeedPassageDefinition): Passage {
  return {
    id: def.id,
    title: def.title,
    transcript: def.transcript,
    audioUrl: withBasePath(`/audio/${def.audioFile}`),
    difficulty: def.difficulty,
  };
}

/** All MVP seed passages (1~3). */
export const SEED_PASSAGES: Passage[] = definitions.map(definitionToPassage);

export function getSeedPassageById(id: string): Passage | undefined {
  return SEED_PASSAGES.find((p) => p.id === id);
}
