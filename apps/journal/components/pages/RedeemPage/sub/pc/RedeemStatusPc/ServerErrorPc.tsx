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
      description={
        <div className="text-3xl font-bold text-warning mt-2">
          <p className="mb-4">{"An error has occurred."}</p>
          <p>
            {"Please contact "}
            <CustomerSupportButton
              className="link link-warning"
              text="customer support"
            />
            {"."}
          </p>
        </div>
      }
    />
  );
};

export default ServerErrorPc;
