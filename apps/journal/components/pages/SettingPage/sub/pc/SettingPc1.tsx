import CheckingCodePc from "@/components/pages/SettingPage/sub/pc/SettingStatusPc/CheckingCodePc";
import SuccessPc from "@/components/pages/SettingPage/sub/pc/SettingStatusPc/SuccessPc";
import IncorrectPc from "@/components/pages/SettingPage/sub/pc/SettingStatusPc/IncorrectPc";
import ServerErrorPc from "@/components/pages/SettingPage/sub/pc/SettingStatusPc/ServerErrorPc";
import { useRedeemStatus } from "../../../../../contexts/journal-RedeemStatusProvider";

/**
 * redeemページの右ページのPC表示用コンポーネント
 * @returns
 */
const SettingPc1: React.FC = () => {
  const { redeemStatus } = useRedeemStatus();

  return (
    <div className="h-full flex flex-col min-h-[300px] text-center relative">
      {redeemStatus.current === "NONE" && <></>}
      {redeemStatus.current === "CHECKING" && <CheckingCodePc />}
      {redeemStatus.current === "SUCCESS" && <SuccessPc />}
      {redeemStatus.current === "INCORRECT" && <IncorrectPc />}
      {redeemStatus.current === "SERVER_ERROR" && <ServerErrorPc />}
    </div>
  );
};

export default SettingPc1;
