import { ReactNode } from "react";

type Props = {
  isShown: boolean;
  className: string;
  title: ReactNode;
};

/**
 * ページのタイトルを表示するコンポーネント
 * @param param0
 * @returns
 */
const PageTitle: React.FC<Props> = ({ isShown, className, title }) => {
  return (
    <div className={`mb-0 sm:mb-8 ${className}`}>
      {isShown && (
        <h1 className="w-full text-center text-[50px] sm:text-[60px] font-bold text-accent">
          {title}
        </h1>
      )}
    </div>
  );
};

export default PageTitle;
