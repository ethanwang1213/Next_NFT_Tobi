import { useRef, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  isFade?: boolean;
};

/**
 * spでの引き換え処理のステータス表示の
 * アイコン部分のコンポーネント
 * @param param0
 * @returns
 */
const IconContainer: React.FC<Props> = ({ children, isFade }) => {
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
    <div
      className="[&>svg_*]:!fill-accent w-full h-[50%] flex justify-center"
      ref={iconRef}
    >
      {children}
    </div>
  );
};
IconContainer.defaultProps = {
  isFade: false,
};
export default IconContainer;
