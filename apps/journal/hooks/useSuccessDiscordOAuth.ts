import { useActivityRecord } from "@/contexts/ActivityRecordProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/firebase/client";
import { DBActivityRecord } from "@/types/type";
import {
  Timestamp,
  collection,
  doc,
  writeBatch,
} from "firebase/firestore/lite";
import { useMemo } from "react";

/**
 * Discord認証完了時の処理をまとめたカスタムフック
 * @returns
 */
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

  // characteristic.join_tobiratory_atと
  // TOBIRA POLIS参加のactivityレコードをまとめてpost
  const postOnSuccess = async (joinDate: Date, newRecord: DBActivityRecord) => {
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

  // このhooksのエントリ－ポイント
  const updateOnSuccess = (discordId: string) => {
    // TODO: なんか要らない気がするコレ
    if (joinAtExists) {
      // ローカルのTobiratory参加Timestampをセット
      auth.setJoinTobiratoryInfo(discordId, null);
      return;
    } else {
      const joinDate = new Date();
      const text = "TOBIRAPOLISのメンバーになった";

      // データベース上のTobiratory参加Timestampをセット
      const posted = postOnSuccess(joinDate, {
        text: text,
        timestamp: Timestamp.fromDate(joinDate),
      });

      if (posted) {
        // ローカルのTobiratory参加Timestampをセット
        auth.setJoinTobiratoryInfo(discordId, joinDate);
        // ローカルのActivityRecordsにTobiratory参加の記録を追加
        addActivityRecord({
          text: text,
          date: joinDate,
        });
      }
    }
  };

  return { updateOnSuccess };
};

export default useSuccessDiscordOAuth;
