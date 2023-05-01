import { useState } from "react";
import Attribute from "@/types/Attribute";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import styles from "./ProfilePage1.module.scss";

type Props = {};

/**
 * プロフィールページの2ページ目
 * @param param0
 * @returns
 */
const ProfilePage1: React.FC<Props> = ({}) => {
  const [attributeList, setAttributeList] = useState<Attribute[]>([
    {
      type: "Participation date of Tobiratory",
      value: "2023/05/01",
    },
    {
      type: "House Arkhē",
      value: "Hydor",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Participation date of Tobiratory",
      value: "2023/05/01",
    },
    {
      type: "House Arkhē",
      value: "Hydor",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },{
      type: "Participation date of Tobiratory",
      value: "2023/05/01",
    },
    {
      type: "House Arkhē",
      value: "Hydor",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      value: "Lorem Ipsum",
    },
  ]);

  return (
    <div className="page">
      <div className={styles.scroll}>
        <div className={styles.attribute}>
          {attributeList.map((attribute, index) => (
            <AttributeLine
              key={index}
              type={attribute.type}
              value={attribute.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage1;
