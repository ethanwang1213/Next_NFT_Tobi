import {
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import NFTPage from "../components/pages/NFTPage/NFTPage";
import NekoPage from "../components/pages/NekoPage/NekoPage";
import ProfilePage0 from "../components/pages/ProfilePage/ProfilePage0";
import ProfilePage1 from "../components/pages/ProfilePage/ProfilePage1";
import RedeemPage from "../components/pages/RedeemPage/RedeemPage";
import { BookIndex, bookContext, tagType } from "../types/type";
import { useAuth } from "./AuthProvider";
import Image from "next/image";
import { useRouter } from "next/router";
import { useHoldNFTs } from "./HoldNFTsProvider";

type Props = {
  children: ReactNode;
};

export const BookContext = createContext<bookContext>(null);

/**
 * 本の状態を管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
const BookContextProvider: React.FC<Props> = ({ children }) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const [pages, setPages] = useState<ReactNode[]>([]);
  const [tags, setTags] = useState<tagType[]>([]);
  const [isMute, setIsMute] = useState<boolean>(false);

  const [bookIndex, setBookIndex] = useState<BookIndex>({
    profilePage: {
      start: 0,
      end: 0,
    },
    nekoPage: {
      start: 0,
      end: 0,
    },
    nftPage: {
      start: 0,
      end: 0,
    },
    redeemPage: {
      start: 0,
      end: 0,
    },
  });

  const router = useRouter();
  const logoutModal = useRef<HTMLInputElement>();

  const { user } = useAuth();
  const { nekoNFTs, otherNFTs } = useHoldNFTs();

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
      isMute: {
        current: isMute,
        set: setIsMute,
      },
      bookIndex: bookIndex,
    }),
    [
      pageNo,
      pages,
      tags,
      isMute,
      bookIndex,
      setPageNo,
      setPages,
      setTags,
      setIsMute,
    ]
  );

  // プロフィールタグ
  // アイコンが設定されている場合はタグにもアイコンを表示する
  const profileTag = useMemo(
    () => (
      <div className="relative w-full h-full rounded-full overflow-hidden">
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
    const profilePageNum = 2;

    let nekoPageNum = Math.trunc(nekoNFTs.current.length / 4);
    if (nekoNFTs.current.length % 4 !== 0) nekoPageNum++; // 余りがある場合はページ数を+1
    if (nekoPageNum === 0) nekoPageNum = 1; // ページ数0の場合は1ページとする
    if (nekoPageNum % 2 === 1) nekoPageNum++; // 奇数ページならページ数+1

    let nftPageNum = Math.trunc(otherNFTs.current.length / 9);
    if (otherNFTs.current.length % 9 !== 0) nftPageNum++; // 余りがある場合はページ数を+1
    if (nftPageNum === 0) nftPageNum = 1; // ページ数0の場合は1ページとする
    if (nftPageNum % 2 === 1) nftPageNum++; // 奇数ページならページ数+1

    // 各ページの開始ページ番号を設定
    const profilePageIndex = 0;
    const nekoPageIndex = profilePageIndex + profilePageNum;
    const nftPageIndex = nekoPageIndex + nekoPageNum;
    const redeemPageIndex = nftPageIndex + nftPageNum;

    // nekoやnftのページ数が増えたとき、それより後ろにいる場合は追加分だけページ番号をずらす
    const nekoIncreases =
      nekoPageNum > bookIndex.nekoPage.end - bookIndex.nekoPage.start + 1;
    const nftIncreases =
      nftPageNum > bookIndex.nftPage.end - bookIndex.nftPage.start + 1;
    let offsetNo = 0;
    if (nekoIncreases && pageNo > bookIndex.nekoPage.end) {
      offsetNo += 2;
    }
    if (nftIncreases && pageNo > bookIndex.nftPage.end) {
      offsetNo += 2;
    }
    setPageNo(pageNo + offsetNo);

    // インデックスを更新
    setBookIndex({
      profilePage: {
        start: profilePageIndex,
        end: nekoPageIndex - 1,
      },
      nekoPage: {
        start: nekoPageIndex,
        end: nftPageIndex - 1,
      },
      nftPage: {
        start: nftPageIndex,
        end: redeemPageIndex - 1,
      },
      redeemPage: {
        start: redeemPageIndex,
        end: redeemPageIndex + 1,
      },
    });

    // 各ページを生成し配列に格納する
    // 所有NFTが増加するほど、ページも増加していく。
    // TODO: 現状の実装では事前に生成し配列に保存するため、NFTを所有するほどメモリを喰うことになる。
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
      {
        image: "/journal/images/icon/TOBIRANEKO_journal.svg",
        page: nekoPageIndex,
      },
      {
        image: "/journal/images/icon/NFTs_journal.svg",
        page: nftPageIndex,
      },
      {
        image: "/journal/images/icon/Serial_journal.svg",
        page: redeemPageIndex,
      },
      {
        image: "/journal/images/icon/logout_journal.svg",
        page: () => {
          logoutModal.current.checked = true;
        },
      },
    ]);
  }, [nekoNFTs.current, otherNFTs.current]);

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
      <input
        type="checkbox"
        className="modal-toggle"
        ref={logoutModal}
        id="logout-modal"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl p-5 text-center text-accent">
            ログアウトしますか？
          </h3>
          <div className="flex flex-col gap-3">
            <label
              className="btn btn-block btn-error btn-outline"
              onClick={() => router.replace("/logout")}
              htmlFor="logout-modal"
            >
              ログアウト
            </label>
            <label
              className="btn btn-block btn-outline btn-accent"
              htmlFor="logout-modal"
            >
              キャンセル
            </label>
          </div>
        </div>
      </div>
      {children}
    </BookContext.Provider>
  );
};

export default BookContextProvider;
