import RedeemStatusSp from "./parent/RedeemStatusSp";
import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import TryAgainButton from "../../CloseModalButton/TryAgainButton";
import CustomerSupportButton from "../../CustomerSupportButton";

/**
 * スマホ表示モーダル内の
 * サーバーエラーによる引き換え失敗時の表示用コンポーネント
 * @returns
 */
const ServerErrorSp: React.FC = () => {
  return (
    <RedeemStatusSp
      icon={<CautionIcon className={"w-[54%] h-full"} />}
      title={"Error"}
      titleSize={34}
      description={
        <div>
          <p className="font-bold text-error grid content-center mt-1 mb-6 text-[17px]">
            <span>
              {"予期せぬエラーが発生しました。"}
              <br />
              <CustomerSupportButton
                className="link link-error"
                text="カスタマーサポート"
              />
              {"にお問い合わせください。"}
            </span>
          </p>
          <CustomerSupportButton
            className="btn btn-secondary btn-md btn-circle text-lg w-[88%] mb-6 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
            text="お問い合わせ"
          />
          <TryAgainButton
            className="btn btn-secondary btn-md btn-circle text-lg w-[88%] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
            text="もう一度試す"
          />
        </div>
      }
    />
  );
};

export default ServerErrorSp;
