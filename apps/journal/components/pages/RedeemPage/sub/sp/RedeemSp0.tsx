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
const RedeemSP0: React.FC = () => {
  return (
    <div className="relative h-full pt-4 flex flex-col">
      <div className="">
        <InputRedemptionCodeBox
          classNames={{
            input:
              "input input-bordered w-full h-[46px] bg-transparent text-md border-2 rounded-xl",
            p: "text-xs text-end font-bold",
          }}
        />
      </div>
      <div className="grow grid content-center flex justify-center px-[12%] py-[4%]">
        <BookIcon className="w-full h-full" />
      </div>
      <div className="w-full pb-[21%]">
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
