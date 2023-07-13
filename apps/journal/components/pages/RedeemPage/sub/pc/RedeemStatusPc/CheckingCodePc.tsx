import RedeemStatusPc from "./parent/RedeemStatusPc";
import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";

/**
 * PC表示右ページの
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodePc: React.FC = () => {
  return (
    <RedeemStatusPc
      icon={<FeatherIcon className={"w-full h-full text-accent drop-shadow-lg"} />}
      title={"Checking code..."}
      titleSize={72}
      isFade
    />
  );
};

export default CheckingCodePc;
