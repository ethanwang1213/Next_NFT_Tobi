import { mockNekoSrcList } from "@/libs/mocks/mockNekoSrcList";
import { mockNftSrcList } from "@/libs/mocks/mockNftSrcList";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { BookIndex, tagType } from "journal-pkg/types/journal-types";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NekoPage from "../components/pages/NekoPage/NekoPage";
import NftPage from "../components/pages/NftPage/NftPage";
import ProfilePage0 from "../components/pages/ProfilePage/ProfilePage0";
import ProfilePage1 from "../components/pages/ProfilePage/ProfilePage1";
import RedeemPage from "../components/pages/RedeemPage/RedeemPage";
import SettingPage from "../components/pages/SettingPage/SettingPage";
import { useHoldNfts } from "./journal-HoldNftsProvider";

type Props = {
  children: ReactNode;
};

// journal 本のUIを構成するデータの型
type ContextType = {
  pageNo: {
    current: number;
    set: Dispatch<SetStateAction<number>>;
  };
  pages: {
    current: ReactElement[];
    set: Dispatch<SetStateAction<ReactElement[]>>;
  };
  tags: {
    current: tagType[];
    set: Dispatch<SetStateAction<tagType[]>>;
  };
  bookIndex: BookIndex;
};

const BookContext = createContext<ContextType>({} as ContextType);

/**
 * 本の状態を管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const BookProvider: React.FC<Props> = ({ children }) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const [pages, setPages] = useState<ReactElement[]>([]);
  const [tags, setTags] = useState<tagType[]>([]);

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
    settingPage: {
      start: 0,
      end: 0,
    },
  });

  const router = useRouter();
  const logoutModal = useRef<HTMLInputElement>();

  const { user } = useAuth();
  const { nekoNfts, otherNfts } = useHoldNfts();

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
    [user],
  );

  useEffect(() => {
    const profilePageNum = 2;
    const redeemPageNum = 2;

    const nekoLength =
      process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true"
        ? mockNekoSrcList.length
        : nekoNfts.current.length;
    let nekoPageNum = Math.trunc(nekoLength / 4);
    if (nekoLength % 4 !== 0) nekoPageNum++; // 余りがある場合はページ数を+1
    if (nekoPageNum === 0) nekoPageNum = 1; // ページ数0の場合は1ページとする
    if (nekoPageNum % 2 === 1) nekoPageNum++; // 奇数ページならページ数+1

    const otherNftLength =
      process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true"
        ? mockNftSrcList.length
        : otherNfts.current.length;
    let nftPageNum = Math.trunc(otherNftLength / 9);
    if (otherNftLength % 9 !== 0) nftPageNum++; // 余りがある場合はページ数を+1
    if (nftPageNum === 0) nftPageNum = 1; // ページ数0の場合は1ページとする
    if (nftPageNum % 2 === 1) nftPageNum++; // 奇数ページならページ数+1

    // 各ページの開始ページ番号を設定
    const profilePageIndex = 0;
    const nekoPageIndex = profilePageIndex + profilePageNum;
    const nftPageIndex = nekoPageIndex + nekoPageNum;
    const redeemPageIndex = nftPageIndex + nftPageNum;
    const settingPageIndex = redeemPageIndex + redeemPageNum;

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
      settingPage: {
        start: settingPageIndex,
        end: settingPageIndex + 1,
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
        <NftPage pageNum={i} key={nftPageIndex + i} />
      )),
      <RedeemPage pageNum={0} key={redeemPageIndex + 0} />,
      <RedeemPage pageNum={1} key={redeemPageIndex + 1} />,
      <SettingPage pageNum={0} key={settingPageIndex + 0} />,
      <SettingPage pageNum={1} key={settingPageIndex + 1} />,
    ]);

    // 各ページの開始ページ番号にタグを設定
    const newTags = [
      { image: profileTag, page: 0 },
      {
        image: "/journal/images/icon/TOBIRANEKO_journal.svg",
        page: nekoPageIndex,
      },
      {
        image: "/journal/images/icon/Nfts_journal.svg",
        page: nftPageIndex,
      },
      {
        image: "/journal/images/icon/Serial_journal.svg",
        page: redeemPageIndex,
      },
      {
        image: "/journal/images/icon/Setting_journal.svg",
        page: settingPageIndex,
      },
      {
        image: "/journal/images/icon/logout_journal.svg",
        page: () => {
          logoutModal.current.checked = true;
        },
      },
    ];
    setTags(!user || !user.email ? newTags.slice(0, 4) : newTags);
  }, [nekoNfts.current, otherNfts.current]);

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

  const contextValue = useMemo(
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
      bookIndex: bookIndex,
    }),
    [pageNo, pages, tags, bookIndex, setPageNo, setPages, setTags],
  );

  return (
    <BookContext.Provider value={contextValue}>
      <input
        type="checkbox"
        className="modal-toggle"
        ref={logoutModal}
        id="logout-modal"
      />
      <div className="modal">
        <div className="modal-box p-8">
          <h3 className="font-bold text-xl pb-6 text-center text-text-1000">
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

export const useBookContext = () => useContext(BookContext);
