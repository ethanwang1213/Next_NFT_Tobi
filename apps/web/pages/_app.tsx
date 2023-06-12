import "../src/styles/globals.scss";
import { default as NextApp } from "next/app";
import type { AppProps, AppContext } from "next/app";
import React, { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { config } from "@fortawesome/fontawesome-svg-core";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AuthProvider } from "@/context/auth";
import ShowBurgerProvider from "@/context/showBurger";
import MenuAnimationProvider from "@/context/menuAnimation";
import BurgerMenu from "@/components/menu/BurgerMenu";
import LoadTransition from "@/components/global/Load";
import useWindowSize from "@/hooks/useWindowSize";
import CanvasDprProvider from "@/context/canvasDpr";
import DprController from "@/components/saidan/ui/dpr/DprController";
import basicAuthCheck from "@/methods/basicAuthCheck";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  const [isLoad, setIsLoad] = useState<boolean>(true);

  // const { mediaBorder, pcWidth, pcHeight } = globalData;
  const { displayWidth, displayHeight } = useWindowSize();

  return (
    <AuthProvider>
      <Head>
        <title>Tobiratory</title>
        {/* OGP設定 */}
        <meta property="og:title" content="Tobiratory" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tobiratory.com/" />
        <meta
          property="og:image"
          content="https://www.tobiratory.com/ogp/ogp.png"
        />
        <meta property="og:site_name" content="Tobiratory" />
        <meta property="og:description" content="Welcome to Tobiratory" />
        <meta name="twitter:card" content="summary_large_image" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/fabicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/fabicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/fabicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/fabicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/fabicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="apple-mobile-web-app-title" content="Tobiratory" />
        <meta name="application-name" content="Tobiratory" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      {/* フォントロード */}
      <Script id="font">
        {`
        (function(d) {
          var config = {
            kitId: 'ysy1ycw',
            scriptTimeout: 3000,
            async: true
          },
          h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);`}
      </Script>
      <ShowBurgerProvider>
        <MenuAnimationProvider>
          {/* メイン */}
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env["NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY"]!}
            language="ja"
          >
            <CanvasDprProvider>
              {/* <div className="absolute inset-0 z-[-100] bg-black/40"> */}
              <div
                // className="app-tab-display"
                className="overflow-x-hidden overflow-y-auto"
                style={{
                  // left: isVeryWide ? (innerWidth - pcWidth) / 2.0 : 0,
                  // top: isVeryWide ? (innerHeight - pcHeight) / 2.0 : 0,
                  width: displayWidth,
                  height: displayHeight,
                }}
              >
                <div className="relative w-full h-full">
                  <Component {...pageProps} />
                  <DprController />
                  <BurgerMenu />
                  {/* ローディング */}
                  <LoadTransition isOpen={isLoad} setOpen={setIsLoad} />
                </div>
              </div>
              {/* </div> */}
            </CanvasDprProvider>
          </GoogleReCaptchaProvider>
          {/* バーガーメニュー */}
        </MenuAnimationProvider>
      </ShowBurgerProvider>
    </AuthProvider>
  );
};

App.getInitialProps = async (appContext: AppContext) => {
  const { req, res } = appContext.ctx;
  if (req && res && process.env.ENABLE_BASIC_AUTH === "true") {
    await basicAuthCheck(req, res);
  }

  const appProps = await NextApp.getInitialProps(appContext);
  return { ...appProps };
};

export default App;
