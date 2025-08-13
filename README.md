# Habitube English

![Habitube English](public/imgs/thumbnail.png)

## 英語学習の継続をサポートする、英語 YouTube 動画視聴 × 達成カレンダーの Web アプリ

YouTube の英語学習チャンネルの最新動画を一覧表示し、視聴記録をカレンダーで可視化することで、毎日の学習習慣を楽しく継続できるサービスです。

![アプリの全体像](public/imgs/screenshot_overview.png)

---

## 技術スタック

| カテゴリ          | 技術・サービス                                                  |
| ----------------- | ------------------------------------------------------------------------------ |
| フロントエンド    | Next.js (App Router) v15.4.5 / React v19.1.0 / TypeScript v5 / Tailwind CSS v4 |
| バックエンド      | Next.js API Routes v15.4.5 / TypeScript v5                                     |
| データベース      | SQLite                                                                         |
| ORM               | Prisma v6.13.0                                                                 |
| 開発支援          | GitHub Copilot                                                                 |
| 外部サービス・API | YouTube Data API v3                                                            |

---

## 主な機能

### 視聴記録の保存と達成カレンダー表示

- 視聴した動画をワンクリックで記録
- 月ごとの達成状況をカレンダーで可視化
- 達成日数の集計や履歴も確認可能

<div style="display: flex; justify-content: space-between;">
  <img src="public/imgs/screenshot_calendar_1.png" alt="達成カレンダー画面1" style="width: 45%;" />
  <img src="public/imgs/screenshot_calendar_2.png" alt="達成カレンダー画面2" style="width: 45%;" />
</div>

### お気に入り英語 YouTube チャンネルの最新動画取得

- 登録したチャンネルの最新動画を自動取得し、一覧表示
- タイトル・サムネイル・チャンネル名を分かりやすく表示
- サムネイルクリックで YouTube 動画を新規タブで再生

![動画リスト画面](public/imgs/screenshot_videos_list.png)

### お気に入りのチャンネルの管理

- お気に入りのチャンネルを自由に追加・削除
- チャンネルリストの編集はモーダル UI で直感的に操作

![お気に入りのチャンネル管理画面](public/imgs/screenshot_favorite_channel_manager.png)
