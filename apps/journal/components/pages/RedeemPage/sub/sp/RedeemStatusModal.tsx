import CheckingCodeSp from "./RedeemStatusSp/CheckingCodeSp";
import SuccessSp from "./RedeemStatusSp/SuccessSp";
import IncorrectSp from "./RedeemStatusSp/IncorrectSp";
import ServerErrorSp from "./RedeemStatusSp/ServerErrorSp";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { RedeemContext } from "../../../../../contexts/RedeemContextProvider";
import CloseModalButton from "../CloseModalButton/parent/CloseModalButton";

/**
 * redeem codeチェックの状態を表示するモーダルのコンポーネント
 * @returns
 */
const RedeemStatusModal: React.FC = () => {
  const { redeemStatus } = useContext(RedeemContext);

  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal px-4">
        <div className="modal-box">
          {(redeemStatus.current === "INCORRECT" ||
            redeemStatus.current === "SERVER_ERROR") && (
            <CloseModalButton className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
              <FontAwesomeIcon icon={faXmark} fontSize={24} />
            </CloseModalButton>
          )}
          <div className="h-full flex flex-col text-center m-2 mt-6 relative">
            {redeemStatus.current === "NONE" && <></>}
            {redeemStatus.current === "CHECKING" && <CheckingCodeSp />}
            {redeemStatus.current === "SUCCESS" && <SuccessSp />}
            {redeemStatus.current === "INCORRECT" && <IncorrectSp />}
            {redeemStatus.current === "SERVER_ERROR" && <ServerErrorSp />}
          </div>
        </div>
      </div>
    </>
  );
};

export default RedeemStatusModal;
