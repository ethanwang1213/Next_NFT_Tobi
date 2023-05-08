import { useContext, useEffect } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";
import TypeValueLine from "../../../TypeValueLine";

const ReceiverData: React.FC = () => {
  const { receiverAccount, receiverJournalId } = useContext(RedeemContext);

  return (
    <div className="grid gap-4">
      <TypeValueLine
        lineType={"Receive Account"}
        lineValue={receiverAccount.current}
        styleMode={"REDEEM_DATA"}
      />
      <TypeValueLine
        lineType={"Receive Journal ID"}
        lineValue={receiverJournalId.current}
        styleMode={"REDEEM_DATA"}
        hidable={true}
      />
    </div>
  );
};

export default ReceiverData;
