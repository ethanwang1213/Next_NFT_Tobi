import type { AppContext, AppProps } from "next/app";
import { default as NextApp } from "next/app";

import "react-easy-crop/react-easy-crop.css";
import "swiper/css";
import "swiper/css/effect-cards";
import "../styles/global.scss";

import basicAuthCheck from "@/methods/basicAuthCheck";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Layout from "ui/organisms/admin/Layout";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Layout>
        <div className="overflow-hidden relative">
          <Component {...pageProps} />
        </div>
      </Layout>
    </>
  );
};

App.getServerSideProps = async (appContext: AppContext) => {
  const { req, res } = appContext.ctx;
  if (req && res && process.env.ENABLE_BASIC_AUTH === "true") {
    await basicAuthCheck(req, res);
  }
  const appProps = await NextApp.getInitialProps(appContext);
  return { ...appProps };
};

export default App;
