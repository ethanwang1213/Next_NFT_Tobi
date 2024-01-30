# Firebase Cloud Functions

## About

以下の用途で使用する functions を実装しています

- Shopページの背景に表示するパラメタを返却する
- Shopifyから、決済完了時に注文情報を受け取り、NFTの引き換えコードを生成する
- Tobiratory Appのネイティブアプリのバックエンドを提供する

## Setup

事前に、以下のセットアップが必要です

- Shopifyのカスタムアプリを設定し、Admin APIのアクセストークンを取得する
- Pub/Subのトピックを生成
- Shopifyの決済完了時に、Pub/Subのトピックに通知するWebhookを設定する
- Sendgridのセットアップ、送信者の設定
- SendgridのAPIキーを取得する
- Pub/Subのトピック、SendgridのAPIキーを、Firebaseの環境変数に設定する
- PostgresSQLのセットアップ、接続情報を環境変数に設定する

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

<br />

`Error: No project active, but project aliases are available.`
のように表示されてエミュレーターが起動できない場合は、下記コマンドを実行してください。

`$ firebase use default`

<br />

Shopifyの決済完了通知をシミュレーションするには、下記のような curl コマンドを実行してください。

```sh
$ curl http://localhost:5001/tobiratory-f6ae1/asia-northeast1/devtool-pubsubHelper \
    -X POST \
    -H "Content-Type:application/json" \
    -d '{ "topicName": "shopify-orders-create", "email": "username@gmail.com", "name": "#1001", "payment_gateway_names":"暗号資産", "total_price": 300, "currency": "USD", "line_items": [{"name":"TOBIRA NEKO #00031", "price":"150", "quantity":1}, {"name":"TOBIRA NEKO #00032", "price":"150", "quantity":1}], "billing_address": {"name": "username"}}'
```

```sh
$ curl http://localhost:5001/tobiratory-f6ae1/asia-northeast1/devtool-pubsubHelper \
    -X POST \
    -H "Content-Type:application/json" \
    -d '{ "topicName": "shopify-orders-paid", "email": "username@gmail.com", "name": "#1001", "line_items": [{"name":"TOBIRA NEKO #00031"}, {"name":"TOBIRA NEKO #00032"}] }'
```


## Tobiratory Native App

Tobiratory Native Appのバックエンドを提供するため、下記のAPIを実装しています。

### API

Tobiratory App API Design
https://docs.google.com/spreadsheets/d/1XocLkxnpYL2Mfi-e7LuJOlmf_Njdgaz-0RfgqRxqtiE/edit#gid=0

### Setup

一部の環境変数をSecret Managerから取得するため、firebase-toolsでログインしてください。

```sh
$ firebase login
```

また、秘密鍵の暗号化と復号化に、Cloud KMSを使用しています。
Cloud KMSのアクセス権限を取得するため、serviceAccountのキーファイルをkeybase(tobiratory.dev\02_tobiratory-web\firebase)から取得し、環境変数に設定してください。

下記は、キーファイルを serviceAccount.json に保存した場合の例です。

```sh
$ export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
```

ローカルでPostgreSQLを起動する場合は、下記コマンドを実行してください。

```sh
$ cd docker
$ docker-compose up
```

### Develop

```sh
$ npm run serve
```

### Deploy

```sh
$ npm run deploy-dev-native-api
```

### Modify SECRETs

Secret Managerに保存されているSECRETを変更する場合は、下記コマンドを参考に実行してください。

```sh
firebase functions:secrets:set KMS_PROJECT_ID
firebase functions:secrets:set KMS_OPERATION_KEYRING
firebase functions:secrets:set KMS_OPERATION_KEY
firebase functions:secrets:set KMS_OPERATION_KEY_LOCATION
firebase functions:secrets:set KMS_USER_KEYRING
firebase functions:secrets:set KMS_USER_KEY
firebase functions:secrets:set KMS_USER_KEY_LOCATION
firebase functions:secrets:set FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS
firebase functions:secrets:set FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID
firebase functions:secrets:set FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH
firebase functions:secrets:set FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN
firebase functions:secrets:set FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY
```
