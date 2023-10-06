import { useActivityRecord } from "@/contexts/ActivityRecordProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { db } from "fetchers/firebase/journal-client";
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
const useUpdateDiscordOAuthData = () => {
  const auth = useAuth();
  const { addActivityRecord } = useActivityRecord();

  const joinAtExists = useMemo(
    () =>
      !!auth.user &&
      !!auth.user.characteristic &&
      !!auth.user.characteristic.join_tobiratory_at,
    [auth.user]
  );

  // db上にdiscordへの参加情報を書き込み
  const postDiscordOAuthData = async (
    discordId: string,
    joinDate: Date,
    newRecord: DBActivityRecord
  ) => {
    const batch = writeBatch(db);

    // discordへの参加情報を書き込み
    const userRef = doc(db, `users/${auth.user.id}`);
    const newUserData = {
      discord: discordId,
    };
    // 初めてのTobiratoryへの参加の場合のみ、参加日時を書き込み
    if (!joinAtExists) {
      newUserData["characteristic"] = {
        join_tobiratory_at: joinDate,
      };
    }
    batch.set(userRef, newUserData, { merge: true });

    // discord idのユニーク制約用のデータ書き込み
    const indexRef = doc(db, "index", "users", "discord", discordId);
    batch.set(
      indexRef,
      {
        userId: auth.user.id,
      },
      { merge: true }
    );

    // 初めてのTobiratoryへの参加の場合のみ、ActivityRecordsに参加記録を追加
    if (!joinAtExists) {
      const activityRef = doc(collection(db, `users/${auth.user.id}/activity`));
      batch.set(activityRef, newRecord);
    }

    try {
      await batch.commit();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // このhooksのエントリ－ポイント
  const updateDiscordOAuthData = async (discordId: string) => {
    try {
      const joinDate = new Date();
      const text = "TOBIRAPOLISのメンバーになった";

      const posted = await postDiscordOAuthData(discordId, joinDate, {
        text: text,
        timestamp: Timestamp.fromDate(joinDate),
      });

      if (posted) {
        if (joinAtExists) {
          // ローカルのTobiratory参加データをセット
          auth.setJoinTobiratoryInfo(discordId, null);
        } else {
          // ローカルのTobiratory参加Timestampをセット
          auth.setJoinTobiratoryInfo(discordId, joinDate);
          // ローカルのActivityRecordsにTobiratory参加の記録を追加
          addActivityRecord({
            text: text,
            date: joinDate,
          });
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return { updateDiscordOAuthData };
};

export default useUpdateDiscordOAuthData;
