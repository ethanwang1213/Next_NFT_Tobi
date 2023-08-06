import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import RedeemStatusSp from "./parent/RedeemStatusSp";

/**
 * スマホ表示モーダル内の
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodeSp: React.FC = () => {
  return (
    <RedeemStatusSp
      icon={
        <div className="w-full flex justify-center">
          <FeatherIcon className={"w-[68%] h-full"} />
        </div>
      }
      title={"Checking Code..."}
      titleSize={26}
      isFade
    />
  );
};

export default CheckingCodeSp;
