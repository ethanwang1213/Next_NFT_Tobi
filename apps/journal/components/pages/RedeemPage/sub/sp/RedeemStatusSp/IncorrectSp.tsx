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
      icon={<CautionIcon className={"w-[54%] h-full"} />}
      title={"Error"}
      titleSize={34}
      description={
        <div>
          <p className="font-bold text-error text-[17px] grid content-center mb-8">
            シリアルコードが正しくありません。
          </p>
          <TryAgainButton
            className="btn btn-secondary btn-md btn-circle text-lg w-[88%] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.5)]"
            text="戻る"
          />
        </div>
      }
    />
  );
};

export default IncorrectSp;
