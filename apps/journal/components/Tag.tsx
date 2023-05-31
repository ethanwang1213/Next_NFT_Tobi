import { FC, ReactElement, useContext, useMemo } from "react";
import useSound from "use-sound";
import { BookContext } from "../contexts/BookContextProvider";

const Tag: FC<{
  image: string | ReactElement;
  page: Number | (() => void);
  isHamburger?: boolean;
}> = ({ image, page, isHamburger = false }) => {
  const bookData = useContext(BookContext);
  const { current: pageNo, set: setPageNo } = bookData.pageNo;
  const { current: isMute } = bookData.isMute;

  const isNumber = useMemo(() => typeof page === "number", [page]);

  const [play] = useSound("/journal/sounds/paging_Journal.mp3", {
    volume: 0.1,
  });

  const handleClick = () => {
    if (isNumber) {
      setPageNo(page);
    } else {
      (page as () => void)();
    }
    // Tagでページを遷移するときのみ、ページめくりの音を再生する
    if (!isMute && page !== pageNo && typeof page === "number") {
      play();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-end sm:justify-start rounded-r-md sm:rounded-l-md sm:rounded-r-none w-24 h-14 cursor-pointer ${
        ((pageNo === page || pageNo + 1 === page) && isNumber) || isHamburger
          ? "bg-red-700 w-24"
          : "bg-[#F0E8E1] w-24 md:w-20"
      }`}
    >
      {typeof image === "string" ? (
        <div
          style={{
            mask: `url(${image})`,
            WebkitMask: `url(${image})`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskOrigin: "content-box",
            WebkitMaskOrigin: "content-box",
            maskPosition: "left",
            WebkitMaskPosition: "left",
            maskSize: "40px 40px",
            WebkitMaskSize: "40px 40px",
          }}
          className={`mx-4 w-[40px] h-[40px] transition-all ${
            ((pageNo === page || pageNo + 1 === page) && isNumber) ||
            isHamburger
              ? "bg-white"
              : "bg-accent"
          }`}
        ></div>
      ) : (
        <div
          className={`mx-4 w-[44px] h-[44px] transition-all select-none rounded-full ${
            ((pageNo === page || pageNo + 1 === page) && isNumber) ||
            isHamburger
              ? "text-white"
              : "text-accent"
          } ${
            isHamburger
              ? ""
              : `border-solid border-[3px] ${
                  pageNo === 0 ? "border-white" : "border-accent"
                }`
          }`}
        >
          {image}
        </div>
      )}
    </div>
  );
};

export default Tag;
