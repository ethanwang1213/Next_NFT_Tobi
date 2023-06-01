import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type DebugContextType = {
  shouldRefresh: boolean;
  setShouldRefresh: Dispatch<SetStateAction<boolean>>;
};

const DebugContext = createContext<DebugContextType>({} as DebugContextType);

/**
 * デバッグモードのデータを管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
const DebugProvider: React.FC<Props> = ({ children }) => {
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  useEffect(() => {
    setShouldRefresh(false);
  }, [shouldRefresh]);

  return (
    <DebugContext.Provider
      value={{
        shouldRefresh,
        setShouldRefresh,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};

export default DebugProvider;

export const useDebug = () => useContext(DebugContext);
