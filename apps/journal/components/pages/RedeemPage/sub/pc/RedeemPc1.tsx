import CheckingCodePc from "./RedeemStatusPc/CheckingCodePc";
import SuccessPc from "./RedeemStatusPc/SuccessPc";
import IncorrectPc from "./RedeemStatusPc/IncorrectPc";
import ServerErrorPc from "./RedeemStatusPc/ServerErrorPc";
import { useRedeemStatus } from "../../../../../contexts/RedeemStatusProvider";

/**
 * redeemページの右ページのPC表示用コンポーネント
 * @returns
 */
const RedeemPc1: React.FC = () => {
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

export default RedeemPc1;
