# Next.js VideoItem コンポーネント実装の学び

## 📅 学習日時

2025 年 8 月 3 日

## ✅ 結論

Next.js で YouTube 動画リスト UI を作る際は、1 件表示用の VideoItem コンポーネントに分割し、サムネイル画像は<Image>で最適化、クリックで YouTube 再生（新規タブ）を安全に実装できる。

## 🧠 詳細

- props で YoutubeVideo 型の 1 件分データを受け取ることで型安全・再利用性が向上
- サムネイル画像は\<a>タグで囲み、href に YouTube 動画 URL（videoId 埋め込み）を指定
- target="\_blank"で新規タブ、rel="noopener noreferrer"でセキュリティ対策
- \<Image>の objectFit="cover"で枠いっぱいに画像表示、priority でファーストビュー画像を最優先読み込み
- UI 部品を細かく分割することで保守性・拡張性が高まる

---

```tsx
// サムネイル画像をクリックするとYouTube動画ページに遷移（リンクとして反応）
<a
  href={`https://www.youtube.com/watch?v=${video.videoId}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <Image
    src={video.thumbnailUrl}
    alt={video.title}
    width={320}
    height={180}
    style={{ objectFit: "cover" }} // 枠いっぱいに画像を表示
    priority // 最優先で読み込む
  />
</a>
```

---
