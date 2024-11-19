import {firestore} from "firebase-admin";
import * as functions from "firebase-functions";
import {User} from "journal-pkg/types/journal-types";
import {StampRallyData} from "journal-pkg/types/stampRallyTypes";

// ユーザー認証周りのチェック
export const verifyAuthorizedUser = async (
    context: functions.https.CallableContext
) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
    );
  }
  const userId = context.auth.uid;
  const userDoc = await firestore().collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError(
        "not-found",
        "The user doesn't exist."
    );
  }
  const user = userDoc.data() as User | undefined;
  const email = user?.email;
  if (!email) {
    throw new functions.https.HttpsError(
        "not-found",
        "The user doesn't have email."
    );
  }
  return {user, userId};
};

type Keywords = {
  [key: string]: string;
};

// keyの型推論を含んだentries関数
const strictEntries = <T extends Record<string, any>>(
  object: T
): [keyof T, T[keyof T]][] => {
  return Object.entries(object);
};

// リクエストされた合言葉をチェックし、正しい合言葉のentryを返す
export const verifyCorrectStampEntry = <T extends Keywords>(
  data: any,
  keywords: T
) => {
  // 正しい合言葉のentryを探索・取得し、存在するかチェック
  const correctStampEntry = strictEntries(keywords).find(
      (v) => v[1] === data.keyword
  );
  if (!correctStampEntry) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with correct keyword."
    );
  }
  return correctStampEntry[0] as keyof T;
};

// 初めてのリクエストであるか（mint中・済みでないか）チェック
export const verifyFirstRequest = <T extends string>(
  correctStampEntry: T,
  currentStampStatusMap?: StampRallyData<T>
) => {
  // mintStatusのデータが存在しないならば、問題なし
  if (!currentStampStatusMap) return;

  const mintStatus = currentStampStatusMap[correctStampEntry];
  if (mintStatus === "IN_PROGRESS" || mintStatus === "DONE") {
    throw new functions.https.HttpsError(
        "already-exists",
        "This request has already submitted."
    );
  }
};

export const checkStampCompleted = <T extends string>(
  correctStampEntry: T,
  currentStampStatusMap?: StampRallyData<T>
) => {
  // mintStatusのデータが存在しないならば、コンプリートもしていない
  if (!currentStampStatusMap) return false;

  // 今回更新するkey以外のkeyの配列
  const keys = Object.keys(currentStampStatusMap) as T[];
  const requiredKeys = keys.filter((key) => key !== correctStampEntry);
  // 全てのスタンプがmint中以降であるかどうか
  const isEveryMinting = requiredKeys.every((key) => {
    const status = currentStampStatusMap[key as T];
    return status && (status === "IN_PROGRESS" || status === "DONE");
  });
  return isEveryMinting;
};

export const isBefore = (date: Date) => {
  return Date.now() < date.getTime();
};
