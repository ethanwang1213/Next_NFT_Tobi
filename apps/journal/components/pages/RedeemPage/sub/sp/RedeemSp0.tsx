import HowToLink from "../HowToLink";
import InputRedemptionCodeBox from "../InputRedemptionCodeBox";
import RedeemButton from "../RedeemButton";
import SelfData from "../SelfData";
import RedeemStatusModal from "./RedeemStatusModal";

/**
 * redeemページの左ページのスマホ表示用コンポーネント
 * @returns
 */
const RedeemSP0: React.FC = () => {
  return (
    <div className="relative h-full">
      <div className="mb-10">
        <InputRedemptionCodeBox
          classNames={{
            input: "input input-bordered w-full bg-transparent text-lg",
            p: "text-xs text-end font-bold",
          }}
        />
      </div>
      <div className="w-full absolute bottom-[13%]">
        <div className="mb-6">
          <SelfData />
        </div>
        <div className="w-full flex justify-center">
          <RedeemButton />
        </div>
      </div>
      <HowToLink className="w-full absolute bottom-0 link link-info text-end text-lg" />
      {/* スマホ表示用モーダル */}
      <RedeemStatusModal />
    </div>
  );
};

export default RedeemSP0;
