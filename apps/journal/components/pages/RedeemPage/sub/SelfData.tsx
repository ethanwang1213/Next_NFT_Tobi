import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";
import RedeemDataLine from "../../../TypeValueLine/RedeemDataLine";

const SelfData: React.FC = () => {
  const { selfAccount, selfJournalId } = useContext(RedeemContext);

  return (
    <div className="grid gap-4">
      <RedeemDataLine
        lineType={"Receive Account"}
        lineValue={selfAccount.current ? selfAccount.current : "-"}
      />
      <RedeemDataLine
        lineType={"Receive Journal ID"}
        lineValue={selfJournalId.current ? selfJournalId.current : "-"}
        hidable={true}
      />
    </div>
  );
};

export default SelfData;
