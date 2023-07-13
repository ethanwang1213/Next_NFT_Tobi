import RedeemStatusSp from "./parent/RedeemStatusSp";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";
import CheckNFTButton from "../../CloseModalButton/CheckNFTButton";

/**
 * スマホ表示モーダル内の
 * 引き換え成功時の表示用コンポーネント
 * @returns
 */
const SuccessSp: React.FC = () => {
  return (
    <RedeemStatusSp
      icon={
        <div className="w-full flex justify-center">
          <FeatherCheckIcon className={"w-[60%] h-full"} />
        </div>
      }
      title={"Success!!"}
      titleSize={36}
      description={
        <CheckNFTButton className="btn btn-secondary btn-md btn-circle text-lg w-[80%] mt-6 mb-2 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.6)]" />
      }
    />
  );
};

export default SuccessSp;
