import React, {
  ReactNode,
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
  useMemo,
} from "react";

type Props = {
  children: ReactNode;
};

type ContextType = {
  isMute: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
};

const SoundConfigContext = createContext<ContextType>({} as ContextType);

/**
 * サウンドの設定を管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const SoundConfigProvider: React.FC<Props> = ({ children }) => {
  const [isMute, setIsMute] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({
      isMute: {
        current: isMute,
        set: setIsMute,
      },
    }),
    [isMute, setIsMute]
  );

  return (
    <SoundConfigContext.Provider value={contextValue}>
      {children}
    </SoundConfigContext.Provider>
  );
};

export const useSoundConfig = () => useContext(SoundConfigContext);
