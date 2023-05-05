import { useMemo } from "react";
import styles from "./PageTitle.module.scss";

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
          class: styles.nftPage,
          title: "NFT",
        };
      case "REDEEM":
        return {
          class: styles.redeemPage,
          title: "Redeem Code",
        };
    }
  }, [pageType]);

  return (
    <div className={`${styles.titleContainer} ${pageData.class}`}>
      {isShown && <h1 className={styles.title}>{pageData.title}</h1>}
    </div>
  );
};

export default PageTitle;
