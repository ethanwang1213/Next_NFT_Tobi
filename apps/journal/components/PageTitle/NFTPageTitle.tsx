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
    <PageTitle
      isShown={isShown}
      className="h-[100px] min-h-[100px]"
      title={title}
    />
  );
};

export default NFTPageTitle;
