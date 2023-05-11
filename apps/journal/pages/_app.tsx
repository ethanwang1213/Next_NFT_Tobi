import type { AppProps } from "next/app";
import "../styles/global.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { bookContext, tagType } from "../types/type";
import ProfilePage0 from "../components/pages/ProfilePage/ProfilePage0";
import ProfilePage1 from "../components/pages/ProfilePage/ProfilePage1";
import NekoPage from "../components/pages/NekoPage/NekoPage";
import NFTPage from "../components/pages/NFTPage/NFTPage";
import RedeemStatusContextProvider from "../contexts/RedeemContextProvider";
import RedeemPage from "../components/pages/RedeemPage/RedeemPage";

config.autoAddCss = false;

export const BookContext = createContext<bookContext>(null);

const App = ({ Component, pageProps }: AppProps) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const [pages, setPages] = useState<ReactNode[]>([]);
  const [tags, setTags] = useState<tagType[]>([
    { image: "/images/icon/Profile_journal.svg", page: 0 },
    { image: "/images/icon/TOBIRANEKO_journal.svg", page: 2 },
    { image: "/images/icon/NFTs_journal.svg", page: 4 },
    { image: "/images/icon/Serial_journal.svg", page: 6 },
  ]);

  const pageContextValue = useMemo(
    () => ({
      pageNo: {
        current: pageNo,
        set: setPageNo,
      },
      pages: {
        current: pages,
        set: setPages,
      },
      tags: {
        current: tags,
        set: setTags,
      },
    }),
    [pageNo, pages, tags, setPageNo, setPages, setTags]
  );

  useEffect(() => {
    // TODO: TOBIRA NEKOの数を取得する
    // TODO: 奇数の時に空白ページを入れる
    const nekoPages = 2;
    // TODO: NFTの数を取得する
    // TODO: 奇数の時に空白ページを入れる
    const nftPages = 2;
    setPages([
      <ProfilePage0 />,
      <ProfilePage1 />,
      ...[...Array(nekoPages)].map((_, i) => <NekoPage pageNum={i} />),
      ...[...Array(nftPages)].map((_, i) => <NFTPage pageNum={i} />),
      <RedeemPage pageNum={0} />,
      <RedeemPage pageNum={1} />,
    ]);
  }, []);

  return (
    <BookContext.Provider value={pageContextValue}>
      <RedeemStatusContextProvider>
        <Component {...pageProps} />
      </RedeemStatusContextProvider>
    </BookContext.Provider>
  );
};

export default App;
