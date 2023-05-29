import { useMemo } from "react";
import CharacteristicLine from "../../TypeValueLine/CharacteristicLine";
import { useAuth } from "@/contexts/AuthProvider";

// export type ProfileAttribute = {
//   id: number;
//   type: string;
//   value: string;
// };

/**
 * プロフィールページの2ページ目
 * @param param0
 * @returns
 */
const ProfilePage1: React.FC = () => {
  const { user } = useAuth();

  const joinAtExists = useMemo(
    () => user && user.characteristic && user.characteristic.join_tobiratory_at,
    [user]
  );

  return (
    <div className="h-full overflow-y-auto mb-16 sm:mb-0">
      <div className="grid gap-8 pt-8 sm:pt-4">
        {joinAtExists && (
          <CharacteristicLine
            lineType={"Participation date of Tobiratory"}
            lineValue={user.characteristic.join_tobiratory_at
              .toDate()
              .toLocaleDateString()}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage1;
