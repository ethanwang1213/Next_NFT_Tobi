import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html
      lang="ja"
      prefix="og: http://ogp.me/ns# fb: https://ogp.me/ns/fb# website: https://ogp.me/ns/website#"
    >
      <Head>
        <title>Tobiratory Admin</title>
        {/* OGP設定 */}
        <meta property="og:title" content="Tobiratory" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.tobiratory.com/admin/signin"
        />
        <meta
          property="og:image"
          content="https://www.tobiratory.com/admin/ogp/ogp.png"
        />
        <meta property="og:site_name" content="Tobiratory" />
        <meta property="og:description" content="Welcome to Tobiratory" />
        <meta name="twitter:card" content="summary_large_image" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/admin/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/admin/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/admin/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/admin/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="application-name" content="Tobiratory" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
