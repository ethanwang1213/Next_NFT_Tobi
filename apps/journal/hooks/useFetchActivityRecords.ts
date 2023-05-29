import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/firebase/client";
import { ActivityRecord } from "@/types/type";
import { getDocs, collection, Timestamp } from "@firebase/firestore";

type DBActivityRecord = {
  text: string;
  timestamp: Timestamp;
};

const useFetchActivityRecords = () => {
  const { user } = useAuth();

  const fetchActivityRecords = async () => {
    try {
      const snapshots = await getDocs(
        collection(db, `users`, user.id, `activity`)
      );

      const records: ActivityRecord[] = [];
      snapshots.forEach((record) => {
        const data = record.data() as DBActivityRecord;
        records.push({
          text: data.text,
          date: data.timestamp.toDate(),
        });
      });
      return records;
    } catch (error) {
      console.log(error);
    }
  };
  return { fetchActivityRecords };
};

export default useFetchActivityRecords;
