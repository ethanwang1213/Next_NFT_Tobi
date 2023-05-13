# Firebase Cloud Functions

## About

以下の用途で使用する functions を実装しています

- Shopページの背景に表示するパラメタを返却する
- Shopifyから、決済完了時に注文情報を受け取り、NFTの引き換えコードを生成する

## Setup

事前に、以下のセットアップが必要です

- Shopifyのカスタムアプリを設定し、Admin APIのアクセストークンを取得する
- Pub/Subのトピックを生成
- Shopifyの決済完了時に、Pub/Subのトピックに通知するWebhookを設定する
- Sendgridのセットアップ、送信者の設定
- SendgridのAPIキーを取得する
- Pub/Subのトピック、SendgridのAPIキーを、Firebaseの環境変数に設定する

環境変数は、下記コマンドにて .env ファイルを生成し、編集してください。開発用のサンプルデータは keybase の tobiratory.dev/02_tobiratory-web/firebase に保存してあります。

```sh
$ cp .env.sample .env
```

## Develop

ローカルで開発、検証を行う場合は、下記コマンドを実行してください。ローカル上にauth, pubsub, firestore, functions emulatorが起動します。

```sh
$ npm run serve

┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000/               │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Functions      │ 127.0.0.1:5001 │ http://127.0.0.1:4000/functions │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Pub/Sub        │ 127.0.0.1:8085 │ n/a                             │
└────────────────┴────────────────┴─────────────────────────────────┘
```

Shopifyの決済完了通知をシミュレーションするには、下記のような curl コマンドを実行してください。

```sh
$ curl http://localhost:5001/tobiratory-f6ae1/us-central1/pubsubHelper \
    -X POST \
    -H "Content-Type:application/json" \
    -d '{ "email": "username@gmail.com", "name": "#1001", "items": [{"name":"TOBIRA NEKO #1"}, {"name":"TOBIRA NEKO #2"}] }'
```
