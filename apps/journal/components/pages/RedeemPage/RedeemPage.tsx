import { Dispatch, SetStateAction, createContext, useState } from "react";
import RedeemPage0 from "./RedeemPage0";
import RedeemPage1 from "./RedeemPage1";

type Props = {
  pageNum: number;
};

export type RedeemStatus = "CHECKING" | "SUCCESS" | "INCORRECT" | "SERVER_ERROR";
type RedeemStatusContext = {
  current: RedeemStatus;
  set: Dispatch<SetStateAction<RedeemStatus>>;
};

export const RedeemStatusContext = createContext<RedeemStatusContext>(null);

const RedeemPage: React.FC<Props> = ({ pageNum }) => {
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>(
    "CHECKING"
    // "SUCCESS"
    // "INCORRECT"
    // "SERVER_ERROR"
  );

  return (
    <RedeemStatusContext.Provider
      value={{ current: redeemStatus, set: setRedeemStatus }}
    >
      {pageNum % 2 === 0 ? <RedeemPage0 /> : <RedeemPage1 />}
    </RedeemStatusContext.Provider>
  );
};

export default RedeemPage;
