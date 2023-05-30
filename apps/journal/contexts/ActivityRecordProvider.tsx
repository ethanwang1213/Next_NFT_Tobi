import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import useFetchActivityRecords from "@/hooks/useFetchActivityRecords";
import { LocalActivityRecord } from "@/types/type";

type Props = {
  children: ReactNode;
};

type ActivityRecordContextType = {
  activityRecords: LocalActivityRecord[];
  addActivityRecord: (newRecord: LocalActivityRecord) => void;
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

  const loadActivityRecords = async () => {
    if (!user) return;

    const activityRecords: LocalActivityRecord[] = await fetchActivityRecords();
    console.log(activityRecords);
    setActivityRecords(activityRecords);
  };

  useEffect(() => {
    if (!user) return;
    loadActivityRecords();
  }, [user]);

  const addActivityRecord = async (newRecord: LocalActivityRecord) => {
    setActivityRecords((prev) => [...prev, newRecord]);
  };

  return (
    <ActivityRecordContext.Provider
      value={{
        activityRecords,
        addActivityRecord,
      }}
    >
      {children}
    </ActivityRecordContext.Provider>
  );
};

export const useActivityRecord = () => useContext(ActivityRecordContext);
