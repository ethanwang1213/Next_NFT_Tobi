import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";
import RedeemDataLine from "../../../TypeValueLine/RedeemDataLine";

const SelfData: React.FC = () => {
  const { selfAccount, selfJournalId } = useContext(RedeemContext);

  return (
    <div className="grid gap-[1%] sm:gap-10">
      <RedeemDataLine
        dataType={"受け取り対象アカウント名"}
        dataValue={selfAccount.current ? selfAccount.current : "-"}
      />
      <RedeemDataLine
        dataType={"受け取り対象メールアドレス"}
        dataValue={selfJournalId.current ? selfJournalId.current : "-"}
        // hidable={true}
      />
    </div>
  );
};

export default SelfData;
