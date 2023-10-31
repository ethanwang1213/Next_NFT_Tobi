import { useWindowSize } from "hooks";
import BgPatternLeftPc from "@/../public/contact/pc/left.svg";
import BgPatternLeftSp from "@/../public/contact/sp/left.svg";
import BgPatternRightPc from "@/../public/contact/pc/right.svg";
import BgPatternRightSp from "@/../public/contact/sp/right.svg";

/**
 * contact, about usの背景用のパターン
 * @param param0
 * @returns
 */
const BgPattern: React.FC = () => {
  const { innerHeight, isWide } = useWindowSize();

  return (
    <div className="w-full h-full">
      <div className="absolute left-0 top-0" style={{ height: innerHeight }}>
        {isWide ? (
          <BgPatternLeftPc className="h-full" />
        ) : (
          <BgPatternLeftSp className="h-full" />
        )}
      </div>
      <div className="absolute right-0 top-0 h-full">
        {isWide ? (
          <BgPatternRightPc className="h-full" />
        ) : (
          <BgPatternRightSp className="h-full" />
        )}
      </div>
    </div>
  );
};

export default BgPattern;
