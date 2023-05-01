import { useState } from "react";
import PersonalIcon from "../sub/PersonalIcon/PersonalIcon";
import PersonalInfo from "../sub/PersonalInfo/PersonalInfo";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import styles from "./ProfilePage0.module.scss";

type Props = {};

/**
 * プロフィールページの1ページ目
 * @param param0
 * @returns
 */
const ProfilePage0: React.FC<Props> = ({}) => {
  const [name, setName] = useState<string>("KEISUKE");
  const [birthday, setBirthday] = useState<string>("2004/06/21");
  const [registrationDate, setRegistrationDate] =
    useState<string>("2023/05/01");

  return (
    <div className="page">
      <div className={styles.personal}>
        <div className={styles.icon}>
          <PersonalIcon
            profileSrc="/mock/images/profile.png"
            badgeSrc="/mock/images/badge.png"
          />
        </div>
        <div className={styles.info}>
          <div className={styles.infoLine}>
            <PersonalInfo dataType={"Name"} dataValue={name} />
          </div>
          <div className={styles.infoLine}>
            <PersonalInfo dataType={"Birthday"} dataValue={birthday} />
          </div>
          <div className={styles.infoLine}>
            <PersonalInfo
              dataType={"Registration date"}
              dataValue={registrationDate}
            />
          </div>
        </div>
      </div>
      <div className={styles.attribute}></div>
    </div>
  );
};

export default ProfilePage0;
