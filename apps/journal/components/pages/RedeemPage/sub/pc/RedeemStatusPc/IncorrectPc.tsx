import RedeemStatusPC from "./parent/RedeemStatusPc";
import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";

/**
 * PC表示右ページの
 * コード不適合による引き換え失敗時の表示用コンポーネント
 * @returns
 */
const IncorrectPc: React.FC = () => {
  return (
    <RedeemStatusPC
      icon={<CautionIcon className={"w-[40%] h-full"} />}
      title={"Error"}
      titleSize={84}
      description={
        <p className="sm:text-[35px] font-bold text-error mt-2 text-warning">
          The Redemption Code is incorrect.
        </p>
      }
    />
  );
};

export default IncorrectPc;
