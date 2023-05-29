import { useActivityRecord } from "@/contexts/ActivityRecordProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/firebase/client";
import { ActivityRecordData } from "@/types/type";
import { Timestamp, collection, doc, writeBatch } from "@firebase/firestore";
import { useMemo } from "react";

const useSuccessDiscordOAuth = () => {
  const auth = useAuth();
  const { addActivityRecord } = useActivityRecord();

  const joinAtExists = useMemo(
    () =>
      !!auth.user &&
      !!auth.user.characteristic &&
      !!auth.user.characteristic.join_tobiratory_at,
    [auth.user]
  );

  // characteristic.join_tobiratory_atと参加のactivityレコードをまとめてpost
  const postOnSuccess = async (
    joinDate: Date,
    newRecord: ActivityRecordData
  ) => {
    const batch = writeBatch(db);

    const usersSrcRef = doc(db, `users/${auth.user.id}`);
    batch.set(
      usersSrcRef,
      {
        characteristic: {
          join_tobiratory_at: joinDate,
        },
      },
      { merge: true }
    );

    const activitySrcRef = doc(
      collection(db, `users/${auth.user.id}/activity`)
    );
    batch.set(activitySrcRef, newRecord);

    try {
      await batch.commit();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const updateOnSuccess = () => {
    // 既に参加日が設定されている場合は何もしない
    if (joinAtExists) return;

    const joinDate = new Date();
    const newRecord = {
      text: "TOBIRAPOLISのメンバーになった",
      timestamp: Timestamp.fromDate(joinDate),
    };
    // ローカルのTobiratory参加Timestampをセット
    auth.setJoinTobiratoryAt(joinDate);
    // ローカルのActivityRecordsにTobiratory参加の記録を追加
    addActivityRecord(newRecord);

    // データベース上のTobiratory参加Timestampをセット
    postOnSuccess(joinDate, newRecord);
  };

  return { updateOnSuccess };
};

export default useSuccessDiscordOAuth;
