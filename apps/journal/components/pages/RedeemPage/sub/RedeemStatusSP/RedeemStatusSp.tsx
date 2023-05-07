import { ReactNode } from "react";
import styles from "./RedeemStatusSP.module.scss";

type Props = {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
};

const RedeemStatusSP: React.FC<Props> = ({ icon, title, description }) => {
  return (
    <>
      <div className={styles.icon}>{icon}</div>
      <p
        className={`${styles.title} ${
          title.length > 10 ? styles.smallTitle : ""
        }`}
      >
        {title}
      </p>
      <div className={styles.description}>{description}</div>
    </>
  );
};

export default RedeemStatusSP;
