import { useEffect, useMemo, useState } from "react";
import CharacteristicLine from "../../TypeValueLine/CharacteristicLine";
import { useAuth } from "contexts/journal-AuthProvider";
import useDateFormat from "@/hooks/useDateFormat";
import { mockCharacteristicList } from "@/libs/mocks/mockProfile0";
import { useDebug } from "@/contexts/journal-DebugProvider";
import { useDiscordOAuth } from "@/contexts/journal-DiscordOAuthProvider";
import { StampRallyRewardForm, RoundedImage } from "ui";

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
    [user]
  );

  const houseDataExists = useMemo(
    () => houseData && houseData.name,
    [houseData]
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
    <div className="h-full mb-8 sm:mb-0 flex flex-col">
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
                    user.characteristic.join_tobiratory_at.toDate()
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
      <div className="mt-12 text-center text-primary">
        <div>
          <hr className="mx-8 border-primary" />
          <div className="mt-4 mb-6">
            <p className="text-xs sm:text-xl font-bold">11.3 ~ 12.3</p>
            <h2
              className="text-[48px] font-bold 
                drop-shadow-[0_6px_2px_rgba(117,58,0,0.4)]"
            >
              TOBIRAPOLIS FESTIVAL
            </h2>
            <p className="text-xs sm:text-base font-bold">
              TOBIRAPOLIS祭の各出展に参加して合言葉を集めよう
            </p>
          </div>
          <hr className="mx-8 border-primary" />
        </div>
        <div className="mt-12">
          <p className="text-xs sm:text-lg font-bold">
            すべて集めるとスペシャルスタンプNFTをプレゼント！
          </p>
          <div className="mt-6 flex justify-center gap-6 h-[104px]">
            <RoundedImage src="" alt="TOBIRAPOLIS FES stamp" />
            <RoundedImage src="" alt="TOBIRAPOLIS FES stamp" />
            <RoundedImage src="" alt="TOBIRAPOLIS FES stamp" />
            <RoundedImage src="" alt="TOBIRAPOLIS FES stamp" />
            <RoundedImage src="" alt="TOBIRAPOLIS FES stamp" />
          </div>
        </div>
        <div className="w-full mt-12 flex justify-center">
          <StampRallyRewardForm />
        </div>
        <p className="mt-2 text-xs font-bold">
          {"スタンプ押印(NFT mint)には時間がかかります。予めご了承ください。"}
        </p>
        <div className="mt-20 text-base font-bold">
          <a>TOBIRAPOLIS祭詳細はこちら</a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage1;
