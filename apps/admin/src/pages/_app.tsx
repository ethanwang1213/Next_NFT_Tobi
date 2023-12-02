import type { AppContext, AppProps } from "next/app";
import { default as NextApp } from "next/app";

import "react-easy-crop/react-easy-crop.css";
import "swiper/css";
import "swiper/css/effect-cards";
import "../styles/global.scss";

import basicAuthCheck from "@/methods/basicAuthCheck";
import FontLoader from "@/pages/fontLoader";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AuthProvider } from "contexts/admin-AuthProvider";
import Header from "./header";
import Navbar from "./navbar";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Header />
      <FontLoader />
      <AuthProvider>
        <Navbar />
        <div className="overflow-hidden relative">
          <Component {...pageProps} />
        </div>
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
