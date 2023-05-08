import CheckingCodeSp from "./RedeemStatusSp/CheckingCodeSp";
import SuccessSp from "./RedeemStatusSp/SuccessSp";
import IncorrectSp from "./RedeemStatusSp/IncorrectSp";
import ServerErrorSp from "./RedeemStatusSp/ServerErrorSp";

type Props = {
  redeemStatus: "CHECKING" | "SUCCESS" | "INCORRECT" | "SERVER_ERROR";
};

const RedeemStatusModal: React.FC<Props> = ({ redeemStatus }) => {
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal px-4">
        <div className="modal-box">
          <div className="h-full flex flex-col text-center m-2 mt-6 relative">
            {redeemStatus === "CHECKING" && <CheckingCodeSp />}
            {redeemStatus === "SUCCESS" && <SuccessSp />}
            {redeemStatus === "INCORRECT" && <IncorrectSp />}
            {redeemStatus === "SERVER_ERROR" && <ServerErrorSp />}
          </div>
        </div>
      </div>
    </>
  );
};

export default RedeemStatusModal;
