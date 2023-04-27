import Image from "next/image";
import styles from "./ProfileImage.module.scss";

type Props = {
  profileSrc: string;
  badgeSrc: string;
};

const ProfileImage: React.FC<Props> = ({ profileSrc, badgeSrc }) => {
  return <div className={styles.image}>
    <Image src={profileSrc} alt="profile image" width={220} height={220} />
    <div className={styles.badge}>
      <Image src={badgeSrc} alt="badge" width={60} height={60} />
    </div>
  </div>;
};

export default ProfileImage;