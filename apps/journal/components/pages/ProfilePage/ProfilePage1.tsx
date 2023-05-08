import { useEffect, useState } from "react";
import AttributeLine from "./sub/AttributeLine";
import { mockAttributeList } from "../../../libs/mocks/mockProfile1";

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
      <div className="h-full overflow-y-auto">
        <div className="grid gap-6">
          {attributeList.map((v) => (
            <AttributeLine key={v.id} type={v.type} value={v.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage1;
