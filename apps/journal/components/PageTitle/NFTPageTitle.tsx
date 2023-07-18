import { ReactNode } from "react";
import PageTitle from "./parent/PageTitle";

type Props = {
  isShown: boolean;
  title: ReactNode;
};

/**
 * NFTページのタイトルを表示するコンポーネント
 * @param param0
 * @returns
 */
const NFTPageTitle: React.FC<Props> = ({ isShown, title }) => {
  return (
    <div
      className="grid content-center leading-[48px] sm:leading-[84px] 
        mb-0 sm:mb-8 h-[100px] min-h-[130px]"
    >
      <PageTitle isShown={isShown} title={title} />
    </div>
  );
};

export default NFTPageTitle;
