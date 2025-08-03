# API Route で YouTube 動画詳細情報を取得する実装知見

## 📅 学習日時

2025 年 8 月 3 日

## ✅ 結論

YouTube Data API v3 で「動画の詳細情報」を取得するには、必ず 2 段階の API 呼び出しが必要。

1. search API で動画 ID 一覧を取得
2. videos API でその ID 群の詳細情報（タイトル・説明・サムネ・公開日・長さ・再生数など）をまとめて取得
   この流れを Next.js API Route で実装することで、目的の情報を漏れなく・効率的に取得できる。

## 🧠 詳細

### 2 段階 API 呼び出しの流れ

1. **search API（動画 ID 一覧取得）**
   - チャンネル ID を指定して、最新動画の ID 一覧を取得する
2. **videos API（詳細情報取得）**
   - 取得した ID 群を使い、各動画の詳細情報（タイトル・説明・サムネ・公開日・長さ・再生数など）をまとめて取得

この 2 段階を踏むことで、YouTube 動画の「本当に欲しい情報」を一括で取得できる。

### Next.js API Route での実装ポイント

- チャンネル ID は MVP 用途でハードコーディング
- API キーは.env 管理
- 型安全化：YoutubeApiItem 型で searchData.items を型アサート
- 動画 ID 抽出：
  - `.map((item) => item.id?.videoId)` で ID 抽出
  - `.filter((id) => !!id)` で undefined/null/空文字除外（truthy 判定）
- エラー処理：
  - 動画 ID が 0 件なら 404 返却
  - fetch 失敗時は 500 返却＋ console.error
- レスポンスは videos API の生データ（今後必要に応じて整形可能）

### コード例

```typescript
// 1. 動画ID一覧取得
const searchRes = await fetch(searchUrl);
const searchData = await searchRes.json();
const videoIds = ((searchData.items as YoutubeApiItem[]) || [])
  .map((item) => item.id?.videoId)
  .filter((id: string | undefined) => !!id);

if (videoIds.length === 0) {
  return NextResponse.json({ error: "No videos found" }, { status: 404 });
}

// 2. 動画詳細情報取得
const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds.join(
  ","
)}&part=snippet,contentDetails,statistics`;
const detailsRes = await fetch(detailsUrl);
const detailsData = await detailsRes.json();
```

`!!id` は「値が存在するものだけ抽出」するための JS テクニック。
