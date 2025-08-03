# 技術仕様書

## 🛠️ 技術スタック

### フロントエンド

- **フレームワーク:** Next.js 14+ (App Router)
- **言語:** TypeScript
- **スタイリング:** Tailwind CSS
- **UI コンポーネント:** React 18+

### バックエンド

- **API:** Next.js API Routes
- **データベース:** SQLite
- **ORM:** Prisma

### 外部 API

- **YouTube Data API v3:** 動画情報の取得

## 📁 プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API エンドポイント
│   ├── components/        # React コンポーネント
│   └── page.tsx          # メインページ
├── lib/                   # ユーティリティ関数
├── types/                 # TypeScript 型定義
└── styles/               # グローバルスタイル
```

## 🗃️ データ管理

### お気に入りチャンネル ID

- **保存方法:** ソースコードへのハードコーディング、または JSON ファイルによる管理
- **例:**

```typescript
const FAVORITE_CHANNELS = [
  "UCvuZTJrztgEy4wHc7k2UBGg", // English Addict with Mr Steve Ford
  "UC_x5XG1OV2P6uZZ5FSM9Ttw", // Google Developers
  // ... その他のチャンネル
];
```

### 継続記録

- **保存方法:** Prisma を使用して SQLite データベースに視聴記録を保存
- **詳細:** [データベース設計](./database-design.md)を参照

## 🔌 API 設計

### YouTube Data API v3 連携

```typescript
// チャンネルの最新動画取得
GET /api/youtube/videos?channelId={channelId}&maxResults=5

// レスポンス例
{
  "videos": [
    {
      "id": "videoId",
      "title": "Video Title",
      "thumbnail": "https://...",
      "channelTitle": "Channel Name",
      "publishedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 視聴記録 API

```typescript
// 視聴記録の保存
POST /api/watched
{
  "videoId": "string",
  "watchedAt": "2024-01-01T00:00:00Z"
}

// 視聴履歴の取得
GET /api/watched?month=2024-01
```

## 🚀 開発・デプロイ

### 開発環境

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクション サーバー起動
npx prisma studio    # データベース管理UI
```

### 環境変数

```env
# YouTube Data API
YOUTUBE_API_KEY=your_api_key_here

# データベース
DATABASE_URL="file:./dev.db"
```

## 📊 パフォーマンス要件

- **初期表示時間:** 2 秒以内
- **API レスポンス時間:** 1 秒以内
- **モバイル対応:** レスポンシブデザイン
- **アクセシビリティ:** WCAG 2.1 AA 準拠
