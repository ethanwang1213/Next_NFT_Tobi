import { useEffect, useState } from "react";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import styles from "./ProfilePage1.module.scss";
import { mockAttributeList } from "../../../../libs/mocks/mockProfile1";

export type ProfileAttribute = {
  id: number;
  type: string;
  value: string;
};

/**
 * プロフィールページの2ページ目
 * @param param0
 * @returns
 */
const ProfilePage1: React.FC = () => {
  const [attributeList, setAttributeList] = useState<ProfileAttribute[]>([]);

  useEffect(() => {
    setAttributeList(mockAttributeList);
  }, []);

  return (
    <div className="page">
      <div className={styles.scroll}>
        <div className={styles.attribute}>
          {attributeList.map((v) => (
            <AttributeLine key={v.id} type={v.type} value={v.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage1;
