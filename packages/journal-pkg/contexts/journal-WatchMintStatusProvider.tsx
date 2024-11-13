import { useIntervalBySec } from "journal-pkg/hooks/journal-useInterval";
import { StampRallyEvents } from "journal-pkg/types/stampRallyTypes";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./journal-AuthProvider";

type Props = {
  children: ReactNode;
};

type ContextType = {};

const WatchMintStatusContext = createContext<ContextType>({} as ContextType);

/**
 * TOBIRAPOLIS祭スタンプラリー用。mint中であれば監視する。
 * AuthProviderに依存している。
 *
 * 使用方法：pages/index.tsxで、StampRallyFormProviderとともにcontextを宣言する
 * 理由：ユーザーログインを必要とする機能であるため、ログイン後のページであるindexで宣言する必要がある
 * @param param0
 * @returns {ReactElement} The `WatchMintStatusProvider` context component
 */
export const WatchMintStatusProvider: React.FC<Props> = ({ children }) => {
  const { user, refetchUserMintStatus } = useAuth();
  const { paused, setPaused } = useIntervalBySec(refetchUserMintStatus, 7);

  const watch = () => {
    setPaused(false);
    console.log("watch");
  };

  const unwatch = () => {
    setPaused(true);
    console.log("unwatch");
  };

  const isWatching = () => !paused;

  useEffect(() => {
    const mode = process.env.NEXT_PUBLIC_STAMPRALLY_MODE as StampRallyEvents;
    if (!mode) return;

    const mintStatus = user?.mintStatus?.[mode];
    // 現在監視中の時、mintStatusにmint中のものが存在しなければ監視を終了する
    // 現在監視中でない時、mintStatusにmint中のものが存在すれば監視を開始する
    if (!mintStatus) {
      if (isWatching()) unwatch();
      return;
    }
    // completeは無視
    if ("Complete" in mintStatus) mintStatus.Complete = undefined;

    const inProgressExist = !!Object.values(mintStatus).find(
      (v) => v === "IN_PROGRESS",
    );

    if (isWatching()) {
      if (!inProgressExist) unwatch();
    } else {
      if (inProgressExist) watch();
    }
  }, [user]);

  const contextValue: ContextType = useMemo(() => ({}), []);

  return (
    <WatchMintStatusContext.Provider value={contextValue}>
      {children}
    </WatchMintStatusContext.Provider>
  );
};

export const useStampRallyForm = () => useContext(WatchMintStatusContext);
