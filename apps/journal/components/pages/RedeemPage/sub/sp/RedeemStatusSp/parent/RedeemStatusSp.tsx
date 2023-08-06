import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  icon: ReactNode;
  title: string;
  titleSize: number;
  description?: ReactNode;
  isFade?: boolean;
};

/**
 * スマホ表示モーダル内の表示に
 * 共通する枠のコンポーネント
 * @param param0
 * @returns
 */
const RedeemStatusSp: React.FC<Props> = ({
  icon,
  title,
  titleSize,
  description,
  isFade
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(isFade && iconRef.current){
    gsap.fromTo(iconRef.current, {
      opacity: 0,
    }, {
      opacity: 1,
      duration: 1,
      repeat: -1,
      yoyo: true,
    });
  }
  }, [isFade,iconRef])

  return (
    <>
      <div className="[&>svg_*]:!fill-accent w-full h-[50%] flex justify-center" ref={iconRef}>
        {icon}
      </div>
      <h3
        className={`w-full grow min-h-[60px] mt-2 text-[42px] text-accent font-bold grid content-center drop-shadow-lg`}
        style={{ fontSize: `${titleSize}px` }}
      >
        {title}
      </h3>
      <div className="w-full grow min-h-[8px] flex justify-center">
        {description}
      </div>
    </>
  );
};
RedeemStatusSp.defaultProps = {
  isFade: false,
};

export default RedeemStatusSp;
