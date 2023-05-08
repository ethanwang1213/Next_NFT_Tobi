import CheckingCodePc from "./RedeemStatusPc/CheckingCodePc";
import SuccessPc from "./RedeemStatusPc/SuccessPc";
import IncorrectPc from "./RedeemStatusPc/IncorrectPc";
import ServerErrorPc from "./RedeemStatusPc/ServerErrorPc";
import { RedeemStatusContext } from "../../RedeemPage";
import { useContext } from "react";

const RedeemPC1: React.FC = () => {
  const { current: redeemStatus } = useContext(RedeemStatusContext);

  return (
    <div className="h-full flex flex-col min-h-[300px] text-center relative">
      {redeemStatus === "CHECKING" && <CheckingCodePc />}
      {redeemStatus === "SUCCESS" && <SuccessPc />}
      {redeemStatus === "INCORRECT" && <IncorrectPc />}
      {redeemStatus === "SERVER_ERROR" && <ServerErrorPc />}
    </div>
  );
};

export default RedeemPC1;
