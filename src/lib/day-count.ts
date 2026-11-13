// 日数計算の純粋関数。React・Next.js には依存しない。
// 日付は <input type="date"> の値と同じ "YYYY-MM-DD" 文字列で扱い、
// 時刻を含めずに UTC の日付どうしで差を取るので、タイムゾーンや夏時間の影響を受けない。

const MS_PER_DAY = 86_400_000;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** "YYYY-MM-DD" を UTC 0時のミリ秒に変える。存在しない日付や書式違いは null。 */
export function parseDate(s: string): number | null {
  const match = DATE_PATTERN.exec(s);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const ms = Date.UTC(year, month - 1, day);
  const d = new Date(ms);
  // Date.UTC は 2023-02-29 を 3月1日に繰り上げるので、戻して一致するか確かめる
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return ms;
}

/** 開始日から終了日までの日数（初日を含まない）。終了日が前なら負の数。不正な入力は null。 */
export function diffDays(start: string, end: string): number | null {
  const s = parseDate(start);
  const e = parseDate(end);
  if (s === null || e === null) return null;
  return Math.round((e - s) / MS_PER_DAY);
}

export type FormattedDiff = { value: number; unit: "日" | "日前" };

/** 日数を表示用に分ける。負の数は「〇日前」、0 は「0日」。 */
export function formatDiff(days: number): FormattedDiff {
  if (days < 0) return { value: -days, unit: "日前" };
  return { value: days, unit: "日" };
}

const tokyoDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 日本時間での今日を "YYYY-MM-DD" で返す。テストのため現在時刻を引数で渡せる。 */
export function todayInTokyo(now: Date = new Date()): string {
  return tokyoDateFormat.format(now);
}
