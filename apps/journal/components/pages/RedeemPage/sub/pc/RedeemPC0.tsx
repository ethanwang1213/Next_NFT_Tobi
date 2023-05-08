import TypeValueLine from "../../../../TypeValueLine";

/**
 * 引き換えページのPC版の左ページ
 * @returns
 */
const RedeemPC0: React.FC = () => {
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
      <div className="grid gap-4 mb-4">
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
      <p className="link link-info text-end text-lg">How to receive NFTs</p>
      <div className="w-full absolute bottom-[5%] flex justify-center">
        <button className="btn btn-lg rounded-3xl w-[40%] text-3xl">
          Redeem
        </button>
      </div>
    </div>
  );
};

export default RedeemPC0;
