import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import RedeemStatusSP from "./parent/RedeemStatusSp";

/**
 * スマホ表示モーダル内の
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodeSp: React.FC = () => {
  return (
    <RedeemStatusSP
      icon={
        <div className="w-full flex justify-center">
          <FeatherIcon className={"w-[70%] h-full"} />
        </div>
      }
      title={"Checking Code..."}
    />
  );
};

export default CheckingCodeSp;
