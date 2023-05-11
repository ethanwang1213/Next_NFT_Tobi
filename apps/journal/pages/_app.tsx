import type { AppProps } from "next/app";
import "../styles/global.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import RedeemStatusContextProvider from "../contexts/RedeemContextProvider";
import BookContextProvider from "../contexts/BookContextProvider";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <BookContextProvider>
      <RedeemStatusContextProvider>
        <Component {...pageProps} />
      </RedeemStatusContextProvider>
    </BookContextProvider>
  );
};

export default App;
