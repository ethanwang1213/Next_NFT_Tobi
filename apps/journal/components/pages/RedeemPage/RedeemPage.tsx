import { useContext, useEffect } from "react";
import { RedeemContext } from "../../../contexts/RedeemContextProvider";
import RedeemPage0 from "./sub/RedeemPage0";
import RedeemPage1 from "./sub/RedeemPage1";

type Props = {
  pageNum: number;
};

const RedeemPage: React.FC<Props> = ({ pageNum }) => {
  const { redeemStatus, inputCode, receiverAccount, receiverJournalId } =
    useContext(RedeemContext);

  useEffect(() => {
    receiverAccount.set("KEISUKE");
    receiverJournalId.set("keisukeId");
  }, [receiverJournalId.current]);

  useEffect(() => {
    console.log("current: ", redeemStatus);
    if (redeemStatus.current === "CHECKING") {
      // TODO: 引き換えの処理を実行する
      // 仮置きとして、1秒後にCHECKINGからstatusが更新されるようにしている
      setTimeout(() => {
        redeemStatus.set(
          "INCORRECT"
          // "SERVER_ERROR"
          // "SUCCESS"
        );
      }, 1000);
    }
  }, [redeemStatus.current]);

  return pageNum % 2 === 0 ? <RedeemPage0 /> : <RedeemPage1 />;
};

export default RedeemPage;
