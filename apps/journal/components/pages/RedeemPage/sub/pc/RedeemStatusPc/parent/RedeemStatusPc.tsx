import { ReactNode, memo } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  titleSize: number;
  description?: ReactNode;
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
  description,
}) => {
  return (
    <>
      <div className="[&>svg_*]:!fill-accent w-full h-[55%] flex justify-center">
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
        {description}
      </div>
    </>
  );
};

export default RedeemStatusPC;
