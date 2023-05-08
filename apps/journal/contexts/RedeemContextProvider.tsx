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

type RedeemStatus =
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
  inputCode: {
    current: string;
    set: Dispatch<SetStateAction<string>>;
  };
  receiverAccount: {
    current: string;
    set: Dispatch<SetStateAction<string>>;
  };
  receiverJournalId: {
    current: string;
    set: Dispatch<SetStateAction<string>>;
  };
};

export const RedeemContext = createContext<RedeemContextType>(
  {} as RedeemContextType
);

const RedeemContextProvider: React.FC<Props> = ({ children }) => {
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>("NONE");
  const [inputCode, setInputCode] = useState<string>("");
  const [receiverAccount, setReceiverAccount] = useState<string>("");
  const [receiverJournalId, setReceiverJournalId] = useState<string>("");

  const redeemContextValue = useMemo<RedeemContextType>(
    () => ({
      redeemStatus: {
        current: redeemStatus,
        set: setRedeemStatus,
      },
      inputCode: {
        current: inputCode,
        set: setInputCode,
      },
      receiverAccount: {
        current: receiverAccount,
        set: setReceiverAccount,
      },
      receiverJournalId: {
        current: receiverJournalId,
        set: setReceiverJournalId,
      },
    }),
    [
      redeemStatus,
      inputCode,
      receiverAccount,
      receiverJournalId,
      setRedeemStatus,
      setInputCode,
      setReceiverAccount,
      setReceiverJournalId,
    ]
  );

  return (
    <RedeemContext.Provider value={redeemContextValue}>
      {children}
    </RedeemContext.Provider>
  );
};

export default RedeemContextProvider;
