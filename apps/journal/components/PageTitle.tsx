import { useMemo } from "react";

type Props = {
  isShown: boolean;
  pageType: "NFT" | "REDEEM";
};

type PageData = {
  class: string;
  title: string;
};

/**
 * ページのタイトルを表示するコンポーネント
 * @param param0
 * @returns
 */
const PageTitle: React.FC<Props> = ({ isShown, pageType }) => {
  // pageTypeによって、ページのタイトルとスタイルを変更する
  const pageData: PageData = useMemo(() => {
    switch (pageType) {
      case "NFT":
        return {
          class: "h-[100px] min-h-[100px]",
          title: "NFT",
        };
      case "REDEEM":
        return {
          class:
            "h-[150px] min-h-[150px] sm:h-[200px] sm:min-h-[200px] grid content-center",
          title: "Redeem Code",
        };
    }
  }, [pageType]);

  return (
    <div className={`mb-0 sm:mb-8 ${pageData.class}`}>
      {isShown && (
        <h1 className="w-full text-center text-[50px] sm:text-[60px] font-bold">
          {pageData.title}
        </h1>
      )}
    </div>
  );
};

export default PageTitle;
