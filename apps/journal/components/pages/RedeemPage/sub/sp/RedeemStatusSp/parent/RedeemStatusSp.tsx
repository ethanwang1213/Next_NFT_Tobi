import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  titleSize: number;
  description?: ReactNode;
};

/**
 * スマホ表示モーダル内の表示に
 * 共通する枠のコンポーネント
 * @param param0
 * @returns
 */
const RedeemStatusSP: React.FC<Props> = ({
  icon,
  title,
  titleSize,
  description,
}) => {
  return (
    <>
      <div className="[&>svg_*]:!fill-accent w-full h-[50%] flex justify-center">
        {icon}
      </div>
      <p
        className={`w-full grow min-h-[60px] mt-2 text-[42px] text-accent font-bold grid content-center`}
        style={{ fontSize: `${titleSize}px` }}
      >
        {title}
      </p>
      <div className="w-full grow min-h-[8px] flex justify-center">
        {description}
      </div>
    </>
  );
};

export default RedeemStatusSP;
