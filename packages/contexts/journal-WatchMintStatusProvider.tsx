import React, {
  ReactNode,
  createContext,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { useAuth } from "./journal-AuthProvider";
import { useIntervalBySec } from "hooks/journal-useInterval";

type Props = {
  children: ReactNode;
};

type ContextType = {};

const WatchMintStatusContext = createContext<ContextType>({} as ContextType);

/**
 * TOBIRAPOLIS祭スタンプラリー用。mint中であれば監視する。
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
    if (!user?.mintStatus?.TOBIRAPOLISFESTIVAL2023) return;
    const tpf2023MintStatus = {
      ...user.mintStatus?.TOBIRAPOLISFESTIVAL2023,
    };
    if (isWatching()) {
      // 現在監視中の時、mintStatusにmint中のものが存在しなければ監視を終了する
      if (!tpf2023MintStatus) {
        unwatch();
        return;
      }
      // completeは無視
      tpf2023MintStatus.Complete = undefined;

      const isEveryInProgress =
        tpf2023MintStatus &&
        Object.values(tpf2023MintStatus).every((v) => v !== "IN_PROGRESS");

      if (isEveryInProgress) {
        unwatch();
      }
    } else {
      // 現在監視中でない時、mintStatusにmint中のものが存在すれば監視を開始する
      if (!tpf2023MintStatus) {
        return;
      }
      // completeは無視
      tpf2023MintStatus.Complete = undefined;

      const inProgressExist =
        tpf2023MintStatus &&
        Object.values(tpf2023MintStatus).find((v) => v === "IN_PROGRESS");

      if (inProgressExist) {
        watch();
      }
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
