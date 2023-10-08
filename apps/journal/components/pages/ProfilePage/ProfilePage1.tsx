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
      <div className="mt-6 sm:mt-12 pb-12 text-center text-primary">
        <div>
          <hr className="mx-8 border-primary" />
          <div className="mt-2 sm:mt-4 mb-3 sm:mb-6">
            <p className="text-xs sm:text-xl font-bold">11.3 ~ 12.3</p>
            <h2
              className="text-[26px] sm:text-[48px] font-bold 
                drop-shadow-[0_4px_2px_rgba(117,58,0,0.4)]
                sm:drop-shadow-[0_6px_2px_rgba(117,58,0,0.4)]"
            >
              TOBIRAPOLIS FESTIVAL
            </h2>
            <p className="mt-0 sm:mt-0 text-[0.65rem] sm:text-xs sm:text-base font-bold">
              TOBIRAPOLIS祭の各出展に参加して合言葉を集めよう
            </p>
          </div>
          <hr className="mx-8 border-primary" />
        </div>
        <div className="mt-6 sm:mt-12">
          <p className="text-xs sm:text-lg font-bold">
            すべて集めるとスペシャルスタンプNFTをプレゼント！
          </p>
          <div className="mt-3 sm:mt-6 flex justify-center gap-4 sm:gap-6 h-[56px] sm:h-[104px]">
            <RoundedImage src="" alt="fes stamp" />
            <RoundedImage src="" alt="fes stamp" />
            <RoundedImage src="" alt="fes stamp" />
            <RoundedImage src="" alt="fes stamp" />
            <RoundedImage src="" alt="fes stamp" />
          </div>
        </div>
        <div className="w-full mt-6 sm:mt-12 flex justify-center">
          <StampRallyRewardForm />
        </div>
        <p className="mt-2 text-[10px] sm:text-xs font-bold">
          {"スタンプ押印(NFT mint)には時間がかかります。"}
          {/* <br className="block sm:hidden" /> */}
          {"予めご了承ください。"}
        </p>
        <div className="mt-8 sm:mt-20 text-xs sm:text-base font-bold">
          <a>TOBIRAPOLIS祭詳細はこちら</a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage1;
