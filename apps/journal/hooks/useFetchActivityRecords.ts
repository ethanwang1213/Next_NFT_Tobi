import { useAuth } from "@/contexts/AuthProvider";
import { db } from "fetchers/firebase/journal-client";
import { DBActivityRecord, LocalActivityRecord } from "@/types/type";
import { getDocs, collection } from "firebase/firestore/lite";

/**
 * Activity Recordのデータをロードするためのカスタムフック
 * @returns
 */
const useFetchActivityRecords = () => {
  const { user } = useAuth();

  const fetchActivityRecords = async () => {
    try {
      const snapshots = await getDocs(
        collection(db, `users`, user.id, `activity`)
      );

      const records: LocalActivityRecord[] = [];

      snapshots.forEach(async (record) => {
        const data = record.data() as DBActivityRecord;
        records.push({
          text: data.text,
          date: data.timestamp.toDate(),
        });
      });
      return records;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return { fetchActivityRecords };
};

export default useFetchActivityRecords;
