"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { splitTranscript } from "@/lib/content/split-transcript";
import { CAUSE_TAGS, CAUSE_TAG_LABELS } from "@/lib/domain/constants";
import type { Breakpoint, Passage, Session } from "@/lib/domain/types";
import {
  completeSession,
  getPassage,
  getSession,
  initDb,
  listBreakpointsForSession,
} from "@/lib/db";
import { countCauseTags, totalTagCount } from "@/lib/stats/cause-tag-counts";
import { ACTIVE_SESSION_STORAGE_KEY } from "@/lib/session/storage";

function resolveSessionId(querySessionId: string | null): string | null {
  if (querySessionId) return querySessionId;
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
}

export function SessionSummaryPage() {
  const searchParams = useSearchParams();
  const querySessionId = searchParams.get("sessionId");

  const [session, setSession] = useState<Session | null>(null);
  const [passage, setPassage] = useState<Passage | null>(null);
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const sessionId = resolveSessionId(querySessionId);
      if (!sessionId) {
        if (!cancelled) {
          setError(
            "요약할 세션을 찾을 수 없습니다. 세션을 먼저 시작해 주세요.",
          );
          setLoading(false);
        }
        return;
      }

      try {
        await initDb();
        const loadedSession = await getSession(sessionId);
        if (!loadedSession) {
          throw new Error("세션 데이터가 없습니다.");
        }
        if (loadedSession.completedAt === undefined) {
          await completeSession(sessionId);
          loadedSession.completedAt = Date.now();
        }
        const loadedPassage = await getPassage(loadedSession.passageId);
        const saved = await listBreakpointsForSession(sessionId);
        if (cancelled) return;
        setSession(loadedSession);
        setPassage(loadedPassage ?? null);
        setBreakpoints(saved);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "요약을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [querySessionId]);

  const sentences = useMemo(
    () => (passage ? splitTranscript(passage.transcript) : []),
    [passage],
  );

  const tagCounts = useMemo(() => countCauseTags(breakpoints), [breakpoints]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-zinc-600 dark:text-zinc-400">
        요약 불러오는 중…
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-12">
        <p className="text-red-600 dark:text-red-400">
          {error ?? "세션을 찾을 수 없습니다."}
        </p>
        <Link className="text-sm underline" href="/session">
          세션으로
        </Link>
        <Link className="text-sm underline" href="/">
          홈으로
        </Link>
      </div>
    );
  }

  const completedLabel = session.completedAt
    ? new Date(session.completedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

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
          S6. 세션 요약
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          오늘 세션 마무리
        </h1>
        {passage ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            passage: <span className="font-medium">{passage.title}</span>
            {completedLabel ? <> · 완료 {completedLabel}</> : null}
          </p>
        ) : null}
      </header>

      <section className="grid grid-cols-3 gap-3" aria-label="원인 태그 집계">
        {CAUSE_TAGS.map((tag) => (
          <div
            key={tag}
            className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white px-4 py-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <span className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {tagCounts[tag]}
            </span>
            <span className="mt-1 text-xs font-medium text-zinc-500">
              {CAUSE_TAG_LABELS[tag]}
            </span>
          </div>
        ))}
      </section>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        끊김 지점 {breakpoints.length}곳 · 태그 {totalTagCount(tagCounts)}개 (한
        지점에 여러 태그 가능)
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-500">저장된 끊김</h2>
        {breakpoints.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            아직 저장된 끊김이 없습니다. 세션에서 문장을 선택하고 원인을 태그한
            뒤 다시 요약으로 와 주세요.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {breakpoints.map((bp) => (
              <li
                key={bp.id}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    문장 {bp.sentenceIndex + 1}
                  </span>
                  <span className="text-zinc-400">·</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {bp.causeTags.map((t) => CAUSE_TAG_LABELS[t]).join(", ")}
                  </span>
                </div>
                {sentences[bp.sentenceIndex] ? (
                  <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {sentences[bp.sentenceIndex]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/session?mode=${session.mode}`}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          세션으로 돌아가기
        </Link>
        <Link
          href="/session?new=1&mode=listen"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          새 세션 시작
        </Link>
      </div>
    </div>
  );
}
