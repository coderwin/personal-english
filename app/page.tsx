import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            personal-english
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            문장이 이어질 때, 어디서 이해가 끊기는지 기록하는 앱
          </h1>
          <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
            MVP는 하루 1세션: passage 듣기/읽기 → 끊김 구간 → 단어·구조·소리
            태그 → 요약.
          </p>
        </div>
        <Link
          href="/session?new=1&mode=listen"
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          오늘 세션 시작 (듣기)
        </Link>
        <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            <Link
              className="font-medium text-zinc-900 underline underline-offset-2 dark:text-zinc-100"
              href="https://github.com/coderwin/personal-english/blob/main/docs/MVP.md"
            >
              MVP 시나리오 (docs/MVP.md)
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
