import { ReactNode } from "react";
import styles from "./RedeemStatusPC.module.scss";

type Props = {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
};

const RedeemStatusPC: React.FC<Props> = ({ icon, title, description }) => {
  return (
    <>
      <div className="w-full h-[60%]">{icon}</div>
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
