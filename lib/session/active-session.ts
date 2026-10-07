import { defaultPassage } from "@/lib/seed/default-passage";
import type { Passage, Session, SessionMode } from "@/lib/domain/types";
import {
  getPassage,
  getSession,
  initDb,
  startSession,
  upsertPassage,
} from "@/lib/db";

import { ACTIVE_SESSION_STORAGE_KEY } from "./storage";

export async function bootstrapSession(options: {
  forceNew?: boolean;
  mode: SessionMode;
}): Promise<{ passage: Passage; session: Session }> {
  await initDb();
  await upsertPassage(defaultPassage);

  if (!options.forceNew && typeof window !== "undefined") {
    const storedId = sessionStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (storedId) {
      const existing = await getSession(storedId);
      if (existing && existing.completedAt === undefined) {
        const passage =
          (await getPassage(existing.passageId)) ?? defaultPassage;
        return { passage, session: existing };
      }
    }
  }

  const session = await startSession({
    passageId: defaultPassage.id,
    mode: options.mode,
  });
  sessionStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, session.id);
  return { passage: defaultPassage, session };
}
