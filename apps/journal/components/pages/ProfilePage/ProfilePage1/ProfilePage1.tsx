import { useEffect, useState } from "react";
import ProfileAttribute from "@/types/ProfileAttribute";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import styles from "./ProfilePage1.module.scss";
import { mockAttributeList } from "../../../../libs/mocks/mockProfile1";

type Props = {};

/**
 * プロフィールページの2ページ目
 * @param param0
 * @returns
 */
const ProfilePage1: React.FC<Props> = ({}) => {
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
