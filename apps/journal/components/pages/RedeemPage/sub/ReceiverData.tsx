import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";
import RedeemDataLine from "../../../TypeValueLine/RedeemDataLine";

const ReceiverData: React.FC = () => {
  const { receiverAccount, receiverJournalId } = useContext(RedeemContext);

  return (
    <div className="grid gap-4">
      <RedeemDataLine
        lineType={"Receive Account"}
        lineValue={receiverAccount.current}
      />
      <RedeemDataLine
        lineType={"Receive Journal ID"}
        lineValue={receiverJournalId.current}
        hidable={true}
      />
    </div>
  );
};

export default ReceiverData;
