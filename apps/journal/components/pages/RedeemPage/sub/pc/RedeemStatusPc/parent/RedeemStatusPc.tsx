import { ReactNode, memo } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
};

/**
 * PC表示モーダル内の表示に
 * 共通する枠のコンポーネント
 * @param param0
 * @returns
 */
const RedeemStatusPC: React.FC<Props> = ({ icon, title, description }) => {
  return (
    <>
      <div className="w-full h-[60%] flex justify-center">{icon}</div>
      <p className="w-full grow min-h-[50px] text-[60px] font-bold grid content-center">
        {title}
      </p>
      <div className="w-full grow min-h-[70px] flex justify-center">
        {description}
      </div>
    </>
  );
};

export default RedeemStatusPC;
