import { useState } from "react";
import ProfileImage from "../sub/ProfileImage/ProfileImage";
import ProfileInfo from "../sub/ProfileInfo/ProfileInfo";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import styles from "./ProfilePage0.module.scss";

type Props = {

};

type Attribute = {
  type: string;
  value: string;
};

const ProfilePage0: React.FC<Props> = ({ }) => {
  const [name, setName] = useState<string>("KEISUKE");
  const [birthday, setBirthday] = useState<string>("2004/06/21");
  const [registrationDate, setRegistrationDate] = useState<string>("2023/05/01");
  const [attributeList, setAttributeList] = useState<Attribute[]>([
    {
      type: "Participation date of Tobiratory",
      value: "2023/05/01"
    },
    {
      type: "House Arkhē",
      value: "Hydor",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum"
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum"
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum"
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum"
    }
  ]);

  return <div className={styles.page}>
    <div className={styles.personal}>
      <div className={styles.icon}>
        <ProfileImage
          profileSrc="/mock/images/profile.png"
          badgeSrc="/mock/images/badge.png"
        />
      </div>
      <div className={styles.info}>
        <div className={styles.infoLine}>
          <ProfileInfo dataType={"Name"} dataValue={name} />
        </div>
        <div className={styles.infoLine}>
          <ProfileInfo dataType={"Birthday"} dataValue={birthday} />
        </div>
        <div className={styles.infoLine}>
          <ProfileInfo dataType={"Registration date"} dataValue={registrationDate} />
        </div>
      </div>
    </div>
    <div className={styles.attribute}>
      {attributeList.map((attribute, index) => (
        <AttributeLine key={index} type={attribute.type} value={attribute.value} />
      ))}
    </div>
  </div>;
};

export default ProfilePage0;