"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { splitTranscript } from "@/lib/content/split-transcript";
import type { Passage, Session, SessionMode } from "@/lib/domain/types";
import { bootstrapSession } from "@/lib/session/active-session";

import { AudioPlayer } from "./audio-player";
import { TranscriptView } from "./transcript-view";

function sentenceIndexFromTime(
  currentTime: number,
  duration: number,
  sentenceCount: number,
): number | null {
  if (!duration || sentenceCount === 0) return null;
  const ratio = Math.min(1, Math.max(0, currentTime / duration));
  return Math.min(sentenceCount - 1, Math.floor(ratio * sentenceCount));
}

export function ListenSessionPage() {
  const searchParams = useSearchParams();
  const forceNew = searchParams.get("new") === "1";
  const modeParam = searchParams.get("mode");
  const mode: SessionMode = modeParam === "read" ? "read" : "listen";

  const [passage, setPassage] = useState<Passage | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(
    null,
  );

  const sentenceCount = useMemo(
    () => (passage ? splitTranscript(passage.transcript).length : 0),
    [passage],
  );

  useEffect(() => {
    let cancelled = false;
    void bootstrapSession({ forceNew, mode })
      .then((result) => {
        if (cancelled) return;
        setPassage(result.passage);
        setSession(result.session);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "세션을 시작하지 못했습니다.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [forceNew, mode]);

  const onTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      setActiveSentenceIndex(
        sentenceIndexFromTime(currentTime, duration, sentenceCount),
      );
    },
    [sentenceCount],
  );

  if (error) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link className="text-sm underline" href="/">
          홈으로
        </Link>
      </div>
    );
  }

  if (!passage || !session) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-zinc-600 dark:text-zinc-400">
        세션 준비 중…
      </div>
    );
  }

  const modeQuery = mode === "read" ? "mode=read" : "mode=listen";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <Link
          href="/"
          className="text-sm text-zinc-500 underline-offset-2 hover:underline"
        >
          ← 홈
        </Link>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          오늘의 passage
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {passage.title}
        </h1>
        <div className="flex gap-2 text-sm">
          <Link
            href="/session?mode=listen"
            className={`rounded-full px-3 py-1 ${
              mode === "listen"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            듣기
          </Link>
          <Link
            href="/session?mode=read"
            className={`rounded-full px-3 py-1 ${
              mode === "read"
                ? "bg-zinc-900 text-white dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            읽기
          </Link>
        </div>
      </header>

      {mode === "listen" && passage.audioUrl ? (
        <AudioPlayer
          src={passage.audioUrl}
          playbackRate={playbackRate}
          onPlaybackRateChange={setPlaybackRate}
          onTimeUpdate={onTimeUpdate}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          읽기 모드 — 전사만 표시합니다. 같은 passage로 듣기와 비교할 수
          있습니다.
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-500">전사 (transcript)</h2>
        <TranscriptView
          transcript={passage.transcript}
          activeSentenceIndex={mode === "listen" ? activeSentenceIndex : null}
        />
      </section>

      <p className="text-xs text-zinc-500">
        세션 ID: {session.id.slice(0, 8)}… · 모드: {mode} ({modeQuery}) ·
        끊김/태그 UI는 다음 이슈
      </p>
    </div>
  );
}
