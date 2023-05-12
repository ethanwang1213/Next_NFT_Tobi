import RedeemStatusSP from "./parent/RedeemStatusSp";
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
    <RedeemStatusSP
      icon={<CautionIcon className={"w-[54%] h-full"} />}
      title={"Error"}
      titleSize={34}
      description={
        <div>
          <p className="font-bold text-error grid content-center mb-6">
            <span>
              {"An error has occurred."}
              <br />
              {"Please contact "}
              <CustomerSupportButton
                className="link link-error"
                text="customer support"
              />
              {"."}
            </span>
          </p>
          <CustomerSupportButton
            className="btn btn-secondary btn-md btn-circle text-lg w-[88%] mb-6"
            text="Contact"
          />
          <TryAgainButton className="btn btn-secondary btn-md btn-circle text-lg w-[88%]" />
        </div>
      }
    />
  );
};

export default ServerErrorSp;
