import { useWindowSize } from "hooks";
import { a } from "@react-spring/web";
import { ReactNode } from "react";

type Props = {
  style: {};
  children: ReactNode;
};

/**
 * home セクションのUIのコンテナ
 * @param param0
 * @returns
 */
const SectionContainer: React.FC<Props> = ({ style, children }) => {
  const { displayWidth, displayHeight } = useWindowSize();

  return (
    <div
      className="absolute left-0 top-0"
      style={{ width: displayWidth, height: displayHeight }}
    >
      <a.div
        className="flex justify-center grid content-center h-full pointer-events-none text-white/30 text-[24px]"
        style={style}
      >
        {children}
      </a.div>
    </div>
  );
};

export default SectionContainer;
