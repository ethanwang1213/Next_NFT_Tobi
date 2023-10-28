import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {REGION, TPF2023_STAMP_RALLY_KEYWORDS} from "./lib/constants";
import {MintStatus, StampRallyResultType, User} from "types/journal-types";
import {GoogleAuth} from "google-auth-library";
import {getFunctions} from "firebase-admin/functions";

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
      const userId = context.auth.uid;
      const userDoc = await firestore()
          .collection("users")
          .doc(userId)
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
      const tpf2023StatusMap = user?.mintStatus?.TOBIRAPOLISFESTIVAL2023;
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
      const badges: { [key: string]: { name: string, description: string } } = {
        "G0": {
          name: "",
          description: "",
        },
        "G1alpha": {
          name: "",
          description: "",
        },
        "G1beta": {
          name: "",
          description: "",
        },
        "G1gamma": {
          name: "",
          description: "",
        },
        "G1delta": {
          name: "",
          description: "",
        },
      };
      const badge = badges[correctStampEntry[0]];
      const queue = getFunctions().taskQueue("testTaskFunction");
      const targetUri = await getFunctionUrl("testTaskFunction");
      await queue.enqueue({
        name: badge.name,
        description: badge.description,
        type: `TOBIRAPOLISFESTIVAL2023_${correctStampEntry[0]}`,
        userId: userId,
        isStampCompleted: isStampCompleted
      }, {
        dispatchDeadlineSeconds: 60 * 5,
        uri: targetUri,
      });

      // mint待機状態に設定
      const setData: { mintStatus: MintStatus } = {
        mintStatus: {
          TOBIRAPOLISFESTIVAL2023: {
            [correctStampEntry[0]]: "IN_PROGRESS",
          },
        },
      };
      if (isStampCompleted) {
        setData.mintStatus.TOBIRAPOLISFESTIVAL2023!.Complete = "IN_PROGRESS";
      }
      await firestore().collection("users").doc(userId).set(setData, {
        merge: true,
      });
      return {
        stamp: correctStampEntry[0],
        status: "IN_PROGRESS",
        isComplete: isStampCompleted,
      };
    });


let auth: GoogleAuth<any>;

const getFunctionUrl = async (name: string, location="us-central1") => {
  if (!auth) {
    auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
  }
  const projectId = await auth.getProjectId();
  const url = "https://cloudfunctions.googleapis.com/v2beta/" +
    `projects/${projectId}/locations/${location}/functions/${name}`;

  const client = await auth.getClient();
  const res = await client.request({url});
  const uri = res.data?.serviceConfig?.uri;
  if (!uri) {
    throw new Error(`Unable to retreive uri for function at ${url}`);
  }
  return uri as string;
};
