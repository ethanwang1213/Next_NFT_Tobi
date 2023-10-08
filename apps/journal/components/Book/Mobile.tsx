import Image from "next/image";
import {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleLeft,
  faCircleRight,
} from "@fortawesome/free-regular-svg-icons";
import Tag from "../Tag";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import NftPage from "../pages/NftPage/NftPage";
import NekoPage from "../pages/NekoPage/NekoPage";
import RedeemPage from "../pages/RedeemPage/RedeemPage";
import { useBookContext } from "../../contexts/journal-BookProvider";
import SuccessDiscordStamp from "../pages/ProfilePage/sub/SuccessDiscordStamp";
import DiscordOAuthButton from "../pages/ProfilePage/sub/DiscordOAuthButton";
import { useAuth } from "contexts/journal-AuthProvider";
import { isInPage, isLeftPage } from "@/methods/isSpecificPage";

/**
 * スマホでの本の表示用コンポーネント
 * @returns {ReactElement} The `Mobile` component
 */
const Mobile = () => {
  const [isDisplayLeft, setIsDisplayLeft] = useState<Boolean>(true);
  const [isShowTag, setIsShowTag] = useState<Boolean>(false);
  const bookContext = useBookContext();
  const pages = bookContext.pages.current;
  const pageNo = bookContext.pageNo.current;
  const { profilePage, nftPage } = bookContext.bookIndex;

  const [isArrowShown, setIsArrowShown] = useState<Boolean>(true);
  const [isSwiperPage, setIsSwiperPage] = useState<Boolean>(false);

  const { user } = useAuth();
  const footerBottom = useMemo(
    // () => (!user || !user.email ? " bottom-[50px]" : "bottom-0"),
    () => "bottom-0",
    [user]
  );
  // タグ外部クリックでタグ一覧を閉じるため
  const tagRef = useRef<HTMLDivElement>();

  useEffect(() => {
    // ページ移動したときに左ページを表示する
    if (!isDisplayLeft) {
      setIsDisplayLeft(true);
    }
  }, [pageNo]);

  useEffect(() => {
    if (pages.length === 0) return;

    // スマホ表示が1ページで十分な場合、左右移動の矢印を非表示にする
    if (
      pages[pageNo].type === NftPage ||
      pages[pageNo].type === NekoPage ||
      pages[pageNo].type === RedeemPage
    ) {
      setIsArrowShown(false);
    } else {
      setIsArrowShown(true);
    }

    // スマホ表示のNekoページは、swiperで表示され、本は非表示になる。
    if (pages[pageNo].type === NekoPage) {
      setIsSwiperPage(true);
    } else {
      setIsSwiperPage(false);
    }

    setIsShowTag(false);
  }, [pages, pageNo]);

  // ページによってpaddingを調節する
  const pagePadding = (no: number) => {
    if (!pages[no]) return "";

    if (isInPage(no, profilePage) && isLeftPage(no)) {
      return " pb-[20%] px-2";
    } else if (isInPage(no, nftPage)) {
      return " px-0";
    } else {
      return "";
    }
  };

  // タグ外部クリックでタグ一覧を閉じる
  useEffect(() => {
    if (!tagRef.current) return;

    const handleOuterTagClick = (ev: MouseEvent) => {
      if (!tagRef.current.contains(ev.target as Node)) {
        setIsShowTag(false);
      }
    };

    document.addEventListener("click", handleOuterTagClick);
    return () => document.removeEventListener("click", handleOuterTagClick);
  }, [tagRef.current]);

  return (
    <div className="overflow-hidden">
      <div
        className={`relative ${
          isDisplayLeft ? "left-[calc(100dvw_-_60dvh)]" : "left-[-70dvh]"
        } w-[130dvh] h-[100dvh] transition-[left]`}
      >
        {!isSwiperPage && (
          <Image
            src="/journal/images/book/openpage.png"
            fill
            alt="page"
            className="object-contain pointer-events-none select-none"
            priority
          />
        )}
        {/* 現在ページの表示 */}
        {/* 左ページ */}
        <div className="absolute top-4 left-10 bottom-5 right-[70dvh] flex justify-end">
          <div
            className={`max-w-[calc(100dvw_-_1.5rem)] w-full h-full mr-3 relative`}
          >
            {/* ページによってpaddingを変更する */}
            <div className={`page ${pagePadding(bookContext.pageNo.current)}`}>
              {bookContext.pages.current[bookContext.pageNo.current]}
            </div>
            <SuccessDiscordStamp isPc={false} />
          </div>
        </div>
        {/* 右ページ */}
        {!isSwiperPage && (
          <div className="absolute top-4 left-[70dvh] bottom-5 right-5 flex justify-start">
            <div className={`max-w-[calc(100dvw_-_1.5rem)] w-full h-full ml-3`}>
              {/* ページによってpaddingを変更する */}
              <div
                className={`page ${pagePadding(
                  bookContext.pageNo.current + 1
                )}`}
              >
                {bookContext.pages.current[bookContext.pageNo.current + 1]}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* タグの表示 */}
      <div
        className={`absolute ${footerBottom} pb-5 flex flex-col gap-2 left-[-30px]`}
        ref={tagRef}
      >
        <div
          className={`flex flex-col gap-2 ${
            isShowTag ? "opcaity-100" : "opacity-0 pointer-events-none"
          } transition-opacity`}
        >
          {bookContext.tags.current.map((tag, i) => (
            <Tag image={tag.image} page={tag.page} key={i} />
          ))}
        </div>
        <Tag
          image={
            isShowTag ? (
              <FontAwesomeIcon icon={faXmark} className="text-[40px] w-full" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="text-[40px] w-full" />
            )
          }
          page={() => setIsShowTag(!isShowTag)}
          isHamburger={true}
          key={-1}
        />
      </div>
      {/* Discord認証ボタン */}
      <div
        className={`absolute ${footerBottom} mb-[22px] w-full flex justify-center px-[90px] pointer-events-none select-none`}
      >
        <DiscordOAuthButton />
      </div>
      {/* 矢印アイコンの表示 */}
      {isArrowShown && (
        <FontAwesomeIcon
          icon={isDisplayLeft ? faCircleRight : faCircleLeft}
          size="4x"
          className={`absolute ${footerBottom} right-0 m-5 text-accent/80 scale-[0.88] origin-bottom-right cursor-pointer`}
          onClick={() => setIsDisplayLeft(!isDisplayLeft)}
        />
      )}
    </div>
  );
};

export default Mobile;
