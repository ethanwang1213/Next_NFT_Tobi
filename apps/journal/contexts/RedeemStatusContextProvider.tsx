import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

export type RedeemStatus =
  | "NONE"
  | "CHECKING"
  | "SUCCESS"
  | "INCORRECT"
  | "SERVER_ERROR";

type RedeemStatusContext = {
  current: RedeemStatus;
  set: Dispatch<SetStateAction<RedeemStatus>>;
};

export const RedeemStatusContext = createContext<RedeemStatusContext>(
  {} as RedeemStatusContext
);

const RedeemStatusContextProvider: React.FC<Props> = ({ children }) => {
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>(
    // "NONE"
    // "CHECKING"
    "SUCCESS"
    // "INCORRECT"
    // "SERVER_ERROR"
  );

  const redeemStatusContextValue = useMemo<RedeemStatusContext>(
    () => ({ current: redeemStatus, set: setRedeemStatus }),
    [redeemStatus, setRedeemStatus]
  );

  return (
    <RedeemStatusContext.Provider value={redeemStatusContextValue}>
      {children}
    </RedeemStatusContext.Provider>
  );
};

export default RedeemStatusContextProvider;
