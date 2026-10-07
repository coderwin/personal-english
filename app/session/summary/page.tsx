import { Suspense } from "react";

import { SessionSummaryPage } from "@/components/session/session-summary-page";

export default function SessionSummaryRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-6 py-12 text-zinc-600 dark:text-zinc-400">
          요약 불러오는 중…
        </div>
      }
    >
      <SessionSummaryPage />
    </Suspense>
  );
}
