import generateHash from "@/libs/generateHash";
import { ActivityRecordData, ActivityRecords } from "@/types/type";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

type Props = {
  children: ReactNode;
};

type ActivityRecordContextType = {
  activityRecords: ActivityRecords;
  addActivityRecord: (newRecord: ActivityRecordData) => void;
};

const ActivityRecordContext = createContext<ActivityRecordContextType>(
  {} as ActivityRecordContextType
);

export const ActivityRecordProvider = ({ children }) => {
  const [activityRecords, setActivityRecords] = useState<ActivityRecords>({});

  const { user } = useAuth();

  const addActivityRecord = async (newRecord: ActivityRecordData) => {
    const hash = await generateHash(user.id);
    setActivityRecords((prev) => ({ ...prev, [hash]: newRecord }));
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
