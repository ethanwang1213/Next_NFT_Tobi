import { FC, useContext } from "react";
import { BookContext } from "../pages/_app";

const Tag: FC<{ image: string; page: number }> = ({ image, page }) => {
  const bookData = useContext(BookContext);
  const { current: pageNo, set: setPageNo } = bookData.pageNo;

  return (
    <div
      onClick={() => setPageNo(page)}
      className={`flex items-center rounded-l-md w-24 h-14 ${
        pageNo === page || pageNo === page + 1 ? "bg-red-700" : "bg-white"
      }`}
    >
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
        className={`mx-4 w-[40px] h-[40px] ${
          pageNo === page || pageNo === page + 1 ? "bg-white" : "bg-red-700"
        }`}
      ></div>
    </div>
  );
};

export default Tag;
