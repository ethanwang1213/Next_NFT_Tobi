import { RoundedImage } from "../../atoms/journal-RoundedImage";
import { StampRallyTitle } from "../../atoms/journal-StampRallyTitle";
import { StampRallyRewardForm } from "../journal-StampRallyRewardForm";
import stamp from "./assets/stamp.png";

export const StampRally = () => {
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
          <RoundedImage src={stamp.src} alt="fes stamp" />
          <RoundedImage src={stamp.src} alt="fes stamp" />
          <RoundedImage src={stamp.src} alt="fes stamp" />
          <RoundedImage src={stamp.src} alt="fes stamp" />
          <RoundedImage src={stamp.src} alt="fes stamp" />
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
