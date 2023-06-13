import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { BookPos } from "../../types/type";
import Tag from "../Tag";
import gsap from "gsap";
import { BookContext } from "../../contexts/BookContextProvider";
import SuccessDiscordStamp from "../pages/ProfilePage/sub/SuccessDiscordStamp";

const Pc = () => {
  const bookImgRef = useRef<HTMLImageElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [bookPos, setBookPos] = useState<BookPos>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    center: 0,
  });
  const [bookAspect, setBookAspect] = useState<number>(0);
  const [tagScale, setTagScale] = useState<number>(1);
  const [pageScale, setPageScale] = useState<number>(1);
  const [bookWidth, setBookWidth] = useState<number>(0);
  const [bookHeight, setBookHeight] = useState<number>(0);
  const bookData = useContext(BookContext);
  const pageRef = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const { current: pageNo, set: setPageNo } = bookData.pageNo;
  const { current: pages } = bookData.pages;
  const { current: tags } = bookData.tags;
  const [newPageNo, setNewPageNo] = useState<number>(pageNo);
  const { profilePage, nekoPage, nftPage, redeemPage } = bookData.bookIndex;

  // ページめくり領域の幅 (%)
  const flipAreaWRatio = 18;

  // 右を押したらページ戻って左を押したらページ進む
  const tryFlipPage = (e: React.MouseEvent<HTMLDivElement>, offset: number) => {
    const page = pageNo + offset;
    if (page < 0 || page >= pages.length) return;
    setPageNo(page);

    // 最初ページか最後ページに到着した場合、ページめくり領域のホバー表示を消す
    // 最後ページの判定は、ページ数の偶奇で分けている
    if (
      page === 0 ||
      (pages.length % 2 === 0 && page === pages.length - 2) ||
      (pages.length % 2 === 1 && page === pages.length - 1)
    ) {
      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
    }
  };

  // ページめくり領域のホバー表示 (enter)
  const handleFlipAreaEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    offset: number
  ) => {
    const page = pageNo + offset;
    if (page < 0 || page >= pages.length) return;

    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.2)";
  };

  // ページめくり領域のホバー処理 (leave)
  const handleFlipAreaLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
  };

  useEffect(() => {
    if (!bookImgRef.current) return;
    else if (pageNo === newPageNo) return;
    gsap
      .timeline()
      .set(pageRef[0].current, { pointerEvents: "auto", opacity: 1 })
      .set(pageRef[1].current, { pointerEvents: "auto", opacity: 1 })
      .set(pageRef[2].current, { pointerEvents: "none", opacity: 0 })
      .set(pageRef[3].current, { pointerEvents: "none", opacity: 0 })
      .add(() => setNewPageNo(pageNo))
      .to(pageRef[0].current, { opacity: 0 })
      .to(pageRef[1].current, { opacity: 0 }, "<")
      .to(pageRef[2].current, { opacity: 1 }, "<")
      .to(pageRef[3].current, { opacity: 1 }, "<")
      .set(pageRef[0].current, { pointerEvents: "none" })
      .set(pageRef[1].current, { pointerEvents: "none" })
      .set(pageRef[2].current, { pointerEvents: "auto" })
      .set(pageRef[3].current, { pointerEvents: "auto" });
  }, [pageNo, pageRef, newPageNo]);

  const setAspect = () => {
    // 本の画像のアスペクト比を設定
    setBookAspect(
      bookImgRef.current.naturalWidth / bookImgRef.current.naturalHeight
    );
  };

  useEffect(() => {
    if (!bookImgRef.current) return;

    const width = bookImgRef.current.width;
    const height = bookImgRef.current.height;

    let bookWidth: number;
    let bookHeight: number;
    if (innerWidth / (innerHeight - 40) > bookAspect) {
      // bookImgRefのheightを基準にbookPosを設定
      bookWidth = height * bookAspect;
      bookHeight = height;
    } else {
      // bookImgRefのwidthを基準にbookPosを設定
      bookWidth = width;
      bookHeight = width / bookAspect;
    }
    setBookWidth(bookWidth);
    setBookHeight(bookHeight);

    // 本の画像の拡大率を設定
    setTagScale(bookWidth / 1000);
    setPageScale(bookWidth / 1500);

    // 本の画像の左上隅座標を更新
    setBookPos({
      left: (width - bookWidth) / 2.0,
      top: (height - bookHeight) / 2.0,
      width: bookWidth / 2.0,
      height: bookHeight,
      center: width / 2.0,
    });
  }, [innerWidth, innerHeight, bookAspect]);

  // TODO: メモ化
  const pageStyle = {
    width: `calc(calc(${bookPos.width}px - ${
      bookWidth * 0.07
    }px ) / ${pageScale})`,
    height: `calc(calc(${bookPos.height}px - ${
      bookHeight * 0.05
    }px) / ${pageScale})`,
    transform: `scale(${pageScale})`,
  };

  const pagePadding = (no: number) => {
    if (!pages[no]) return "";

    if (no >= profilePage.start && no <= profilePage.end) {
      if (no % 2 === 0) {
        return " pb-0 pl-0 pr-4";
      } else {
        return " pl-4";
      }
    } else if (no >= nekoPage.start && no <= nekoPage.end) {
      return " px-0";
    } else if (no >= nftPage.start && no <= nftPage.end) {
      return " px-0";
    } else if (no >= redeemPage.start && no <= redeemPage.end) {
      if (no % 2 === 0) {
        return " pb-8";
      } else {
        return "";
      }
    }
  };

  return (
    <>
      <div className="w-screen h-screen md:p-20 p-10">
        <div className="relative w-full h-full">
          <Image
            src="/journal/images/book/openpage.png"
            fill
            alt="page"
            className="object-contain absolute pointer-events-none select-none"
            ref={bookImgRef}
            onLoad={setAspect}
            priority
          ></Image>
          {/* 現在ページの表示 */}
          {/* 左ページ */}
          <div
            className="absolute origin-top-left"
            ref={pageRef[2]}
            style={{
              left: `${bookPos.left + bookWidth * 0.05}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              ...pageStyle,
            }}
          >
            {/* ページによってpaddingを変更する */}
            <div className={`page ${pagePadding(pageNo)}`}>{pages[pageNo]}</div>
            <SuccessDiscordStamp isPc={true} />
          </div>
          {/* 右ページ */}
          <div
            className="absolute origin-top-left"
            ref={pageRef[3]}
            style={{
              left: `${bookPos.center + bookWidth * 0.03}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              ...pageStyle,
            }}
          >
            {/* ページによってpaddingを変更する */}
            <div className={`page page-right ${pagePadding(pageNo + 1)}`}>
              {pages[pageNo + 1]}
            </div>
          </div>
          {/* 前ページの表示 */}
          {/* 前の左ページ */}
          <div
            className={`absolute origin-top-left`}
            ref={pageRef[0]}
            style={{
              left: `${bookPos.left + bookWidth * 0.05}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              opacity: 0,
              pointerEvents: "none",
              ...pageStyle,
            }}
          >
            {/* ページによってpaddingを変更する */}
            <div className={`page ${pagePadding(newPageNo)}`}>
              {pages[newPageNo]}
            </div>
          </div>
          {/* 前の右ページ */}
          <div
            className={`absolute origin-top-left`}
            ref={pageRef[1]}
            style={{
              left: `${bookPos.center + bookWidth * 0.03}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              opacity: 0,
              pointerEvents: "none",
              ...pageStyle,
            }}
          >
            {/* ページによってpaddingを変更する */}
            <div className={`page page-right ${pagePadding(newPageNo + 1)}`}>
              {pages[newPageNo + 1]}
            </div>
          </div>
          {/* ページめくりのクリック領域の表示 */}
          {/* 左ページめくり */}
          <div
            className="absolute origin-bottom-left pointer-events-none"
            style={{
              ...pageStyle,
              left: `${bookPos.left + bookWidth * 0.05}px`,
              bottom: `${bookPos.top + bookHeight * 0.01}px`,
              height:
                pageScale > 0
                  ? (bookHeight * (1 - 0.05) - tags.length * 44) / pageScale // タグのtopとタグの数を考慮
                  : 1,
            }}
          >
            <div className="w-full h-full relative">
              <div
                className="absolute top-0 h-full bg-black/0 pointer-events-auto rounded-bl-3xl"
                style={{
                  width: `${flipAreaWRatio}%`,
                  left: `-${flipAreaWRatio + 2}%`,
                }}
                onMouseEnter={(e) => handleFlipAreaEnter(e, -2)}
                onMouseLeave={handleFlipAreaLeave}
                onClick={(e) => tryFlipPage(e, -2)}
              />
            </div>
          </div>
          {/* 右ページめくり */}
          <div
            className="absolute origin-top-left pointer-events-none"
            style={{
              ...pageStyle,
              left: `${bookPos.center + bookWidth * 0.02}px`,
              top: `${bookPos.top + bookHeight * 0.01}px`,
              height: pageScale
                ? (bookPos.height - bookHeight * 0.02) / pageScale
                : 1,
            }}
          >
            <div className="w-full h-full relative">
              <div
                className="absolute top-0 right-0 h-full bg-black/0 pointer-events-auto rounded-r-3xl"
                style={{
                  width: `${flipAreaWRatio}%`,
                  right: `-${flipAreaWRatio + 2}%`,
                }}
                onMouseEnter={(e) => handleFlipAreaEnter(e, 2)}
                onMouseLeave={handleFlipAreaLeave}
                onClick={(e) => tryFlipPage(e, 2)}
              />
            </div>
          </div>
          {/* タグの表示 */}
          <div
            className="absolute flex flex-col origin-top-left gap-2"
            style={{
              transform: `scale(${tagScale})`,
              left: bookPos.left,
              top: `${bookPos.top + bookHeight * 0.05}px`,
            }}
          >
            {tags.map((tag, i) => (
              <div
                className="relative"
                style={{
                  left: "-66%",
                }}
                key={i}
              >
                <Tag image={tag.image} page={tag.page} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pc;
