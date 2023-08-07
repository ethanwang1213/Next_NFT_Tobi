import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import RedeemStatusSP from "./parent/RedeemStatusSp";
import tailwindConfig from "@/tailwind.config.js";

/**
 * スマホ表示モーダル内の
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodeSp: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <RedeemStatusSP
      icon={
        <div className="w-full flex justify-center">
          <FeatherIcon className={"w-[68%] h-full"} />
        </div>
      }
      title={"Checking Code..."}
      titleSize={theme.extend.fontSize.redeemStatus.sp.checking}
      isFade
    />
  );
};

export default CheckingCodeSp;
