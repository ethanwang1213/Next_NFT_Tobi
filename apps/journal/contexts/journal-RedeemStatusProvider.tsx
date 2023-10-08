import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "contexts/journal-AuthProvider";
import { RedeemStatus } from "types/journal-types";

type Props = {
  children: ReactNode;
};

type ContextType = {
  // 引き換えコードのチェックの状態
  redeemStatus: {
    current: RedeemStatus;
    set: Dispatch<SetStateAction<RedeemStatus>>;
  };
  // 引き換えコードの入力値
  inputCode: {
    current: string;
    set: Dispatch<SetStateAction<string>>;
  };
  // 自身のアカウント名
  selfAccount: {
    current: string;
    set: Dispatch<SetStateAction<string>>;
  };
  // 自身のジャーナルID
  selfJournalId: {
    current: string;
    set: Dispatch<SetStateAction<string>>;
  };
  // モーダルのチェックボックスの状態
  //  通常のDaisyUIのモーダルではlabelとinputをidで紐づけて操作するが、
  //  inputが複数あると正常に動作しない（idはただ一つの要素を指すため）。
  //  PCとスマホのコンポーネントが共存するためこの不具合が発生してしまう。
  //  そこで、通常の方法ではなく、inputのcheckedをstateで管理することで対応している。
  modalInputIsChecked: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
  canRedeem: boolean;
};

const RedeemStatusContext = createContext<ContextType>({} as ContextType);

/**
 * redeemページのデータを管理するコンテキスト
 * @param param0
 * @returns
 */
export const RedeemStatusProvider: React.FC<Props> = ({ children }) => {
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>("NONE");
  const [inputCode, setInputCode] = useState<string>("");
  const [selfAccount, setSelfAccount] = useState<string>("");
  const [selfJournalId, setSelfJournalId] = useState<string>("");
  const [modalInputIsChecked, setModalInputIsChecked] =
    useState<boolean>(false);
  const { user } = useAuth();
  const [canRedeem, setCanRedeem] = useState<boolean>(false);

  // 匿名ログインの場合は引き換えできない
  useEffect(() => {
    if (!user) return;
    setCanRedeem(user && user.email && user.email !== "");
  }, [user]);

  const contextValue = useMemo<ContextType>(
    () => ({
      redeemStatus: {
        current: redeemStatus,
        set: setRedeemStatus,
      },
      inputCode: {
        current: inputCode,
        set: setInputCode,
      },
      selfAccount: {
        current: selfAccount,
        set: setSelfAccount,
      },
      selfJournalId: {
        current: selfJournalId,
        set: setSelfJournalId,
      },
      modalInputIsChecked: {
        current: modalInputIsChecked,
        set: setModalInputIsChecked,
      },
      canRedeem: canRedeem,
    }),
    [
      redeemStatus,
      inputCode,
      selfAccount,
      selfJournalId,
      modalInputIsChecked,
      canRedeem,
      setRedeemStatus,
      setInputCode,
      setSelfAccount,
      setSelfJournalId,
      setModalInputIsChecked,
    ]
  );

  return (
    <RedeemStatusContext.Provider value={contextValue}>
      {children}
    </RedeemStatusContext.Provider>
  );
};

export const useRedeemStatus = () => useContext(RedeemStatusContext);
