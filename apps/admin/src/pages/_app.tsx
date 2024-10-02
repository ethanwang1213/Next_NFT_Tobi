import "@/styles/CropStyles.css";
import "@/styles/global.scss";
import "@/styles/globalicons.css";
import "@/styles/PublicSwitch.css";
import "@/styles/Spinner.css";
import "@/styles/TabView.css";
import "@/styles/TripleToggleSwitch.scss";
import type { AppContext, AppProps } from "next/app";
import { default as NextApp } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "react-easy-crop/react-easy-crop.css";
import "swiper/css";
import "swiper/css/effect-cards";

import basicAuthCheck from "@/methods/basicAuthCheck";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { M_PLUS_2 } from "@next/font/google";
import { LeavePageProvider } from "contexts/LeavePageProvider";
import useRestfulAPI from "hooks/useRestfulAPI";
import Script from "next/script";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FcmTokenComp from "ui/organisms/admin/firebaseForeground";
import Layout from "ui/organisms/admin/Layout";

config.autoAddCss = false;

const font = M_PLUS_2({ subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
  const apiUrl = "native/admin/content";
  const { loading, error, getData } = useRestfulAPI(apiUrl);
  const router = useRouter();

  useEffect(() => {
    getData(apiUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag("config", gaId, {
          page_path: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // Load GA4 script
    const gaScript = document.createElement("script");
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    gaScript.async = true;
    document.head.appendChild(gaScript);

    // Initialize GA
    gaScript.onload = () => {
      if (window.gtag) {
        window.gtag("js", new Date());
        window.gtag("config", gaId, {
          page_path: window.location.pathname,
        });
      }
    };

    // Clean up event handler and script
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      document.head.removeChild(gaScript);
    };
  }, [router.events]);

  if (loading) {
    return (
      <>
        <main className={font.className}>
          <div className={"h-[100dvh] flex justify-center"}>
            <span className={"loading loading-spinner text-info loading-md"} />
          </div>
        </main>
      </>
    );
  }
  return (
    <>
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-91QHLJNXPV');
          `,
        }}
      />
      <main className={font.className}>
        <Layout content={error}>
          <FcmTokenComp />
          <LeavePageProvider>
            <Component {...pageProps} />
          </LeavePageProvider>
          <ToastContainer
            position="bottom-center"
            autoClose={7000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover
            transition={Slide}
            closeButton={true}
            theme="colored"
          />
        </Layout>
      </main>
    </>
  );
};

/*
  FIXME: yukky: そもそもですが、getInitialProps は、getStaticProps or getServerSideProps
         で代わりに実装できる様になっているので基本的にgetInitialPropsはdeprecatedなので使わない方が良いです。
         その上で「vercelでbasic認証」がgetInitialPropsでしかできないことはないはずなので
         こちら別途具体story系にどういうerrorが出ているかみてほしいです。
 */
App.getInitialProps = async (appContext: AppContext) => {
  const { req, res } = appContext.ctx;
  if (req && res && process.env.ENABLE_BASIC_AUTH === "true") {
    await basicAuthCheck(req, res);
  }
  const appProps = await NextApp.getInitialProps(appContext);
  return { ...appProps };
};

export default App;
