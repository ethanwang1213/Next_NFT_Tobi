import RedeemStatusPC from "./parent/RedeemStatusPc";
import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import CustomerSupportButton from "../../CustomerSupportButton";

/**
 * PC表示右ページの
 * サーバーエラーによる引き換え失敗時の表示用コンポーネント
 * @returns
 */
const ServerErrorPc: React.FC = () => {
  return (
    <RedeemStatusPC
      icon={<CautionIcon className={"w-[40%] h-full"} />}
      title={"Error"}
      titleSize={84}
    >
      <div className="text-[28px] font-bold text-warning mt-2">
        <p className="mb-4">{"予期せぬエラーが発生しました。"}</p>
        <p>
          <CustomerSupportButton
            className="link link-warning"
            text="カスタマーサポート"
          />
          {"にお問い合わせください。"}
        </p>
      </div>
    </RedeemStatusPC>
  );
};

export default ServerErrorPc;
