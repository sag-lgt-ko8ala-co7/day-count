# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## プロジェクト固有ルール

### このアプリについて
- 2つの日付を入れると、その間の日数がすぐに分かるWebアプリ
- 設計書は docs/design.md。迷ったら設計書に従う

### スコープ
- MVP は F-01（日数計算）のみ。カウントダウン（F-02）はリリース2、初日の選択（F-03）と保存（F-04）はリリース3
- 営業日・祝日の計算、時刻単位の計算、和暦、通知、ログインは作らない

### 計算ルール
- 初日は含めない（11月9日〜12月18日は39日）。画面にも「初日を含まない」と書き添える
- 終了日が開始日より前なら「〇日前」、同じ日なら「0日」と表示する
- 日付は日本時間で数える。時差で1日ずれないよう、時刻を含めずに日付だけで計算する
- 開始日は最初から今日（日本時間）を入れておく。日付を変えたら、ボタンを押さなくてもすぐに結果が変わる

### 技術
- Next.js App Router / TypeScript / Tailwind CSS
- MVP とリリース2ではデータを保存しない。リリース3から localStorage を使う

### UI
- 画面の文言はすべて日本語
- スマホ幅 375px で崩れないこと
- 日付はカレンダーから選べるようにする
- 日数は大きな文字で表示する

### 進め方
- 実装の前に必ず Plan Mode で計画を出し、承認を待つ
- 変更のたびに npm run lint と npm run build を通してから完了報告する
- 1人で開発しているので、ブランチは作らず main に直接コミットする
- コミットメッセージは日本語で、何をなぜ変えたかを書く
- 実機のスマホでは確かめられないので、確かめていないことは報告する

## Commands

```bash
npm run dev     # next dev (Turbopack), http://localhost:3000
npm run build   # production build; also catches Cache Components prerender errors
npm run start   # serve the production build
npm run lint    # eslint (flat config: next core-web-vitals + typescript)
```

There is no test framework set up yet.

## Stack and architecture notes

- Next.js 16.4 (App Router) with React 19.3, TypeScript (strict) and Tailwind CSS v4. All source is under `src/app/`. The path alias `@/*` maps to `./src/*`.
- Tailwind runs through the `@tailwindcss/turbopack` loader configured in `next.config.ts` (`turbopack.rules`), not PostCSS. There is no `tailwind.config` file: the theme lives in `src/app/globals.css` via `@import "tailwindcss"` and `@theme inline`.
- `next.config.ts` turns on **`cacheComponents`** and **`partialPrefetching`**. This matters for this app: calling `new Date()` or `Date.now()` during a server prerender is a build error. Compute "today" in a Client Component (or behind `connection()` inside `<Suspense>`). See `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`.
- Page and layout props use the global generated types (`LayoutProps<"/">`, `PageProps<...>`) instead of hand-written prop interfaces.
- `layout.tsx` and `page.tsx` are still create-next-app boilerplate. Metadata says "Create Next App" and `lang="en"`; both should change to fit this Japanese app.
