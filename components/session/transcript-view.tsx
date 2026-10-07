import { splitTranscript } from "@/lib/content/split-transcript";

type Props = {
  transcript: string;
  activeSentenceIndex: number | null;
};

export function TranscriptView({ transcript, activeSentenceIndex }: Props) {
  const sentences = splitTranscript(transcript);

  return (
    <ol className="flex list-none flex-col gap-3">
      {sentences.map((sentence, index) => {
        const isActive = activeSentenceIndex === index;
        return (
          <li
            key={`${index}-${sentence.slice(0, 24)}`}
            className={`rounded-lg border px-4 py-3 text-base leading-7 transition-colors ${
              isActive
                ? "border-amber-400 bg-amber-50 text-zinc-900 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-50"
                : "border-transparent bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            }`}
          >
            <span className="mr-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              {index + 1}
            </span>
            {sentence}
          </li>
        );
      })}
    </ol>
  );
}
