# ICPC Replay

ICPC (International Collegiate Programming Contest) の順位変動を時系列で可視化するWebアプリケーションです。[AtCoder Replay](https://atcoder-replay.kakira.dev/) にインスパイアされて作成されました。

**URL:** [https://icpc-replay.vercel.app/](https://icpc-replay.vercel.app/)

## 概要 (Overview)

競技プログラミングコンテスト ICPC の順位表データを解析し、コンテスト中の順位変動やスコアの推移をリプレイ形式で再生することができます。

主な機能:
- 各チームの提出状況と順位変動の可視化
- 特定の時点へのシーク機能
- [icpc_standings](https://github.com/shogo314/icpc_standings) を利用したHTMLからJSONへのデータ変換

## 使用技術 (Tech Stack)

- **Frontend:** Next.js
- **Hosting/Deployment:** Vercel
- **Package Manager:** npm

## 必要条件 (Prerequisites)

ローカル環境で実行するためには、以下のツールが必要です。

- Node.js: v24 (LTS) または v25系
- npm

## 環境構築 (Installation)

1.  リポジトリをクローンします。

```bash
git clone [https://github.com/shogo314/icpc-replay.git](https://github.com/shogo314/icpc-replay.git)
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

### 本番環境

master ブランチへのプッシュをトリガーに、Vercel へ自動デプロイされます。

## 今後の展望 (Roadmap) / コントリビューション

現在は基本的な可視化機能を実装していますが、以下の点での改善や機能追加を歓迎します。

- **UI/UXの改善:** より直感的でモダンなデザインへのアップデート
- **共有機能:** SNSにアップロードしやすくする／画像をダウンロードできるようにする

IssueやPull Requestによる報告・修正をお待ちしています。

## 作者 (Author)

- [shogo314](https://github.com/shogo314)
