import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import RedeemStatusSP from "./parent/RedeemStatusSp";
import TryAgainButton from "../../CloseModalButton/TryAgainButton";

/**
 * スマホ表示モーダル内の
 * コード不適合による引き換え失敗時の表示用コンポーネント
 * @returns
 */
const IncorrectSp: React.FC = () => {
  return (
    <RedeemStatusSP
      icon={<CautionIcon className={"w-[40%] h-full"} />}
      title={"Error"}
      description={
        <div>
          <p className="font-bold text-error grid content-center mb-8">
            The Redemption Code is incorrect.
          </p>
          <TryAgainButton className="btn btn-secondary btn-md btn-circle text-lg w-[90%]" />
        </div>
      }
    />
  );
};

export default IncorrectSp;
