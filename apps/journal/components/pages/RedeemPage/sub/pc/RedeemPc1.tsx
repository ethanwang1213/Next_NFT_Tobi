import CheckingCodePc from "./RedeemStatusPc/CheckingCodePc";
import SuccessPc from "./RedeemStatusPc/SuccessPc";
import IncorrectPc from "./RedeemStatusPc/IncorrectPc";
import ServerErrorPc from "./RedeemStatusPc/ServerErrorPc";
import { RedeemContext } from "../../../../../contexts/RedeemContextProvider";
import { useContext } from "react";

const RedeemPC1: React.FC = () => {
  const { redeemStatus } = useContext(RedeemContext);

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

export default RedeemPC1;
