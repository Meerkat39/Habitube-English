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

┌─────────────────────────────┐
│        Achievement          │
├─────────────────────────────┤
│ id: Int (PK)                │
│ userId: Int                 │
│ date: String                │
│ createdAt: DateTime         │
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

model Achievement {
  id        Int      @id @default(autoincrement())
  userId    Int
  date      String   // YYYY-MM-DD
  createdAt DateTime @default(now())
}
```

## 📝 テーブル詳細

### WatchedVideo

| カラム名  | データ型 | 制約                     | 説明            |
| --------- | -------- | ------------------------ | --------------- |
| id        | Int      | PK, AUTO_INCREMENT       | プライマリキー  |
| videoId   | String   | UNIQUE, NOT NULL         | YouTube 動画 ID |
| watchedAt | DateTime | NOT NULL, DEFAULT(now()) | 視聴日時        |

### Achievement

| カラム名  | データ型 | 制約                     | 説明                    |
| --------- | -------- | ------------------------ | ----------------------- |
| id        | Int      | PK, AUTO_INCREMENT       | プライマリキー          |
| userId    | Int      | NOT NULL                 | ユーザー ID（MVP は仮） |
| date      | String   | NOT NULL                 | 達成日（YYYY-MM-DD）    |
| createdAt | DateTime | NOT NULL, DEFAULT(now()) | 記録作成日時            |
