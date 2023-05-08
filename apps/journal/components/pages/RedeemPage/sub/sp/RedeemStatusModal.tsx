import CheckingCodeSp from "./RedeemStatusSp/CheckingCodeSp";
import SuccessSp from "./RedeemStatusSp/SuccessSp";
import IncorrectSp from "./RedeemStatusSp/IncorrectSp";
import ServerErrorSp from "./RedeemStatusSp/ServerErrorSp";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { RedeemStatusContext } from "../../RedeemPage";

const RedeemStatusModal: React.FC = () => {
  const { current: redeemStatus } = useContext(RedeemStatusContext);

  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal px-4">
        <div className="modal-box">
          {(redeemStatus === "INCORRECT" ||
            redeemStatus === "SERVER_ERROR") && (
            <label
              htmlFor="my-modal"
              className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
            >
              <FontAwesomeIcon icon={faXmark} fontSize={24} />
            </label>
          )}
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
