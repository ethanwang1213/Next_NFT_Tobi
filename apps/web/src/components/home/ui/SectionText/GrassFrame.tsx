import { useWindowSize } from "hooks";
import { ReactNode } from "react";

type Props = {
  style?: {};
  children: ReactNode;
};

/**
 * home セクションテキストのガラス風背景の表示コンポーネント
 * @param param0
 * @returns
 */
const GrassFrame: React.FC<Props> = ({ style = {}, children }) => {
  const { isWide } = useWindowSize();

  return (
    <div
      className={`${isWide ? "original-card" : "original-card-sp"}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default GrassFrame;
