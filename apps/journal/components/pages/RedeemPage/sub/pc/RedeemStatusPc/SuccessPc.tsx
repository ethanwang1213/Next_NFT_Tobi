import RedeemStatusPC from "./parent/RedeemStatusPc";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";
import CheckNFTButton from "../../CloseModalButton/CheckNFTButton";

/**
 * PC表示右ページの
 * 引き換え成功時の表示用コンポーネント
 * @returns
 */
const SuccessPc: React.FC = () => {
  return (
    <RedeemStatusPC
      icon={<FeatherCheckIcon className={"w-full h-full"} />}
      title={"Success!!"}
      description={
        <CheckNFTButton className="btn btn-outline btn-lg rounded-3xl text-3xl w-[40%] absolute bottom-0" />
      }
    />
  );
};

export default SuccessPc;
