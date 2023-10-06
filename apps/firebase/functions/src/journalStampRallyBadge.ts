import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import { REGION, STAMP_RALLY_KEYWORD } from "./lib/constants";

type StampRallyMintStatusType = "NOTHING" | "IN_PROGRESS" | "DONE";

/**
 * ログイン状態で、正しいスタンプラリーの合言葉が渡されていれば、
 * 記念のバッジNFTをmintする
 */
exports.checkReward = functions.region(REGION).https.onCall(async (data, context) => {
  // ユーザー認証周りのチェック
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const userDoc = await firestore().collection("users").doc(context.auth.uid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "The user doesn't exist.");
  }
  const user = userDoc.data();
  const email = user?.email;
  if (!email) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have email.");
  }
  // 初めてのリクエストであるかチェック
  const stampRallyMintStatus: StampRallyMintStatusType = user?.stampRallyMintStatus;
  if (stampRallyMintStatus === "IN_PROGRESS" || stampRallyMintStatus === "DONE") {
    throw new functions.https.HttpsError("already-exists", "This request has already submitted.")
  }
  // 合言葉のチェック
  if (data.keyword !== STAMP_RALLY_KEYWORD) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with correct keyword.")
  }
  // mint処理

  // mint待機状態へ
  await firestore().collection("users").doc(context.auth.uid).set({
    stampRallyMintStatus: "IN_PROGRESS",
  }, {
    merge: true,
  })
  return "正解！";
});
