# YouTube API レスポンス整形ユーティリティの活用知見

## 📅 学習日時

2025 年 8 月 3 日

## ✅ 結論

API レスポンスを UI 表示用の型（YoutubeVideo 型）に整形するユーティリティ関数は、API 仕様変更や他サービス連携時にも再利用・拡張しやすく、保守性・可読性向上に役立つ。

## 🧠 詳細

- `parseYoutubeApiResponse`は、YouTube Data API の videos エンドポイントのレスポンス（items 配列）を、UI 表示に最適な YoutubeVideo 型配列へ変換する関数。
- API レスポンスの構造（ネスト・型・値の有無）を吸収し、UI 側は「必要な情報だけ・型安全に」扱える。
- 仕様変更（API レスポンス項目追加/削除）や他サービス（例：Vimeo, Dailymotion 等）でも「API→UI 型変換ユーティリティ」を用意すれば、UI ロジックはほぼ共通化できる。
- 型定義（YoutubeVideo, YoutubeVideoDetailsApiResponse 等）とセットで管理することで、型安全・保守性・拡張性が大幅に向上。
- 使い方：API Route や fetch で取得した JSON をこの関数に渡すだけで、UI 用データが得られる。

### コード例

```typescript
export function parseYoutubeApiResponse(
  apiResponse: YoutubeVideoDetailsApiResponse
): YoutubeVideo[] {
  if (!apiResponse?.items) return [];
  return apiResponse.items.map((item) => ({
    videoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || "",
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails.duration,
    viewCount: Number(item.statistics.viewCount),
  }));
}
```

- 今後の拡張例：
  - 他 API（Vimeo, Dailymotion 等）用の parse 関数を同じ設計で追加
  - YoutubeVideo 型に新項目追加時も parse 関数のみ修正すれば UI はそのまま
  - API レスポンスのバリデーション・エラーハンドリングも一元化可能
