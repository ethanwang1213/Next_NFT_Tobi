import { useActivityRecord } from "@/contexts/journal-ActivityRecordProvider";
import { addDoc, collection, Timestamp } from "firebase/firestore/lite";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { db } from "journal-pkg/fetchers/firebase/journal-client";
import { DBActivityRecord } from "journal-pkg/types/journal-types";

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
        newRecord,
      );
      // console.log(docRef.id);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const recordNewActivity = async (activityText: string) => {
    const newDate = new Date();

    const posted = await postActivityRecord({
      text: activityText,
      timestamp: Timestamp.fromDate(newDate),
    });
    if (posted) {
      addActivityRecord({ text: activityText, date: newDate });
    }
  };

  return { recordNewActivity };
};

export default useRecordActivity;
