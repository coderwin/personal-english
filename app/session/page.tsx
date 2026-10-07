import { Suspense } from "react";

import { ListenSessionPage } from "@/components/session/listen-session-page";

export default function SessionRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-6 py-12 text-zinc-600 dark:text-zinc-400">
          세션 준비 중…
        </div>
      }
    >
      <ListenSessionPage />
    </Suspense>
  );
}
