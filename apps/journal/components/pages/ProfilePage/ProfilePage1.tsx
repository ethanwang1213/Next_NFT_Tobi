import { useEffect, useState } from "react";
import { mockAttributeList } from "../../../libs/mocks/mockProfile1";
import ProfileAttributeLine from "../../TypeValueLine/ProfileAttributeLine";

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
            <ProfileAttributeLine
              key={v.id}
              lineType={v.type}
              lineValue={v.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage1;
