import { useDebug } from "@/contexts/journal-DebugProvider";
import { useDiscordOAuth } from "@/contexts/journal-DiscordOAuthProvider";
import useDateFormat from "@/hooks/useDateFormat";
import { mockCharacteristicList } from "@/libs/mocks/mockProfile0";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useEffect, useMemo, useState } from "react";
import CharacteristicLine from "../../TypeValueLine/CharacteristicLine";

/**
 * プロフィールページの2ページ目
 * @param param0
 * @returns
 */
const ProfilePage1: React.FC = () => {
  const { user } = useAuth();
  const { houseData } = useDiscordOAuth();
  const { formattedFromDate } = useDateFormat();

  const joinAtExists = useMemo(
    () => user && user.characteristic && user.characteristic.join_tobiratory_at,
    [user],
  );

  const houseDataExists = useMemo(
    () => houseData && houseData.name,
    [houseData],
  );

  // Debug用
  const debug = useDebug();
  const { current: shouldRefresh } = debug.shouldRefresh;
  // 表示するmockデータの数をランダムに決定
  const [mockDataNum, setMockDataNum] = useState(mockCharacteristicList.length);
  useEffect(() => {
    if (shouldRefresh) {
      setMockDataNum(Math.floor(Math.random() * mockCharacteristicList.length));
    }
  }, [shouldRefresh]);

  return (
    <div className="h-full flex flex-col">
      <div className="grow overflow-y-auto">
        <div className="grid gap-8 pt-8 sm:pt-4">
          {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true" ? (
            <>
              {mockCharacteristicList.slice(0, mockDataNum).map((v, i) => (
                <CharacteristicLine
                  key={v.id}
                  lineType={v.text}
                  lineValue={v.value}
                />
              ))}
            </>
          ) : (
            <>
              {joinAtExists && (
                <CharacteristicLine
                  lineType={"Participation date of Tobiratory"}
                  lineValue={formattedFromDate(
                    user.characteristic.join_tobiratory_at.toDate(),
                  )}
                />
              )}
              {houseDataExists && (
                <CharacteristicLine
                  lineType={"House Arkhē"}
                  lineValue={houseData.name}
                />
              )}
            </>
          )}
        </div>
      </div>
      {/*
      // TOBIRAPOLIS祭スタンプラリー用
      <div className="mt-6 sm:mt-12">
        <StampRally />
      </div>
      */}
    </div>
  );
};

export default ProfilePage1;
