import RedeemStatusPC from "./parent/RedeemStatusPc";
import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import tailwindConfig from "@/tailwind.config.js";

/**
 * PC表示右ページの
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodePc: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <RedeemStatusPC
      icon={
        <FeatherIcon className={"w-full h-full text-accent drop-shadow-lg"} />
      }
      title={"Checking code..."}
      titleSize={theme.extend.fontSize.redeemStatus.pc.checking}
      isFade
    />
  );
};

export default CheckingCodePc;
