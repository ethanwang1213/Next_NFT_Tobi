import CheckingCodeSp from "@/components/pages/SettingPage/sub/sp/SettingStatusSp/CheckingCodeSp";
import SuccessSp from "@/components/pages/SettingPage/sub/sp/SettingStatusSp/SuccessSp";
import IncorrectSp from "@/components/pages/SettingPage/sub/sp/SettingStatusSp/IncorrectSp";
import ServerErrorSp from "@/components/pages/SettingPage/sub/sp/SettingStatusSp/ServerErrorSp";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRedeemStatus } from "../../../../../contexts/journal-RedeemStatusProvider";
import CloseModalButton from "../CloseModalButton";

/**
 * redeem codeチェックの状態を表示するモーダルのコンポーネント
 * @returns
 */
const RedeemStatusModal: React.FC = () => {
  const { redeemStatus, modalInputIsChecked } = useRedeemStatus();

  return (
    <>
      <input
        type="checkbox"
        id="redeem-modal"
        className="modal-toggle"
        checked={modalInputIsChecked.current}
        onChange={() => {}}
      />
      <div className="modal px-4">
        <div className="modal-box px-0">
          {(redeemStatus.current === "SUCCESS" ||
            redeemStatus.current === "INCORRECT" ||
            redeemStatus.current === "SERVER_ERROR") && (
            <CloseModalButton className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
              <FontAwesomeIcon
                icon={faXmark}
                fontSize={24}
                className="text-accent"
              />
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
