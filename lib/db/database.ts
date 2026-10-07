import Dexie, { type EntityTable } from "dexie";

import type {
  Breakpoint,
  Passage,
  Session,
  UnknownWord,
} from "@/lib/domain/types";

export class PersonalEnglishDB extends Dexie {
  passages!: EntityTable<Passage, "id">;
  sessions!: EntityTable<Session, "id">;
  breakpoints!: EntityTable<Breakpoint, "id">;
  unknownWords!: EntityTable<UnknownWord, "id">;

  constructor() {
    super("personalEnglish");
    this.version(1).stores({
      passages: "id, title",
      sessions: "id, passageId, startedAt, completedAt",
      breakpoints: "id, sessionId, sentenceIndex",
      unknownWords: "id, sessionId, passageId, word",
    });
  }
}

let db: PersonalEnglishDB | undefined;

/** Opens IndexedDB in the browser; not for Server Components. */
export function getDb(): PersonalEnglishDB {
  if (typeof window === "undefined") {
    throw new Error("Dexie is only available in the browser");
  }
  if (!db) {
    db = new PersonalEnglishDB();
  }
  return db;
}

/** Ensures the DB is opened (Dexie lazy-opens on first query). */
export async function initDb(): Promise<PersonalEnglishDB> {
  const instance = getDb();
  await instance.open();
  return instance;
}
