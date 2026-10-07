/** Why comprehension broke at a breakpoint (MVP §4.1). */
export type CauseTag = "word" | "structure" | "sound";

/** Whether the user started in listen or read mode. */
export type SessionMode = "listen" | "read";

export interface Passage {
  id: string;
  title: string;
  /** Full transcript; sentences split in UI by index. */
  transcript: string;
  audioUrl?: string;
  difficulty?: string;
}

export interface Session {
  id: string;
  passageId: string;
  startedAt: number;
  completedAt?: number;
  mode: SessionMode;
}

export interface Breakpoint {
  id: string;
  sessionId: string;
  /** Zero-based index into passage sentences. */
  sentenceIndex: number;
  charStart?: number;
  charEnd?: number;
  causeTags: CauseTag[];
}

/** Optional in MVP v0; stored when user tags "word". */
export interface UnknownWord {
  id: string;
  word: string;
  passageId: string;
  sessionId: string;
}

export type NewSession = Omit<Session, "id" | "startedAt"> & {
  id?: string;
  startedAt?: number;
};

export type NewBreakpoint = Omit<Breakpoint, "id"> & { id?: string };
