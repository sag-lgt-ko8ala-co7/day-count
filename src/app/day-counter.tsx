"use client";

import { use, useState } from "react";
import { io } from "next/cache";
import { diffDays, formatDiff, todayInTokyo } from "@/lib/day-count";

// iOS Safari の date 入力欄は独自の最小幅を持ち、画面の外にはみ出すため、
// appearance-none と min-w-0 で幅に収める。appearance-none にすると iOS では
// 値が中央寄せになり、空のときは高さがつぶれるので、左寄せと最小の高さ（PC と同じ 46px）を指定する
const inputClass =
  "block w-full min-w-0 min-h-[46px] appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left text-lg text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 [&::-webkit-date-and-time-value]:text-left";

export function DayCounter() {
  // 今日の日付をビルド時の静的シェルに含めず、リクエストのたびに決める
  use(io());
  const [start, setStart] = useState(() => todayInTokyo());
  const [end, setEnd] = useState("");

  const days = diffDays(start, end);
  const result = days === null ? null : formatDiff(days);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">開始日</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">終了日</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div
        aria-live="polite"
        className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-6 text-center dark:bg-zinc-900"
      >
        {result === null ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            {start === "" ? "開始日を選んでください" : "終了日を選んでください"}
          </p>
        ) : (
          <>
            <p className="font-bold">
              <span className="text-6xl tabular-nums">{result.value.toLocaleString("ja-JP")}</span>
              <span className="ml-1 text-2xl">{result.unit}</span>
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">初日を含まない</p>
          </>
        )}
      </div>
    </div>
  );
}
