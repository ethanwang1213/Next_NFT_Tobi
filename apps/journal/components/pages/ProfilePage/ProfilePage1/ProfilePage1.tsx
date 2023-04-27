import { useState } from "react";
import Attribute from "@/types/Attribute";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import styles from "./ProfilePage1.module.scss";

type Props = {

};

/**
 * プロフィールページの2ページ目
 * @param param0 
 * @returns 
 */
const ProfilePage1: React.FC<Props> = ({ }) => {
  const [attributeList, setAttributeList] = useState<Attribute[]>([
    {
      type: "Tobira Polis ( Community )",
      value: ""
    },
    {
      type: "House Arkhē",
      value: ""
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: ""
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: ""
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: ""
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: ""
    },
  ]);

  return <div className="page">
    <div className={styles.attribute}>
      {attributeList.map((attribute, index) => (
        <AttributeLine key={index} type={attribute.type} value={attribute.value} />
      ))}
    </div>
  </div>;
};

export default ProfilePage1;