# データベース設計

## 📊 エンティティ関係図 (ERD)

```
┌─────────────────────────────┐
│        WatchedVideo         │
├─────────────────────────────┤
│ id: Int (PK)                │
│ videoId: String             │
│ watchedAt: DateTime         │
└─────────────────────────────┘
```

## 🗄️ Prisma スキーマ設計

### schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model WatchedVideo {
  id        Int      @id @default(autoincrement())
  videoId   String   @unique
  watchedAt DateTime @default(now())

  @@map("watched_videos")
}
```

## 📝 テーブル詳細

| カラム名  | データ型 | 制約                     | 説明            |
| --------- | -------- | ------------------------ | --------------- |
| id        | Int      | PK, AUTO_INCREMENT       | プライマリキー  |
| videoId   | String   | UNIQUE, NOT NULL         | YouTube 動画 ID |
| watchedAt | DateTime | NOT NULL, DEFAULT(now()) | 視聴日時        |