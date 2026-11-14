# ICPC Replay

ICPC (International Collegiate Programming Contest) の順位変動を時系列で可視化するWebアプリケーションです。[AtCoder Replay](https://atcoder-replay.kakira.dev/) にインスパイアされて作成されました。

**URL:** [https://icpc-replay.vercel.app/](https://icpc-replay.vercel.app/)

## 概要 (Overview)

競技プログラミングコンテスト ICPC の順位表データを解析し、コンテスト中の順位変動やスコアの推移をリプレイ形式で再生することができます。

主な機能:
- 各チームの提出状況と順位変動の可視化
- 特定の時点へのシーク機能

## 今シーズンの大会日程（2026–2027）

日本国内予選とAsia Pacific地域の主な大会日程です（2026年11月14日確認）。地域大会の日付は、競技本番だけでなく受付・練習などを含む開催期間です。

| 日程 | 大会 | 開催地 |
| --- | --- | --- |
| 2026年7月3日 16:30–19:30（日本時間） | [日本国内予選](https://icpc.jp/2026/) | 各大学等 |
| 2026年11月13–14日 | Asia Seoul Regional | 韓国・ソウル |
| 2026年11月28–30日 | Asia Jakarta Regional | インドネシア・ジャカルタ |
| 2026年12月5–6日 | [Asia Yokohama Regional](https://icpc.jp/2026/) | 日本・横浜産貿ホール |
| 2026年12月10–11日 | Asia Danang Regional | ベトナム・ダナン |
| 2026年12月12–14日 | Asia Yunlin Regional | 台湾・雲林 |

地域大会の日程と各大会公式サイトへのリンクは、[ICPC Asia Pacific公式の地域大会一覧](https://apac.icpc.global/regionals/)で確認できます。同ページでは、上位チームの進出先として2027 Asia Pacific Championship（東京）が案内されています。Championshipの日程は、参照したページには掲載されていません。

日程は変更される場合があるため、参加・観戦前に公式サイトで最新情報を確認してください。この日程表には、ICPC Replayに順位表データを収録していない大会も含みます。

## 使用技術 (Tech Stack)

- **Frontend:** Next.js
- **Hosting/Deployment:** Cloudflare Pages（静的出力）
- **Package Manager:** npm

## 必要条件 (Prerequisites)

ローカル環境で実行するためには、以下のツールが必要です。

- Node.js: v24 (LTS) または v25系
- npm

## 環境構築 (Installation)

1.  リポジトリをクローンします。

```bash
git clone https://github.com/shogo314/icpc-replay.git
cd icpc-replay
```

2.  依存関係をインストールします。

```bash
npm install
```

## 使用方法 (Usage)

### 開発環境での実行

以下のコマンドを実行すると、ローカルサーバーが起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして動作を確認してください。

### 本番環境（Cloudflare Pages）

Next.jsの静的出力をCloudflare Pagesに配信します。`npm run build` で `out/` にHTML・JavaScript・順位表JSONが生成されます。静的ファイルの配信にはNext.jsサーバーは不要です。

Cloudflareのダッシュボードから **Workers & Pages → Create application → Pages → Import an existing Git repository** を選び、このリポジトリを接続します。

| 設定 | 値 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | リポジトリのルート |
| Environment variable | `NODE_VERSION=24` |

接続後は `main` ブランチへのプッシュで自動デプロイされます。設定方法は[Cloudflare公式ガイド](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)を参照してください。

移行時は、PagesのデプロイURLでトップページ・チーム選択後の `/chart?contest=...&team=...`・`/json` とJSONファイルの表示を確認し、必要なカスタムドメインを設定します。公開を確認してから、README冒頭のURLを更新し、Vercel側の自動デプロイを停止してください。

## 今後の展望 (Roadmap) / コントリビューション

現在は基本的な可視化機能を実装していますが、以下の点での改善や機能追加を歓迎します。

- **UI/UXの改善:** より直感的でモダンなデザインへのアップデート
- **共有機能:** SNSにアップロードしやすくする／画像をダウンロードできるようにする

IssueやPull Requestによる報告・修正をお待ちしています。

## 作者 (Author)

- [shogo314](https://github.com/shogo314)
