import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import NFTPage from "../components/pages/NFTPage/NFTPage";
import NekoPage from "../components/pages/NekoPage/NekoPage";
import ProfilePage0 from "../components/pages/ProfilePage/ProfilePage0";
import ProfilePage1 from "../components/pages/ProfilePage/ProfilePage1";
import RedeemPage from "../components/pages/RedeemPage/RedeemPage";
import { mockNFTSrcList } from "../libs/mocks/mockNFTSrcList";
import { mockNekoSrcList } from "../libs/mocks/mockNekoSrcList";
import { bookContext, tagType } from "../types/type";
import { useAuth } from "./AuthProvider";
import Image from "next/image";
import DefaultIcon from "../public/images/icon/Profiledefault_journal.svg";

type Props = {
  children: ReactNode;
};

export const BookContext = createContext<bookContext>(null);

/**
 * 本の状態を管理するコンテキスト
 * @param param0
 * @returns
 */
const BookContextProvider: React.FC<Props> = ({ children }) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const [pages, setPages] = useState<ReactNode[]>([]);
  const [tags, setTags] = useState<tagType[]>([]);

  const { user } = useAuth();

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

  // プロフィールタグ
  // アイコンが設定されている場合はタグにもアイコンを表示する
  const profileTag = useMemo(
    () => (
      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{ border: "solid 3px white" }}
      >
        {user && user.icon !== "" && (
          <Image
            src={user.icon}
            alt="profile-tag"
            fill
            style={{ objectFit: "contain" }}
          />
        )}
      </div>
    ),
    [user]
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
      { image: profileTag, page: 0 },
      { image: "/journal/images/icon/TOBIRANEKO_journal.svg", page: nekoPageIndex },
      {
        image: "/journal/images/icon/NFTs_journal.svg",
        page: nftPageIndex,
      },
      {
        image: "/journal/images/icon/Serial_journal.svg",
        page: redeemPageIndex,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.icon === "") return;
    setTags([
      {
        image: profileTag,
        page: 0,
      },
      ...tags.slice(1),
    ]);
  }, [user]);

  return (
    <BookContext.Provider value={pageContextValue}>
      {children}
    </BookContext.Provider>
  );
};

export default BookContextProvider;
