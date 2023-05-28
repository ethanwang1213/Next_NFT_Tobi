import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html
    lang="ja"
    prefix="og: http://ogp.me/ns# fb: https://ogp.me/ns/fb# website: https://ogp.me/ns/website#"
  >
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
