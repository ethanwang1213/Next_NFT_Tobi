import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "contexts/journal-AuthProvider";
import useFetchActivityRecords from "@/hooks/useFetchActivityRecords";
import { LocalActivityRecord } from "types/journal-types";

type Props = {
  children: ReactNode;
};

type ContextType = {
  activityRecords: LocalActivityRecord[];
  addActivityRecord: (newRecord: LocalActivityRecord) => void;
  initContext: () => void;
};

const ActivityRecordContext = createContext<ContextType>({} as ContextType);

/**
 * Activity Recordのデータを管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const ActivityRecordProvider: React.FC<Props> = ({ children }) => {
  const [activityRecords, setActivityRecords] = useState<LocalActivityRecord[]>(
    []
  );

  const { user } = useAuth();
  const { fetchActivityRecords } = useFetchActivityRecords();

  const initContext = () => {
    setActivityRecords([]);
  };

  const loadActivityRecords = async () => {
    if (!user || !user.email) return;
    let activityRecords: LocalActivityRecord[] = await fetchActivityRecords();
    activityRecords.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
    setActivityRecords(activityRecords);
  };

  useEffect(() => {
    if (!user) return;
    loadActivityRecords();
  }, [user]);

  const addActivityRecord = (newRecord: LocalActivityRecord) => {
    setActivityRecords((prev) => [newRecord, ...prev]);
  };

  const contextValue = useMemo(
    () => ({
      activityRecords,
      addActivityRecord,
      initContext,
    }),
    [activityRecords, addActivityRecord, initContext]
  );

  return (
    <ActivityRecordContext.Provider value={contextValue}>
      {children}
    </ActivityRecordContext.Provider>
  );
};

export const useActivityRecord = () => useContext(ActivityRecordContext);
