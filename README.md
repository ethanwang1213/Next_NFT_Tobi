# Tobiratory Web Project

This is a monorepo project for Next.js applications with shared components and utilities, using Turborepo. This project is intended for team development.

## Prerequisites

- Node.js v14 or later
- npm v6 or later
- Git

## Getting Started

To set up the project for local development, follow these steps:

1. Clone the repository:

```
git clone https://github.com/tobira-project/tobiratory-web.git
cd your-repo
```

2. Install the dependencies:

```
npm install
```

3. To start a specific application run:

```
npm run dev
```

## Development Workflow

1. 機能のための新しいブランチを作成する:

```
git checkout -b feature/hoge
```

2. 変更を加え、コミットして feature ブランチにプッシュします:

```
git add .
git commit -m "feat: feature description"
git push origin feature/hoge
```

3. GitHub に feature ブランチのプルリクエストを作成します.

4. プルリクエストが少なくとも一人のチームメンバーによってレビューされ、承認されたら、`main`ブランチにマージすることができます.

## Commits Rules

[Conventional Commits](https://www.conventionalcommits.org/)の仕様に緩く従い、コミット履歴をより読みやすく、簡単にたどれるようにします。変更をコミットする際は、以下のガイドラインに緩くでもいいので従うと良きです:

1. コミットメッセージに次のタイプのいずれかを接頭辞として付けてください:

   - `feat`: 新機能
   - `fix`: 諸々の修正
   - `docs`: ドキュメントのみの変更
   - `style`: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの欠落など）
   - `refactor`: バグ修正も機能追加も行わないコード変更つまりリファクタ。
   - `test`: テストの追加や既存テストの修正
   - `chore`: src や test ファイルを変更しないその他の変更が本来の意味ですが、軽微な修正とかこれで良き。
   - `revert`: 以前のコミットを取り消す

2. コミットメッセージに変更の簡単な説明を含める。

以下は、「メインページに検索機能を追加する」というコミットのコミットメッセージの例です:

```
feat: add search functionality to the main page
```

## Pull Request Merging Strategy

Git の履歴をきれいに保つため、Pull Request をマージする際には以下のガイドラインを参考にしますが全てこの限りではないです。：

1. bugfixes やちょっとした改善など、小さな変更には"Squash and merge"を使用する。
2. "Create a merge commit” をする場合は、定期的なマージによって `main` ブランチと最新の状態に保たれている、長く続いている機能ブランチをマージする場合にのみ使用します。

Pull Request には、レビュアーがあなたの変更を理解しやすいように、明確で簡潔なタイトルと説明を可能な限り書きましょう。

## Design Pattern

think about later.

## What's inside?

This Turborepo uses [npm](https://www.npmjs.com/) as a packages manager. It includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `ui`: a stub React component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Setup

This repository can be used by running `npx create-turbo@latest`, and selecting `npm` in the terminal prompt,
or you can also download this folder like all the other examples with:

```sh
npx degit vercel/turbo/examples/with-npm with-npm
cd with-npm
npm install
git init . && git add . && git commit -m "Init"
```

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
npm run dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
