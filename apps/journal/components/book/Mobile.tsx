import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { BookContext } from "../../pages/_app";
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

const Mobile = () => {
  const [isLeftPage, setIsLeftPage] = useState<Boolean>(true);
  const [isShowTag, setIsShowTag] = useState<Boolean>(false);
  const bookContext = useContext(BookContext);
  const pages = bookContext.pages.current;
  const pageNo = bookContext.pageNo.current;

  const [isArrowShown, setIsArrowShown] = useState<Boolean>(true);
  const [isSwiperPage, setIsSwiperPage] = useState<Boolean>(false);

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
  }, [pages, pageNo]);

  return (
    <div className="overflow-hidden">
      <div
        className={`relative ${
          isLeftPage ? "left-[calc(100vw_-_60vh)]" : "left-[-70vh]"
        } w-[130vh] h-screen transition-[left]`}
      >
        {!isSwiperPage && (
          <Image
            src="/images/book/openpage.png"
            fill
            alt="page"
            className="object-contain"
            priority
          />
        )}
        <div className="absolute top-4 left-10 bottom-5 right-[70vh] flex justify-end">
          <div className="max-w-[calc(100vw_-_1.5rem)] w-full h-full mr-3">
            {bookContext.pages.current[bookContext.pageNo.current]}
          </div>
        </div>
        {!isSwiperPage && (
          <div className="absolute top-4 left-[70vh] bottom-5 right-5 flex justify-start">
            <div className="max-w-[calc(100vw_-_1.5rem)] w-full h-full ml-3">
              {bookContext.pages.current[bookContext.pageNo.current + 1]}
            </div>
          </div>
        )}
      </div>
      {isArrowShown && (
        <FontAwesomeIcon
          icon={isLeftPage ? faCircleRight : faCircleLeft}
          size="3x"
          className="absolute bottom-0 right-0 p-5"
          onClick={() => setIsLeftPage(!isLeftPage)}
        />
      )}
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
          key={-1}
        />
      </div>
    </div>
  );
};

export default Mobile;
