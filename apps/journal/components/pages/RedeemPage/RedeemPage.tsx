import { useContext, useEffect } from "react";
import { RedeemStatusContext } from "../../../contexts/RedeemStatusContextProvider";
import RedeemPage0 from "./sub/RedeemPage0";
import RedeemPage1 from "./sub/RedeemPage1";

type Props = {
  pageNum: number;
};

const RedeemPage: React.FC<Props> = ({ pageNum }) => {
  const { current: redeemStatus, set: setRedeemStatus } =
    useContext(RedeemStatusContext);

  useEffect(() => {
    console.log("current: ", redeemStatus);
    if (redeemStatus === "CHECKING") {
      // TODO: 引き換えの処理を実行する
      // 仮置きとして、1秒後にCHECKINGからstatusが更新されるようにしている
      setTimeout(() => {
        setRedeemStatus(
          "INCORRECT"
          // "SERVER_ERROR"
          // "SUCCESS"
        );
      }, 1000);
    }
  }, [redeemStatus]);

  return pageNum % 2 === 0 ? <RedeemPage0 /> : <RedeemPage1 />;
};

export default RedeemPage;
