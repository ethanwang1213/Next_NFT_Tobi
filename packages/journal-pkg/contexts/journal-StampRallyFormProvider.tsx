import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type ContextType = {
  isSubmitting: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
};

const StampRallyFormContext = createContext<ContextType>({} as ContextType);

/**
 * スタンプラリーのフォームの状態を管理するコンテキスト
 * 
 * 使用方法：pages/index.tsxで、WatchMintStatusProviderとともにcontextを宣言する
 * 理由：ユーザーログインを必要とする機能であるため、ログイン後のページであるindexで宣言する必要がある
 * @param param0
 * @returns {ReactElement} The `StampRallyFormProvider` context component
 */
export const StampRallyFormProvider: React.FC<Props> = ({ children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contextValue: ContextType = useMemo(
    () => ({
      isSubmitting: {
        current: isSubmitting,
        set: setIsSubmitting,
      },
    }),
    [isSubmitting, setIsSubmitting]
  );

  return (
    <StampRallyFormContext.Provider value={contextValue}>
      {children}
    </StampRallyFormContext.Provider>
  );
};

export const useStampRallyForm = () => useContext(StampRallyFormContext);
