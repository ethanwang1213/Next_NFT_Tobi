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
import { mockNekoSrcList } from "../libs/mocks/mockNekoSrcList";
import { mockNFTSrcList } from "../libs/mocks/mockNFTSrcList";

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
    // TODO: TOBIRA NEKOの数を取得する
    let nekoPageNum = Math.trunc(mockNekoSrcList.length / 4);
    if (mockNekoSrcList.length % 4 !== 0) nekoPageNum++; // 余りがある場合はページ数を+1
    if (nekoPageNum === 0) nekoPageNum = 1; // ページ数0の場合は1ページとする
    if (nekoPageNum % 2 === 1) nekoPageNum++; // 奇数ページならページ数+1

    // TODO: NFTの数を取得する
    let nftPageNum = Math.trunc(mockNFTSrcList.length / 9);
    if (mockNFTSrcList.length % 9 !== 0) nftPageNum++; // 余りがある場合はページ数を+1
    if (nftPageNum === 0) nftPageNum = 1; // ページ数0の場合は1ページとする
    if (nftPageNum % 2 === 1) nftPageNum++; // 奇数ページならページ数+1

    // 各ページの開始ページ番号を設定
    const profilePageNum = 2;
    const nekoPageIndex = profilePageNum;
    const nftPageIndex = nekoPageIndex + nekoPageNum;
    const redeemPageIndex = nftPageIndex + nftPageNum;

    // 各ページを生成し配列に格納する
    // TODO: 所有NFTが増加するほど、ページも増加していく。
    // 現状の実装では事前に生成し配列に保存するため、NFTを所有するほどメモリを喰うことになる。
    // ゆくゆくは動的にページを生成するようにしたい。
    setPages([
      <ProfilePage0 key={0} />,
      <ProfilePage1 key={1} />,
      ...[...Array(nekoPageNum)].map((_, i) => (
        <NekoPage pageNum={i} key={nekoPageIndex + i} />
      )),
      ...[...Array(nftPageNum)].map((_, i) => (
        <NFTPage pageNum={i} key={nftPageIndex + i} />
      )),
      <RedeemPage pageNum={0} key={redeemPageIndex + 0} />,
      <RedeemPage pageNum={1} key={redeemPageIndex + 1} />,
    ]);

    // 各ページの開始ページ番号にタグを設定
    setTags([
      { image: "/images/icon/Profile_journal.svg", page: 0 },
      { image: "/images/icon/TOBIRANEKO_journal.svg", page: nekoPageIndex },
      {
        image: "/images/icon/NFTs_journal.svg",
        page: nftPageIndex,
      },
      {
        image: "/images/icon/Serial_journal.svg",
        page: redeemPageIndex,
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
