# Tobiratory Homepage

Tobiratoryのホームページ  

主なページは、home, saidan, about us, contactの4つ  
- home: プロジェクトの紹介ページ
  - WebGL(React-Three-Fiber)による3D表示
  - 下スクロール操作で画面が遷移していく  
- saidan: SAIDAN機能のデモページ
  - 投稿した画像からグッズを生成する機能
    - アクリルスタンドは、image2model APIによって生成
  - 3D空間上にグッズを飾る機能
    - グッズの種類: アクリルスタンド・缶バッジ・ポスター
- about us: Tobiratoryのより詳細な説明ページ
- contact: お問い合わせページ
  - 投稿された内容は、google spread sheetへ保存

Next.js+TypeScriptで開発
- 状態管理ライブラリ: zustand
- WebGLライブラリ: React-Three-Fiber
- アニメーションライブラリ: React-Spring, gsap (gsapへ今後移行予定)
- css系ライブラリ: saas, TailwindCSS, daisyUI
- バックエンド: firebase
- ホスティング: vercel
  
## 開発上の注意

https://github.com/tobira-project/homepage/pull/9 参照

⚠ 注意 ⚠
gsap をライセンス版に変えていますので、.npmrc をプロジェクトの root に作成していただき、greensock にログイン後、アカウントダッシュボードに行くと書き込む内容が表示されますので、コピーして貼り付けてください。
（垢凍結が解除されたら npmrc ファイルをアップロードしておきます）

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
