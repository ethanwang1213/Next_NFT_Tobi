import Image from "next/image";
import styles from "./PersonalIcon.module.scss";

type Props = {
  profileSrc: string;
  badgeSrc: string;
};

/**
 * プロフィールのアイコンのコンポーネント
 * @param param0
 * @returns
 */
const PersonalIcon: React.FC<Props> = ({ profileSrc, badgeSrc }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Image src={profileSrc} alt="profile image" fill />
        <div className={styles.badge}>
          <Image src={badgeSrc} alt="badge" fill />
        </div>
      </div>
    </div>
  );
};

export default PersonalIcon;
