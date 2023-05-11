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
      icon={<CautionIcon className={"w-[20%] h-full"} />}
      title={"Error"}
      description={
        <p className="text-2xl text-primary grid content-center">
          <span>
            {"An error has occurred."}
            <br />
            {"Please contact "}
            <CustomerSupportButton
              className="link link-info"
              text="customer support"
            />
            {"."}
          </span>
        </p>
      }
    />
  );
};

export default ServerErrorPc;
