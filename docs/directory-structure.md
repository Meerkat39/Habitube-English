# Habitube English - ディレクトリ構成例

## 📁 プロジェクト全体構成

```
habitube-english/
├── src/                        # アプリケーション本体
│   ├── app/                   # Next.js App Router（ページ・API）
│   ├── lib/                   # ユーティリティ関数
│   ├── types/                 # 型定義
│   ├── styles/                # グローバルCSS
│   └── components/            # UIコンポーネント
├── public/                     # 静的ファイル（画像・SVG等）
├── learning_notes/             # 学習メモ・技術知見
│   ├── concepts/             # 概念・理論
│   ├── implementations/      # 実装関連
│   ├── troubleshooting/      # 問題解決
│   └── tips/                 # Tips・便利技
├── docs/                       # プロジェクトドキュメント
│   ├── features.md           # 機能仕様書
│   ├── technical-specs.md    # 技術仕様書
│   ├── database-design.md    # DB設計書
│   ├── ai-guidelines.md      # AIガイドライン
│   ├── learning-notes-guide.md # 学習メモ作成ルール
│   ├── directory-structure.md  # ディレクトリ構成ガイド（このファイル）
├── package.json                # npmパッケージ管理
├── tsconfig.json               # TypeScript設定
├── next.config.ts              # Next.js設定
├── README.md                   # プロジェクト概要
```

---

## 📝 補足

- `learning_notes/`はプロジェクトルート直下に配置し、技術的な知見やトラブル解決メモを分類して管理します。
- 各ディレクトリ・ファイルの詳細は、該当する docs ファイルを参照してください。
- 新規ファイル・ディレクトリ追加時は、このガイドに従い命名・分類してください。
