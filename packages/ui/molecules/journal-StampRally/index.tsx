import { RoundedImage } from "../../atoms/journal-RoundedImage";
import { StampRallyTitle } from "../../atoms/journal-StampRallyTitle";
import { StampRallyRewardForm } from "../journal-StampRallyRewardForm";
import stamp from "./assets/stamp.png";

/**
 * スタンプラリー特設表示のコンポーネント
 * @returns {ReactElement} The `StampRally` component
 */
export const StampRally = () => {
  const stamps = [stamp.src, stamp.src, stamp.src, stamp.src, stamp.src];

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
            <RoundedImage src={v} alt="fes stamp" width={105} height={105} />
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
