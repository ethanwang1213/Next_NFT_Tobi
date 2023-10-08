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
import { DisplayMode } from "./DiscordOAuthProvider";

type Props = {
  children: ReactNode;
};

type ContextType = {
  shouldRefresh: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
  debugDiscordButtonMode: {
    current: DisplayMode;
    set: Dispatch<SetStateAction<DisplayMode>>;
  };
};

const DebugContext = createContext<ContextType>({} as ContextType);

/**
 * デバッグモードのデータを管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const DebugProvider: React.FC<Props> = ({ children }) => {
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [debugDiscordButtonMode, setDebugDiscordButtonMode] =
    useState<DisplayMode>("NONE");

  useEffect(() => {
    setShouldRefresh(false);
  }, [shouldRefresh]);

  // displayModeをランダムで設定する
  useEffect(() => {
    if (shouldRefresh) {
      setDebugDiscordButtonMode(
        ["NONE", "OAUTH", "JOIN", "STAMP"][
          Math.floor(Math.random() * 4)
        ] as DisplayMode
      );
    }
  }, [shouldRefresh]);

  const contextValue = useMemo(
    () => ({
      shouldRefresh: {
        current: shouldRefresh,
        set: setShouldRefresh,
      },
      debugDiscordButtonMode: {
        current: debugDiscordButtonMode,
        set: setDebugDiscordButtonMode,
      },
    }),
    [
      shouldRefresh,
      debugDiscordButtonMode,
      setShouldRefresh,
      setDebugDiscordButtonMode,
    ]
  );

  return (
    <DebugContext.Provider value={contextValue}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);
