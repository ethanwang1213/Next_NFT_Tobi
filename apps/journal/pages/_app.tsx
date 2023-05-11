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
  const [tags, setTags] = useState<tagType[]>([]);

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
    // ページ数の取得
    const profilePageNum = 2;
    // TODO: TOBIRA NEKOの数を取得する
    let nekoPageNum = 3;
    if (nekoPageNum % 2 === 1) nekoPageNum++;
    // TODO: NFTの数を取得する
    let nftPageNum = 3;
    if (nftPageNum % 2 === 1) nftPageNum++;

    // 各ページを生成し配列に格納する
    // TODO: 所有NFTが増加するほど、ページも増加していく。
    // 現状の実装では事前に生成し配列に保存するため、NFTを所有するほどメモリを喰うことになる。
    // ゆくゆくは動的にページを生成するようにしたい。
    setPages([
      <ProfilePage0 />,
      <ProfilePage1 />,
      ...[...Array(nekoPageNum)].map((_, i) => <NekoPage pageNum={i} />),
      ...[...Array(nftPageNum)].map((_, i) => <NFTPage pageNum={i} />),
      <RedeemPage pageNum={0} />,
      <RedeemPage pageNum={1} />,
    ]);

    // 各ページの開始ページ番号にタグを設定
    setTags([
      { image: "/images/icon/Profile_journal.svg", page: 0 },
      { image: "/images/icon/TOBIRANEKO_journal.svg", page: profilePageNum },
      {
        image: "/images/icon/NFTs_journal.svg",
        page: profilePageNum + nekoPageNum,
      },
      {
        image: "/images/icon/Serial_journal.svg",
        page: profilePageNum + nekoPageNum + nftPageNum,
      },
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
