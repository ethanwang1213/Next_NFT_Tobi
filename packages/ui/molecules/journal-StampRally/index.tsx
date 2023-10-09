import { useAuth } from "contexts/journal-AuthProvider";
import { RoundedImage } from "../../atoms/journal-RoundedImage";
import { StampRallyTitle } from "../../atoms/journal-StampRallyTitle";
import { StampRallyRewardForm } from "../journal-StampRallyRewardForm";
import stamp from "./assets/stamp.png";
import { MintStatusType, Tpf2023StampType } from "types/journal-types";

type StampDataType = {
  key: Tpf2023StampType;
  src: string;
  status: MintStatusType;
};

/**
 * スタンプラリー特設表示のコンポーネント
 * @returns {ReactElement} The `StampRally` component
 */
export const StampRally = () => {
  const { user } = useAuth();
  const stampRally = user?.mintStatusData?.tpf2023StampRally;

  const keys: Tpf2023StampType[] = [
    "g0",
    "g1Alpha",
    "g1Beta",
    "g1Gamma",
    "g1Delta",
  ];
  const stamps: StampDataType[] = keys.map((key) => ({
    key: key,
    src: stamp.src,
    status: !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
  }));

  return (
    <div className="text-center text-primary">
      <div>
        <StampRallyTitle />
      </div>
      <div className="mt-6 sm:mt-12">
        <p className="text-xs sm:text-lg font-bold">
          すべて集めるとスペシャルスタンプNFTをプレゼント！
        </p>
        <div className="mt-3 sm:mt-6 flex justify-center gap-3 sm:gap-6 h-[56px] sm:h-[104px]">
          {stamps.map((v) => (
            <RoundedImage
              key={v.key}
              src={
                v.status === "IN_PROGRESS" || v.status === "DONE" ? v.src : ""
              }
              alt={v.key}
              width={105}
              height={105}
            />
          ))}
        </div>
      </div>
      <div className="w-full mt-6 sm:mt-12">
        <StampRallyRewardForm />
      </div>
      <p className="mt-2 text-[10px] sm:text-xs font-bold">
        {"スタンプ押印(NFT mint)には時間がかかります。予めご了承ください。"}
      </p>
      <div className="mt-8 sm:mt-20 text-xs sm:text-base font-bold">
        <a>TOBIRAPOLIS祭詳細はこちら</a>
      </div>
    </div>
  );
};
