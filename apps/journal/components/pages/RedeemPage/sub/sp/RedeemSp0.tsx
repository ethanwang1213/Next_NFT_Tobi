import TypeValueLine from "../../../../TypeValueLine";
import RedeemButton from "../RedeemButton";
import RedeemStatusModal from "./RedeemStatusModal";

const RedeemSP0: React.FC = () => {
  return (
    <div className="relative h-full">
      <div className="mb-10">
        <input
          type="text"
          placeholder="Enter Redemption Code"
          className="input input-bordered w-full bg-transparent text-lg"
        />
        <p className="text-xs text-end font-bold">
          NFT受け取りコードを入力してください。
        </p>
      </div>
      <div className="w-full absolute bottom-[13%]">
        <div className="grid gap-4 mb-6">
          <TypeValueLine
            lineType={"Receive Account"}
            lineValue={"KEISUKE"}
            styleMode={"REDEEM_DATA"}
          />
          <TypeValueLine
            lineType={"Receive Journal ID"}
            lineValue={"KEISUKE"}
            styleMode={"REDEEM_DATA"}
            hidable={true}
          />
        </div>
        <div className="w-full flex justify-center">
          <RedeemButton isPc={false} />
        </div>
      </div>
      <p className="w-full absolute bottom-0 link link-info text-end text-lg">
        How to receive NFTs
      </p>

      <RedeemStatusModal />
    </div>
  );
};

export default RedeemSP0;
