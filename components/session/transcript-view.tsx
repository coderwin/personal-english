import { splitTranscript } from "@/lib/content/split-transcript";

type Props = {
  transcript: string;
  activeSentenceIndex: number | null;
  selectedSentenceIndex?: number | null;
  breakpointSentenceIndices?: ReadonlySet<number>;
  onSentenceSelect?: (index: number) => void;
};

export function TranscriptView({
  transcript,
  activeSentenceIndex,
  selectedSentenceIndex = null,
  breakpointSentenceIndices,
  onSentenceSelect,
}: Props) {
  const sentences = splitTranscript(transcript);

  return (
    <ol className="flex list-none flex-col gap-3">
      {sentences.map((sentence, index) => {
        const isActive = activeSentenceIndex === index;
        const isSelected = selectedSentenceIndex === index;
        const hasBreakpoint = breakpointSentenceIndices?.has(index) ?? false;
        const interactive = Boolean(onSentenceSelect);

        let className =
          "rounded-lg border px-4 py-3 text-base leading-7 transition-colors ";
        if (isSelected) {
          className +=
            "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/40 text-zinc-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-50";
        } else if (isActive) {
          className +=
            "border-amber-400 bg-amber-50 text-zinc-900 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-50";
        } else if (hasBreakpoint) {
          className +=
            "border-violet-300 bg-violet-50/80 text-zinc-800 dark:border-violet-700 dark:bg-violet-950/30 dark:text-violet-100";
        } else {
          className +=
            "border-transparent bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200";
        }
        if (interactive) {
          className +=
            " cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600";
        }

        return (
          <li
            key={`${index}-${sentence.slice(0, 24)}`}
            className={className}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onClick={interactive ? () => onSentenceSelect?.(index) : undefined}
            onKeyDown={
              interactive
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSentenceSelect?.(index);
                    }
                  }
                : undefined
            }
          >
            <span className="mr-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              {index + 1}
              {hasBreakpoint ? (
                <span className="ml-1 text-violet-600 dark:text-violet-400">
                  · 끊김
                </span>
              ) : null}
            </span>
            {sentence}
          </li>
        );
      })}
    </ol>
  );
}
