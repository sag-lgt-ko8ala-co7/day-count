import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { diffDays, formatDiff, parseDate, todayInTokyo } from "./day-count.ts";

describe("diffDays（初日を含まない）", () => {
  const cases: [string, string, string, number][] = [
    ["設計書の例", "2026-11-09", "2026-12-18", 39],
    ["うるう年の2月", "2024-02-28", "2024-03-01", 2],
    ["平年の2月", "2023-02-28", "2023-03-01", 1],
    ["2000年はうるう年", "2000-02-28", "2000-03-01", 2],
    ["2100年は平年", "2100-02-28", "2100-03-01", 1],
    ["うるう年の1年間", "2024-01-01", "2025-01-01", 366],
    ["平年の1年間", "2025-01-01", "2026-01-01", 365],
    ["31日の月末", "2026-01-31", "2026-02-01", 1],
    ["30日の月末", "2026-04-30", "2026-05-01", 1],
    ["大みそかから元日", "2026-12-31", "2027-01-01", 1],
    ["年をまたぐ期間", "2026-12-25", "2027-01-05", 11],
    ["終了日が前", "2026-12-18", "2026-11-09", -39],
    ["同じ日", "2026-11-13", "2026-11-13", 0],
  ];
  for (const [name, start, end, expected] of cases) {
    test(`${name}: ${start} → ${end} は ${expected}`, () => {
      assert.equal(diffDays(start, end), expected);
    });
  }

  test("どちらかが不正なら null", () => {
    assert.equal(diffDays("", "2026-11-13"), null);
    assert.equal(diffDays("2026-11-13", ""), null);
  });
});

describe("parseDate", () => {
  test("存在しない日付や書式違いは null", () => {
    for (const s of ["", "2023-02-29", "2026-13-01", "2026-04-31", "2026-1-1", "abc"]) {
      assert.equal(parseDate(s), null, s);
    }
  });

  test("うるう日は受け付ける", () => {
    assert.notEqual(parseDate("2024-02-29"), null);
  });
});

describe("formatDiff", () => {
  test("正の数は「〇日」", () => {
    assert.deepEqual(formatDiff(39), { value: 39, unit: "日" });
  });
  test("負の数は「〇日前」", () => {
    assert.deepEqual(formatDiff(-39), { value: 39, unit: "日前" });
  });
  test("0 は「0日」", () => {
    assert.deepEqual(formatDiff(0), { value: 0, unit: "日" });
  });
});

describe("todayInTokyo", () => {
  test("日本時間で 23:59:59 ならまだその日", () => {
    assert.equal(todayInTokyo(new Date("2026-11-12T14:59:59Z")), "2026-11-12");
  });
  test("日本時間で 0:00 になったら翌日", () => {
    assert.equal(todayInTokyo(new Date("2026-11-12T15:00:00Z")), "2026-11-13");
  });
});
