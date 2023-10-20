import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import { REGION, TPF2023_STAMP_RALLY_KEYWORDS } from "./lib/constants";
import {
  MintStatusData,
  StampRallyResultType,
  User,
} from "types/journal-types";

/**
 * ログイン状態で、正しいスタンプラリーの合言葉が渡されていれば、
 * その合言葉にあったスタンプNFTをmintし、
 * すべてのスタンプを集めた場合、記念バッジNFTをmintする。
 * また、mintのtransaction発行に成功した場合、
 * db上のmintStatusにおける、そのNFTのmint状態を"IN_PROGRESS"に設定する。
 */
exports.checkReward = functions
  .region(REGION)
  .https.onCall(async (data, context): Promise<StampRallyResultType> => {
    // ユーザー認証周りのチェック
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
    const userDoc = await firestore()
      .collection("users")
      .doc(context.auth.uid)
      .get();
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

    // keyの型推論を含んだentries関数
    const strictEntries = <T extends Record<string, any>>(
      object: T
    ): [keyof T, T[keyof T]][] => {
      return Object.entries(object);
    };
    // 正しい合言葉のentryを探索・取得し、存在するかチェック
    const correctStampEntry = strictEntries(TPF2023_STAMP_RALLY_KEYWORDS).find(
      (v) => v[1] === data.keyword
    );
    if (!correctStampEntry) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with correct keyword."
      );
    }

    let isStampCompleted = false;
    const tpf2023StatusMap = user?.mintStatusData?.TOBIRAPOLISFESTIVAL2023;
    if (tpf2023StatusMap) {
      // 初めてのリクエストであるか（mint中・済みでないか）チェック
      const mintStatus = tpf2023StatusMap[correctStampEntry[0]];
      if (mintStatus === "IN_PROGRESS" || mintStatus === "DONE") {
        throw new functions.https.HttpsError(
          "already-exists",
          "This request has already submitted."
        );
      }
      // スタンプをコンプリートしたかチェック
      isStampCompleted = (() => {
        // 今回更新するkey以外のkeyの配列
        const requiredKeys = [
          "G0",
          "G1alpha",
          "G1beta",
          "G1gamma",
          "G1delta",
        ].filter((key) => key !== correctStampEntry[0]);
        // requiredKeysの要素を全てkeyとして持っているかを判定
        const mapKeys = new Set(Object.keys(tpf2023StatusMap));
        if (!requiredKeys.every((key) => mapKeys.has(key))) {
          return false;
        }
        // 全てのvalueがvalidValuesのどれかに当てはまっているかを判定
        // mint処理中・完了であればok
        const validValues = new Set(["IN_PROGRESS", "DONE"]);
        const mapValues = Object.values(tpf2023StatusMap);
        if (!mapValues.every((value) => validValues.has(value))) {
          return false;
        }
        return true;
      })();
    }

    // mint処理

    // スタンプをコンプリートしていたら追加でmint

    // mint待機状態に設定
    const setData: { mintStatusData: MintStatusData } = {
      mintStatusData: {
        TOBIRAPOLISFESTIVAL2023: {
          [correctStampEntry[0]]: "IN_PROGRESS",
        },
      },
    };
    if (isStampCompleted) {
      setData.mintStatusData.TOBIRAPOLISFESTIVAL2023!.Complete = "IN_PROGRESS";
    }
    await firestore().collection("users").doc(context.auth.uid).set(setData, {
      merge: true,
    });
    return {
      stamp: correctStampEntry[0],
      status: "IN_PROGRESS",
      isComplete: isStampCompleted,
    };
  });
