import type { AppContext, AppProps } from "next/app";
import { default as NextApp } from "next/app";

import "@/styles/CropStyles.css";
import "@/styles/global.scss";
import "@/styles/globalicons.css";
import "@/styles/PublicSwitch.css";
import "@/styles/Spinner.css";
import "@/styles/TabView.css";
import "@/styles/TripleToggleSwitch.scss";
import "react-easy-crop/react-easy-crop.css";
import "swiper/css";
import "swiper/css/effect-cards";

import basicAuthCheck from "@/methods/basicAuthCheck";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { M_PLUS_2 } from "@next/font/google";
import { LeavePageProvider } from "contexts/LeavePageProvider";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FcmTokenComp from "ui/organisms/admin/firebaseForeground";
import Layout from "ui/organisms/admin/Layout";

config.autoAddCss = false;

const font = M_PLUS_2({ subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
  const apiUrl = "native/admin/content";
  const {loading, error, getData } = useRestfulAPI(apiUrl);

  useEffect(() => {
    getData(apiUrl);
  }, [getData, apiUrl]);

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
      <main className={font.className}>
        <Layout content={error}>
          <FcmTokenComp />
          <LeavePageProvider>
            <Component {...pageProps} />
          </LeavePageProvider>
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover
            transition={Slide}
            closeButton={false}
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
