import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * pcでの引き換え処理のステータス表示の
 * 説明部分のコンポーネント
 * @param param0
 * @returns
 */
const DescriptionContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full grow min-h-[150px] flex justify-center">
      {children}
    </div>
  );
};

export default DescriptionContainer;
