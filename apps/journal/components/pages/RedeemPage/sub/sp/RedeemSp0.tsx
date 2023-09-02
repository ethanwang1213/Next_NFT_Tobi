import HowToLink from "../HowToLink";
import InputRedemptionCodeBox from "../InputRedemptionCodeBox";
import RedeemButton from "../RedeemButton";
import SelfData from "../SelfData";
import RedeemStatusModal from "./RedeemStatusModal";
import BookIcon from "../../../../../public/images/icon/Journalbook_journal.svg";

/**
 * redeemページの左ページのスマホ表示用コンポーネント
 * @returns
 */
const RedeemSp0: React.FC = () => {
  return (
    <div className="h-full pt-4 flex flex-col">
      <div>
        <InputRedemptionCodeBox
          classNames={{
            input:
              "input input-bordered w-full h-[46px] bg-transparent text-md border-2 rounded-xl placeholder:text-sm",
            p: "text-xs text-end font-bold",
          }}
        />
      </div>
      <div className="grow grid content-center flex justify-center px-[24%] py-[5%] pb-[7%]">
        <BookIcon className="w-full h-full" />
      </div>
      <div className="w-full mb-[4%]">
        <SelfData />
      </div>
      <div className="w-full">
        <div className="w-full flex justify-center">
          <RedeemButton />
        </div>
      </div>
      <HowToLink className="w-full link link-info text-end text-sm pt-[10%] relative min-h-[7%] h-[7%]" />
      {/* スマホ表示用モーダル */}
      <RedeemStatusModal />
    </div>
  );
};

export default RedeemSp0;
