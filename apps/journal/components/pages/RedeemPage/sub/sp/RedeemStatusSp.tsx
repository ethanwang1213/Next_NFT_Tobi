import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
};

const RedeemStatusSP: React.FC<Props> = ({ icon, title, description }) => {
  return (
    <>
      <div className="w-full h-[50%] flex justify-center">{icon}</div>
      <p
        className={`w-full grow min-h-[60px] mt-2 text-[42px] font-bold grid content-center ${
          title.length > 10 ? "text-[28px]" : ""
        }`}
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
