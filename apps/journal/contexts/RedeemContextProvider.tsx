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

type RedeemContextType = {
  redeemStatus: {
    current: RedeemStatus;
    set: Dispatch<SetStateAction<RedeemStatus>>;
  };
};

export const RedeemContext = createContext<RedeemContextType>(
  {} as RedeemContextType
);

const RedeemContextProvider: React.FC<Props> = ({ children }) => {
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>("NONE");

  const redeemContextValue = useMemo<RedeemContextType>(
    () => ({ redeemStatus: { current: redeemStatus, set: setRedeemStatus } }),
    [redeemStatus, setRedeemStatus]
  );

  return (
    <RedeemContext.Provider value={redeemContextValue}>
      {children}
    </RedeemContext.Provider>
  );
};

export default RedeemContextProvider;
