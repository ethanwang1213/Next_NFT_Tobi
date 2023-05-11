import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { BookPos } from "../../types/type";
import { BookContext } from "../../pages/_app";
import Tag from "../Tag";
import gsap from "gsap";

const usePrevious = (value: any) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

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
  const [scale, setScale] = useState<number>(1);
  const [bookWidth, setBookWidth] = useState<number>(0);
  const [bookHeight, setBookHeight] = useState<number>(0);
  const bookData = useContext(BookContext);
  const pageRef = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const { current: pageNo, set: setPageNo } = bookData.pageNo;
  const { current: pages } = bookData.pages;
  const { current: tags } = bookData.tags;
  const oldPageNo = usePrevious(pageNo);

  // ページめくり領域の幅 (%)
  const flipAreaWRatio = 15;

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
    else if (pageNo === oldPageNo) return;
    gsap
      .timeline()
      .set(pageRef[0].current, { pointerEvents: "auto" })
      .set(pageRef[1].current, { pointerEvents: "auto" })
      .fromTo(pageRef[0].current, { opacity: 1 }, { opacity: 0, duration: 0.5 })
      .fromTo(
        pageRef[1].current,
        { opacity: 1 },
        { opacity: 0, duration: 0.5 },
        "<"
      )
      .set(pageRef[0].current, { pointerEvents: "none" })
      .set(pageRef[1].current, { pointerEvents: "none" });
  }, [pageNo, pageRef]);

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
    setScale(bookWidth / 1500);

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
    width: `calc(calc(${bookPos.width}px - ${bookWidth * 0.07}px ) / ${scale})`,
    height: `calc(calc(${bookPos.height}px - ${
      bookHeight * 0.05
    }px) / ${scale})`,
    transform: `scale(${scale})`,
  };

  return (
    <>
      <div className="w-screen h-screen md:p-20 p-10">
        <div className="relative w-full h-full">
          <Image
            src="/images/book/openpage.png"
            fill
            alt="page"
            className="object-contain absolute"
            ref={bookImgRef}
            onLoad={setAspect}
            priority
          ></Image>
          <div
            className="absolute origin-top-left"
            style={{
              left: `${bookPos.left + bookWidth * 0.05}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              ...pageStyle,
            }}
          >
            {pages[pageNo]}
          </div>
          <div
            className="absolute origin-top-left"
            style={{
              left: `${bookPos.center + bookWidth * 0.03}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              ...pageStyle,
            }}
          >
            {pages[pageNo + 1]}
          </div>

          <div
            className="absolute origin-top-left"
            ref={pageRef[0]}
            style={{
              left: `${bookPos.left + bookWidth * 0.05}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              opacity: 0,
              pointerEvents: "none",
              ...pageStyle,
            }}
          >
            {pages[oldPageNo]}
          </div>
          <div
            className="absolute origin-top-left"
            ref={pageRef[1]}
            style={{
              left: `${bookPos.center + bookWidth * 0.03}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              opacity: 0,
              pointerEvents: "none",
              ...pageStyle,
            }}
          >
            {pages[oldPageNo + 1]}
          </div>

          {/* ページめくりのクリック領域の表示 */}
          <div
            className="absolute origin-top-left pointer-events-none"
            style={{
              left: `${bookPos.left + bookWidth * 0.05}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              ...pageStyle,
            }}
          >
            <div className="w-full h-full relative">
              <div
                className="absolute top-0 left-0 h-full bg-black/0 pointer-events-auto"
                style={{ width: `${flipAreaWRatio}%` }}
                onMouseEnter={(e) => handleFlipAreaEnter(e, -2)}
                onMouseLeave={handleFlipAreaLeave}
                onClick={(e) => tryFlipPage(e, -2)}
              />
            </div>
          </div>
          <div
            className="absolute origin-top-left pointer-events-none"
            style={{
              left: `${bookPos.center + bookWidth * 0.03}px`,
              top: `${bookPos.top + bookHeight * 0.02}px`,
              ...pageStyle,
            }}
          >
            <div className="w-full h-full relative">
              <div
                className="absolute top-0 right-0 h-full bg-black/0 pointer-events-auto"
                style={{ width: `${flipAreaWRatio}%` }}
                onMouseEnter={(e) => handleFlipAreaEnter(e, 2)}
                onMouseLeave={handleFlipAreaLeave}
                onClick={(e) => tryFlipPage(e, 2)}
              />
            </div>
          </div>

          <div
            className="absolute flex flex-col origin-top-left gap-5"
            style={{
              transform: `scale(${scale})`,
              left: bookPos.left,
              top: `${bookPos.top + bookHeight * 0.05}px`,
            }}
          >
            {tags.map((tag, i) => (
              <div
                className="relative"
                style={{
                  left:
                    pageNo === tag.page || pageNo === tag.page + 1
                      ? "-50%"
                      : "-70%",
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
