# ICPC Replay

[ICPC Replay を開く](https://icpc-replay.pages.dev/)

## 概要 (Overview)

ICPCの日本国内予選やアジアの地域大会などで、各チームの順位が競技中にどう変わったかをグラフでたどれます。[AtCoder Replay](https://atcoder-replay.kakira.dev/) に着想を得て作成しました。

シーズン別の一覧から大会を選び、比較したいチームを選んで「Show chart」を押します。グラフ上の点にカーソルを合わせると、その時点の順位と、その時刻に解いた問題を確認できます。各大会の元データは[順位表JSON一覧](https://icpc-replay.pages.dev/json)から閲覧できます。

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

### グラフ画像をXに投稿する

グラフの下にある共有ボタンを使います。画像は画面サイズにかかわらず1200×675ピクセル（16:9）のPNGで、大会名と選んだチームの凡例が入ります。投稿文には大会名・`#ICPCReplay`・同じチームのグラフを開くURLが入ります。表示されたボタンに合わせて操作してください。

- **「グラフ画像を共有」** を押すと、端末の共有メニューが開きます。共有先にXを選び、投稿画面で画像と本文を確認して「ポスト」を押します。端末やXアプリによっては画像だけが渡ることがあります。その場合は投稿前に本文を追記できます。
- **「画像をコピーしてXを開く」** を押すと、画像がコピーされ、本文を入力済みの投稿画面が開きます。投稿欄で `Ctrl+V`（Macは `⌘V`）を押すか、スマホでは投稿欄を長押しして貼り付けます。グラフのプレビューを確認して「ポスト」を押します。

投稿画面が開かなかった場合は、グラフの下に表示される「Xの投稿画面を開く」を押してください。画像の共有やコピーに失敗した場合は「PNGを保存」を選び、保存した画像を投稿画面に添付できます。

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

### Seoul大会の順位表データを更新する

`~/icpc_standings` で、ブラウザに描画された順位表を `html/2026 ICPC Asia Seoul Regional.html` に保存した後、このリポジトリで以下を実行します。

```bash
python3 tools/import_seoul.py --year 2026
npm run build
```

`icpc_standings/seoul.py` でHTMLを変換し、順位表JSONのコピーと大会選択欄への登録を行います。別の場所にデータ管理リポジトリがある場合は `--source PATH` を指定します。変換にはPythonとBeautifulSoup4が必要です。開催中・凍結中の順位表は最終結果とは限らないため、公開前に保存時点を確認してください。

## 今後の展望 (Roadmap) / コントリビューション

現在は基本的な可視化機能を実装していますが、以下の点での改善や機能追加を歓迎します。

- **UI/UXの改善:** より直感的でモダンなデザインへのアップデート

IssueやPull Requestによる報告・修正をお待ちしています。

## 作者 (Author)

- [shogo314](https://github.com/shogo314)
