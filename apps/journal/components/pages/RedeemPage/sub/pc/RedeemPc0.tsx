import HowToLink from "../HowToLink";
import InputRedemptionCodeBox from "../InputRedemptionCodeBox";
import ReceiverData from "../ReceiverData";
import RedeemButton from "../RedeemButton";

/**
 * 引き換えページのPC版の左ページ
 * @returns
 */
const RedeemPC0: React.FC = () => {
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
      <div className="mb-4">
        <ReceiverData />
      </div>
      <HowToLink className="link link-info text-end text-lg" />
      <div className="w-full absolute bottom-[5%] flex justify-center">
        <RedeemButton isPc={true} />
      </div>
    </div>
  );
};

export default RedeemPC0;
