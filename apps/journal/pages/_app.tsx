import { default as NextApp } from "next/app";
import type { AppProps, AppContext } from "next/app";

import "../styles/global.scss";
import "react-easy-crop/react-easy-crop.css";
import "swiper/css";
import "swiper/css/effect-cards";

import Script from "next/script";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import RedeemStatusContextProvider from "@/contexts/RedeemContextProvider";
import BookContextProvider from "@/contexts/BookContextProvider";
import { EditProfileProvider } from "@/contexts/EditProfileProvider";
import { HoldNFTsProvider } from "@/contexts/HoldNFTsProvider";
import { ActivityRecordProvider } from "@/contexts/ActivityRecordProvider";
import DebugProvider from "@/contexts/DebugProvider";
import { DiscordOAuthProvider } from "@/contexts/DiscordOAuthProvider";
import basicAuthCheck from "@/methods/basicAuthCheck";
import Head from "next/head";
import {
  BurgerMenu,
  ShowBurgerProvider,
  MenuAnimationProvider,
  MenuButtonLayout,
} from "ui";
import SoundToggle from "@/components/SoundToggle";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Tobiratory Journal</title>
        {/* OGP設定 */}
        <meta property="og:title" content="Tobiratory" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.tobiratory.com/journal/login"
        />
        <meta
          property="og:image"
          content="https://www.tobiratory.com/journal/ogp/ogp.png"
        />
        <meta property="og:site_name" content="Tobiratory" />
        <meta property="og:description" content="Welcome to Tobiratory" />
        <meta name="twitter:card" content="summary_large_image" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/journal/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/journal/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/journal/favicon-16x16.png"
        />
        <link rel="manifest" href="/journal/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/journal/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="apple-mobile-web-app-title" content="Tobiratory" />
        <meta name="application-name" content="Tobiratory" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Script id="font">
        {`(function(d) {
          var config = {
            kitId: 'ysy1ycw',
            scriptTimeout: 3000,
            async: true
          },
          h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);`}
      </Script>
      <AuthProvider>
        <ActivityRecordProvider>
          <HoldNFTsProvider>
            <RedeemStatusContextProvider>
              <EditProfileProvider>
                <BookContextProvider>
                  <DiscordOAuthProvider>
                    <ShowBurgerProvider>
                      <MenuAnimationProvider>
                        <DebugProvider>
                          <div className="overflow-hidden relative">
                            <Component {...pageProps} />
                            {/* 右上メニューボタン配置 */}
                            <MenuButtonLayout>
                              <BurgerMenu />
                              <SoundToggle />
                            </MenuButtonLayout>
                          </div>
                        </DebugProvider>
                      </MenuAnimationProvider>
                    </ShowBurgerProvider>
                  </DiscordOAuthProvider>
                </BookContextProvider>
              </EditProfileProvider>
            </RedeemStatusContextProvider>
          </HoldNFTsProvider>
        </ActivityRecordProvider>
      </AuthProvider>
    </>
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
