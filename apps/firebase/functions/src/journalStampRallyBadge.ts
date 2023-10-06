import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import { REGION, STAMP_RALLY_KEYWORD } from "./lib/constants";

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
  // 合言葉のチェック
  if (data.keyword !== STAMP_RALLY_KEYWORD) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with correct keyword.")
  }
  // mint処理
  // mint待機状態へ
  return "正解！";
});
