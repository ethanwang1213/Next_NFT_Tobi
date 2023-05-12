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
      icon={<FeatherCheckIcon className={"w-full h-full "} />}
      title={"Success!!"}
      titleSize={84}
      description={
        <CheckNFTButton className="btn btn-outline btn-lg btn-accent rounded-3xl text-3xl w-[60%] sm:h-[74px] sm:text-[32px] border-4 absolute bottom-[5%] " />
      }
    />
  );
};

export default SuccessPc;
