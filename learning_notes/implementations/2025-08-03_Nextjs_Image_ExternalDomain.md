# Next.js で外部画像（YouTube サムネイル）表示時のエラーと対策

## 📅 学習日時

2025 年 8 月 3 日

## ✅ 結論

Next.js の<Image>で YouTube サムネイル画像（i.ytimg.com）を表示するには、next.config.ts の images.domains に"i.ytimg.com"を追加する必要がある。

## 🧠 詳細

### 発生したエラー

```
Invalid src prop (https://i.ytimg.com/vi/ZmtbzEYxBz0/hqdefault.jpg) on `next/image`, hostname "i.ytimg.com" is not configured under images in your `next.config.js`
```

### 原因

Next.js 画像最適化は外部画像のドメインを明示的に許可しないと表示できない。

### 対策

next.config.ts に以下を追加：

```typescript
const nextConfig = {
  images: {
    domains: ["i.ytimg.com"], // YouTubeサムネイル画像用
  },
};
export default nextConfig;
```

### 備考

- 追加後は Next.js の再起動が必要
- 他の外部画像も同様に domains へ追加する
