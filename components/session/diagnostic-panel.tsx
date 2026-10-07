import type { Breakpoint, CauseTag } from "@/lib/domain/types";
import { CAUSE_TAGS, CAUSE_TAG_LABELS } from "@/lib/domain/constants";

type Props = {
  selectedSentenceIndex: number | null;
  selectedSentenceText: string | null;
  pendingTags: CauseTag[];
  onToggleTag: (tag: CauseTag) => void;
  onSave: () => void;
  onClearSelection: () => void;
  saving: boolean;
  saveError: string | null;
  breakpoints: Breakpoint[];
  sentenceTexts: string[];
};

export function DiagnosticPanel({
  selectedSentenceIndex,
  selectedSentenceText,
  pendingTags,
  onToggleTag,
  onSave,
  onClearSelection,
  saving,
  saveError,
  breakpoints,
  sentenceTexts,
}: Props) {
  const canSave =
    selectedSentenceIndex !== null && pendingTags.length > 0 && !saving;

  return (
    <section
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
      aria-label="진단 패널"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          진단 — 여기부터 모르겠어요
        </h2>
        <p className="text-xs text-zinc-500">
          전사에서 문장을 탭한 뒤, 끊긴 이유(단어 / 구조 / 소리)를 고르고
          저장하세요.
        </p>
      </div>

      {selectedSentenceIndex === null ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          아래 전사에서 끊긴 문장을 선택해 주세요.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-zinc-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-50">
            <span className="mr-2 text-xs font-medium text-amber-800 dark:text-amber-200">
              문장 {selectedSentenceIndex + 1}
            </span>
            {selectedSentenceText}
          </p>

          <div className="flex flex-wrap gap-2">
            {CAUSE_TAGS.map((tag) => {
              const active = pendingTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                  aria-pressed={active}
                >
                  {CAUSE_TAG_LABELS[tag]}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!canSave}
              onClick={onSave}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              {saving ? "저장 중…" : "끊김 저장"}
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              선택 취소
            </button>
          </div>
          {saveError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {saveError}
            </p>
          ) : null}
        </div>
      )}

      {breakpoints.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-700">
          <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            이번 세션에 저장된 끊김 ({breakpoints.length})
          </h3>
          <ul className="flex flex-col gap-2">
            {breakpoints.map((bp) => (
              <li
                key={bp.id}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  문장 {bp.sentenceIndex + 1}
                </span>
                <span className="mx-2 text-zinc-400">·</span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {bp.causeTags.map((t) => CAUSE_TAG_LABELS[t]).join(", ")}
                </span>
                {sentenceTexts[bp.sentenceIndex] ? (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {sentenceTexts[bp.sentenceIndex]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
