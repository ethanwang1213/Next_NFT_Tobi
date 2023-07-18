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
      iconType={}
      title={"Checking Code..."}
      titleSize={26}
      isFade
    />
  );
};

export default CheckingCodeSp;
