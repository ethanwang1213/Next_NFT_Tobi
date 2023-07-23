import { useActivityRecord } from "@/contexts/ActivityRecordProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/firebase/client";
import { DBActivityRecord } from "@/types/type";
import { Timestamp, addDoc, collection } from "firebase/firestore/lite";

/**
 * Activity Recordに新しいActivityを追加する処理を行うためのカスタムフック
 */
const useRecordActivity = () => {
  const { user } = useAuth();
  const { addActivityRecord } = useActivityRecord();

  const postActivityRecord = async (newRecord: DBActivityRecord) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.id}/activity`),
        newRecord
      );
      // console.log(docRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  const recordNewActivity = async (activityText: string) => {
    const newDate = new Date();

    await postActivityRecord({
      text: activityText,
      timestamp: Timestamp.fromDate(newDate),
    });
    addActivityRecord({ text: activityText, date: newDate });
  };

  return { recordNewActivity };
};

export default useRecordActivity;
