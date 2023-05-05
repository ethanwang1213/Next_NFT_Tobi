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
      <div className={styles.icon}>{icon}</div>
      <p className={styles.title}>{title}</p>
      <div className={styles.description}>{description}</div>
    </>
  );
};

export default RedeemStatusPC;
