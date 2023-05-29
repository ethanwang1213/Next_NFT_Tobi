import generateHash from "@/libs/generateHash";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import useFetchActivityRecords from "@/hooks/useFetchActivityRecords";
import { ActivityRecord } from "@/types/type";

type Props = {
  children: ReactNode;
};

type ActivityRecordContextType = {
  activityRecords: ActivityRecord[];
  addActivityRecord: (newRecord: ActivityRecord) => void;
};

const ActivityRecordContext = createContext<ActivityRecordContextType>(
  {} as ActivityRecordContextType
);

export const ActivityRecordProvider = ({ children }) => {
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>([]);

  const { user } = useAuth();
  const { fetchActivityRecords } = useFetchActivityRecords();

  const loadActivityRecords = async () => {
    if (!user) return;

    const activityRecords: ActivityRecord[] = await fetchActivityRecords();
    console.log(activityRecords);
    setActivityRecords(activityRecords);
  };

  useEffect(() => {
    if (!user) return;

    loadActivityRecords();
  }, [user]);

  const addActivityRecord = async (newRecord: ActivityRecord) => {
    setActivityRecords((prev) => [...prev, newRecord]);
  };

  useEffect(() => {
    console.log(activityRecords);
  }, [activityRecords]);

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
