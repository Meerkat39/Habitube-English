# Habitube English - ディレクトリ構成例

## 📁 プロジェクト全体構成

```
habitube-english/
├── src/
│   ├── app/                   # Next.js App Router（ページ・API）
│   ├── lib/                   # ユーティリティ関数
│   ├── types/                 # 型定義
│   ├── styles/                # グローバルCSS
│   └── components/            # UIコンポーネント
├── public/                     # 静的ファイル（画像・SVG等）
├── learning_notes/
│   ├── concepts/
│   ├── implementations/
│   ├── troubleshooting/
│   └── tips/
├── docs/
│   ├── features.md
│   ├── technical-specs.md
│   ├── database-design.md
│   ├── ai-guidelines.md
│   ├── learning-notes-guide.md
│   └── directory-structure.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── README.md
```

---

## src/app/ 配下の詳細ツリー

```
src/app/
├── page.tsx                # ホーム画面（動画リスト表示）
├── api/
│   └── youtube/
│       └── route.ts        # YouTube API連携（API Route）
└── components/
    ├── VideoList.tsx       # 動画リストUIコンポーネント
    └── VideoItem.tsx       # 動画1件表示用コンポーネント
```

---

## 📝 補足

- `learning_notes/`はプロジェクトルート直下に配置し、技術的な知見やトラブル解決メモを分類して管理します。
- 各ディレクトリ・ファイルの詳細は、該当する docs ファイルを参照してください。
- 新規ファイル・ディレクトリ追加時は、このガイドに従い命名・分類してください。
