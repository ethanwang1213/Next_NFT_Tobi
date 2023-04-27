import { useState } from "react";
import PersonalIcon from "../sub/PersonalIcon/PersonalIcon";
import PersonalInfo from "../sub/PersonalInfo/PersonalInfo";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import styles from "./ProfilePage0.module.scss";
import Attribute from "@/types/Attribute";

type Props = {

};


/**
 * プロフィールページの1ページ目
 * @param param0 
 * @returns 
 */
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

  return <div className="page">
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
          <PersonalInfo dataType={"Registration date"} dataValue={registrationDate} />
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