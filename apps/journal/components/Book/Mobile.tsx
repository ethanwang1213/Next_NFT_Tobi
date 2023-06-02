import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleLeft,
  faCircleRight,
} from "@fortawesome/free-regular-svg-icons";
import Tag from "../Tag";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import NFTPage from "../pages/NFTPage/NFTPage";
import NekoPage from "../pages/NekoPage/NekoPage";
import RedeemPage from "../pages/RedeemPage/RedeemPage";
import { BookContext } from "../../contexts/BookContextProvider";
import ProfilePage0 from "../pages/ProfilePage/ProfilePage0";
import SuccessDiscordStamp from "../pages/ProfilePage/sub/SuccessDiscordStamp";

const Mobile = () => {
  const [isLeftPage, setIsLeftPage] = useState<Boolean>(true);
  const [isShowTag, setIsShowTag] = useState<Boolean>(false);
  const bookContext = useContext(BookContext);
  const pages = bookContext.pages.current;
  const pageNo = bookContext.pageNo.current;

  const [isArrowShown, setIsArrowShown] = useState<Boolean>(true);
  const [isSwiperPage, setIsSwiperPage] = useState<Boolean>(false);

  useEffect(() => {
    // ページ移動したときに左ページを表示する
    if (!isLeftPage) {
      setIsLeftPage(true);
    }
  }, [pageNo]);

  useEffect(() => {
    if (pages.length === 0) return;

    // スマホ表示が1ページで十分な場合、左右移動の矢印を非表示にする
    if (
      pages[pageNo].type === NFTPage ||
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

  const pagePadding = (no: number) => {
    if (!pages[no]) return "";

    switch (pages[no].type) {
      case NFTPage:
        return " px-0";
      case ProfilePage0:
        return " pb-2";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-hidden">
      <div
        className={`relative ${
          isLeftPage ? "left-[calc(100vw_-_60vh)]" : "left-[-70vh]"
        } w-[130vh] h-[100dvh] transition-[left]`}
      >
        {!isSwiperPage && (
          <Image
            src="/journal/images/book/openpage.png"
            fill
            alt="page"
            className="object-contain"
            priority
          />
        )}
        {/* 現在ページの表示 */}
        {/* 左ページ */}
        <div className="absolute top-4 left-10 bottom-5 right-[70vh] flex justify-end">
          <div className={`max-w-[calc(100vw_-_1.5rem)] w-full h-full mr-3`}>
            {/* ページによってpaddingを変更する */}
            <div className={` page ${pagePadding(bookContext.pageNo.current)}`}>
              {bookContext.pages.current[bookContext.pageNo.current]}
              <SuccessDiscordStamp isPc={false} />
            </div>
          </div>
        </div>
        {/* 右ページ */}
        {!isSwiperPage && (
          <div className="absolute top-4 left-[70vh] bottom-5 right-5 flex justify-start">
            <div className={`max-w-[calc(100vw_-_1.5rem)] w-full h-full ml-3`}>
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
      {/* 矢印アイコンの表示 */}
      {isArrowShown && (
        <FontAwesomeIcon
          icon={isLeftPage ? faCircleRight : faCircleLeft}
          size="4x"
          className="absolute bottom-0 right-0 p-5 text-accent/80 scale-[0.875] origin-bottom-right"
          onClick={() => setIsLeftPage(!isLeftPage)}
        />
      )}
      {/* タグの表示 */}
      <div className="absolute bottom-0 py-5 flex flex-col gap-2 left-[-30px]">
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
    </div>
  );
};

export default Mobile;
