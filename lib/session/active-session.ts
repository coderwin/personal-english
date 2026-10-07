import { getPassageForDate } from "@/lib/seed/daily-passage";
import { getSeedPassageById, SEED_PASSAGES } from "@/lib/seed/seed-passages";
import type { Passage, Session, SessionMode } from "@/lib/domain/types";
import {
  getPassage,
  getSession,
  initDb,
  startSession,
  upsertPassage,
} from "@/lib/db";

import { ACTIVE_SESSION_STORAGE_KEY } from "./storage";

async function syncSeedPassages(): Promise<void> {
  await Promise.all(SEED_PASSAGES.map((p) => upsertPassage(p)));
}

function resolvePassage(passageId: string, fallback: Passage): Passage {
  return getSeedPassageById(passageId) ?? fallback;
}

export async function bootstrapSession(options: {
  forceNew?: boolean;
  mode: SessionMode;
}): Promise<{ passage: Passage; session: Session }> {
  await initDb();
  await syncSeedPassages();

  const todaysPassage = getPassageForDate();

  if (!options.forceNew && typeof window !== "undefined") {
    const storedId = sessionStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (storedId) {
      const existing = await getSession(storedId);
      if (existing && existing.completedAt === undefined) {
        const fromDb = await getPassage(existing.passageId);
        const passage = fromDb
          ? resolvePassage(fromDb.id, fromDb)
          : todaysPassage;
        return { passage, session: existing };
      }
    }
  }

  const session = await startSession({
    passageId: todaysPassage.id,
    mode: options.mode,
  });
  sessionStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, session.id);
  return { passage: todaysPassage, session };
}
