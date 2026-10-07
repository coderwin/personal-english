import type {
  Breakpoint,
  CauseTag,
  NewBreakpoint,
  NewSession,
  Passage,
  Session,
  UnknownWord,
} from "@/lib/domain/types";

import { getDb } from "./database";

function newId(): string {
  return crypto.randomUUID();
}

export async function upsertPassage(passage: Passage): Promise<void> {
  await getDb().passages.put(passage);
}

export async function getPassage(id: string): Promise<Passage | undefined> {
  return getDb().passages.get(id);
}

export async function startSession(input: NewSession): Promise<Session> {
  const session: Session = {
    id: input.id ?? newId(),
    passageId: input.passageId,
    mode: input.mode,
    startedAt: input.startedAt ?? Date.now(),
    completedAt: input.completedAt,
  };
  await getDb().sessions.add(session);
  return session;
}

export async function completeSession(
  sessionId: string,
  completedAt: number = Date.now(),
): Promise<void> {
  await getDb().sessions.update(sessionId, { completedAt });
}

export async function getSession(
  sessionId: string,
): Promise<Session | undefined> {
  return getDb().sessions.get(sessionId);
}

export async function addBreakpoint(input: NewBreakpoint): Promise<Breakpoint> {
  const breakpoint: Breakpoint = {
    id: input.id ?? newId(),
    sessionId: input.sessionId,
    sentenceIndex: input.sentenceIndex,
    charStart: input.charStart,
    charEnd: input.charEnd,
    causeTags: [...input.causeTags],
  };
  await getDb().breakpoints.add(breakpoint);
  return breakpoint;
}

export async function listBreakpointsForSession(
  sessionId: string,
): Promise<Breakpoint[]> {
  return getDb()
    .breakpoints.where("sessionId")
    .equals(sessionId)
    .sortBy("sentenceIndex");
}

export async function getBreakpointAtSentence(
  sessionId: string,
  sentenceIndex: number,
): Promise<Breakpoint | undefined> {
  const rows = await getDb()
    .breakpoints.where("sessionId")
    .equals(sessionId)
    .toArray();
  return rows.find((row) => row.sentenceIndex === sentenceIndex);
}

/** Create or replace tags for one sentence in a session. */
export async function upsertBreakpointForSentence(
  sessionId: string,
  sentenceIndex: number,
  causeTags: CauseTag[],
): Promise<Breakpoint> {
  const existing = await getBreakpointAtSentence(sessionId, sentenceIndex);
  if (existing) {
    await getDb().breakpoints.update(existing.id, {
      causeTags: [...causeTags],
    });
    return { ...existing, causeTags: [...causeTags] };
  }
  return addBreakpoint({ sessionId, sentenceIndex, causeTags });
}

export async function addUnknownWord(
  word: Omit<UnknownWord, "id"> & { id?: string },
): Promise<UnknownWord> {
  const entry: UnknownWord = {
    id: word.id ?? newId(),
    word: word.word,
    passageId: word.passageId,
    sessionId: word.sessionId,
  };
  await getDb().unknownWords.add(entry);
  return entry;
}
