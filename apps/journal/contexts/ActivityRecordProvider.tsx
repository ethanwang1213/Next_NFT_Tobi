import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "contexts/journal-AuthProvider";
import useFetchActivityRecords from "@/hooks/useFetchActivityRecords";
import { LocalActivityRecord } from "types/journal-types";

type Props = {
  children: ReactNode;
};

type ActivityRecordContextType = {
  activityRecords: LocalActivityRecord[];
  addActivityRecord: (newRecord: LocalActivityRecord) => void;
  initContext: () => void;
};

const ActivityRecordContext = createContext<ActivityRecordContextType>(
  {} as ActivityRecordContextType
);

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

  return (
    <ActivityRecordContext.Provider
      value={{
        activityRecords,
        addActivityRecord,
        initContext,
      }}
    >
      {children}
    </ActivityRecordContext.Provider>
  );
};

export const useActivityRecord = () => useContext(ActivityRecordContext);
