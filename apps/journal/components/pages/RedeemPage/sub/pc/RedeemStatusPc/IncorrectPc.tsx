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
      icon={<CautionIcon className={"w-[20%] h-full"} />}
      title={"Error"}
      description={
        <p className="text-3xl font-bold text-error grid content-center">
          The Redemption Code is incorrect.
        </p>
      }
    />
  );
};

export default IncorrectPc;
