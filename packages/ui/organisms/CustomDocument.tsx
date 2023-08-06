import { Html, Head, Main, NextScript } from "next/document";

/**
 * _document.tsxの共通化用コンポーネント
 * サービス固有の設定が必要な場合は、このコンポーネントにpropsを渡して設定する
 * @returns
 */
export const CustomDocument = () => {
  return (
    <Html
      lang="ja"
      prefix="og: http://ogp.me/ns# fb: https://ogp.me/ns/fb# website: https://ogp.me/ns/website#"
    >
      <Head />
      <body className="font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
