import HowToLink from "../HowToLink";
import InputRedemptionCodeBox from "../InputRedemptionCodeBox";
import RedeemButton from "../RedeemButton";
import SelfData from "../SelfData";

/**
 * redeemページの左ページのPC表示用コンポーネント
 * @returns
 */
const RedeemPC0: React.FC = () => {
  return (
    <div className="relative h-full pt-6">
      <div className="mb-[76px]">
        <InputRedemptionCodeBox
          classNames={{
            input:
              "input input-lg input-bordered w-full h-[70px] bg-transparent text-[26px] font-bold border-2 rounded-xl",
            p: "text-md text-end font-bold mt-1",
          }}
        />
      </div>
      <div className="mb-8">
        <SelfData />
      </div>
      <HowToLink className="text-end sm:text-[27px]" />
      <div className="w-full absolute bottom-[5%] flex justify-center">
        <RedeemButton />
      </div>
    </div>
  );
};

export default RedeemPC0;
