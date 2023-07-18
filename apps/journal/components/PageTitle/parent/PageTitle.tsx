import { ReactNode } from "react";

type Props = {
  isShown: boolean;
  title: ReactNode;
};

/**
 * ページのタイトルを表示するコンポーネント
 * @param param0
 * @returns {ReactElement} The 'PageTitle' component
 */
const PageTitle: React.FC<Props> = ({ isShown, title }) => {
  return (
    <>
      {isShown && (
        <h1 className="w-full text-center text-[42px] sm:text-[78px] font-bold text-accent drop-shadow-md">
          {title}
        </h1>
      )}
    </>
  );
};

export default PageTitle;
