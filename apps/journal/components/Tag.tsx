import { FC, ReactElement, useContext, useMemo } from "react";
import { BookContext } from "../pages/_app";

const Tag: FC<{
  image: string | ReactElement;
  page: Number | (() => void);
}> = ({ image, page }) => {
  const bookData = useContext(BookContext);
  const { current: pageNo, set: setPageNo } = bookData.pageNo;

  const isNumber = useMemo(() => typeof page === "number", [page]);

  return (
    <div
      onClick={() => (isNumber ? setPageNo(page) : (page as () => void)())}
      className={`flex items-center justify-end sm:justify-start rounded-r-md sm:rounded-l-md sm:rounded-r-none w-24 h-14 ${
        pageNo === page || pageNo + 1 === page || !isNumber
          ? "bg-red-700"
          : "bg-white"
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
            pageNo === page || pageNo + 1 === page || !isNumber
              ? "bg-white"
              : "bg-red-700"
          }`}
        ></div>
      ) : (
        <div
          className={`mx-4 w-[40px] h-[40px] transition-all ${
            pageNo === page || pageNo + 1 === page || !isNumber
              ? "text-white"
              : "text-red-700"
          }`}
        >
          {image}
        </div>
      )}
    </div>
  );
};

export default Tag;
