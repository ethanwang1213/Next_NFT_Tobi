import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  icon: ReactNode;
  title: string;
  titleSize: number;
  children?: ReactNode;
  isFade?: boolean;
};

/**
 * PC表示モーダル内の表示に
 * 共通する枠のコンポーネント
 * @param param0
 * @returns
 */
const RedeemStatusPC: React.FC<Props> = ({
  icon,
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

  return (
    <>
      <div
        className="[&>svg_*]:!fill-accent w-full h-[55%] flex justify-center"
        ref={iconRef}
      >
        {icon}
      </div>
      <h3
        className="w-full grow min-h-[30px] text-accent font-bold grid content-center drop-shadow-lg"
        style={{
          fontSize: `${titleSize}px`,
        }}
      >
        {title}
      </h3>
      <div className="w-full grow min-h-[150px] flex justify-center">
        {children || <></>}
      </div>
    </>
  );
};

RedeemStatusPC.defaultProps = {
  isFade: false,
};

export default RedeemStatusPC;
