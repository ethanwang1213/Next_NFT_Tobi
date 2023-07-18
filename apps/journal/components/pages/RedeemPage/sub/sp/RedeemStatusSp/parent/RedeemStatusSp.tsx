import { ReactNode, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";

type IconType = "feather" | "feather-check" | "caution";

type Props = {
  iconType: IconType;
  title: string;
  titleSize: number;
  children?: ReactNode;
  isFade?: boolean;
};

/**
 * スマホ表示モーダル内の表示に
 * 共通する枠のコンポーネント
 * @param param0
 * @returns
 */
const RedeemStatusSP: React.FC<Props> = ({
  iconType,
  title,
  titleSize,
  children,
  isFade,
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFade && iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          repeat: -1,
          yoyo: true,
        }
      );
    }
  }, [isFade, iconRef]);

  const icon = useMemo(
    () => (
      <>
        {iconType === "feather" && <FeatherIcon className={"w-[68%] h-full"} />}
        {iconType === "feather-check" && (
          <FeatherCheckIcon className={"w-[60%] h-full"} />
        )}
        {iconType === "caution" && (
          )}
      </>
    ),
    []
  );

  return (
    <>
      <div
        className="[&>svg_*]:!fill-accent w-full h-[50%] flex justify-center"
        ref={iconRef}
      >
        {icon}
      </div>
      <h3
        className={`w-full grow min-h-[60px] mt-2 text-[42px] text-accent font-bold grid content-center drop-shadow-lg`}
        style={{ fontSize: `${titleSize}px` }}
      >
        {title}
      </h3>
      <div className="w-full grow min-h-[8px] flex justify-center">
        {children || <></>}
      </div>
    </>
  );
};
RedeemStatusSP.defaultProps = {
  isFade: false,
};

export default RedeemStatusSP;
