import { Suspense } from "react";
import { DayCounter } from "./day-counter";

function DayCounterFallback() {
  return (
    <div className="flex w-full flex-col gap-6" aria-hidden="true">
      <div className="flex flex-col gap-4">
        <div className="h-[4.25rem] rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-[4.25rem] rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <div className="min-h-36 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-4 py-10">
      <h1 className="text-2xl font-bold">日数計算</h1>
      <Suspense fallback={<DayCounterFallback />}>
        <DayCounter />
      </Suspense>
    </main>
  );
}
