import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {REGION, TPF2023_STAMP_RALLY_KEYWORDS} from "./lib/constants";
import {
  MintStatus,
  StampRallyResultType,
  Tpf2023StampRallyData,
  Tpf2023StampType,
  User,
} from "types/journal-types";
import {GoogleAuth} from "google-auth-library";
import {getFunctions} from "firebase-admin/functions";

// ユーザー認証周りのチェック
const verifyAuthorizedUser = async (
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

// リクエストされた合言葉をチェックし、正しい合言葉のentryを返す
const verifyCorrectStampEntry = (data: any) => {
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
  return correctStampEntry[0];
};

// 初めてのリクエストであるか（mint中・済みでないか）チェック
const verifyFirstRequest = (
    correctStampEntry: Tpf2023StampType,
    currentTpf2023StatusMap?: Tpf2023StampRallyData
) => {
  // mintStatusのデータが存在しないならば、問題なし
  if (!currentTpf2023StatusMap) return;

  const mintStatus = currentTpf2023StatusMap[correctStampEntry];
  if (mintStatus === "IN_PROGRESS" || mintStatus === "DONE") {
    throw new functions.https.HttpsError(
        "already-exists",
        "This request has already submitted."
    );
  }
};

const checkStampCompleted = (
    correctStampEntry: Tpf2023StampType,
    currentTpf2023StatusMap?: Tpf2023StampRallyData
) => {
  // mintStatusのデータが存在しないならば、コンプリートもしていない
  if (!currentTpf2023StatusMap) return false;

  // 今回更新するkey以外のkeyの配列
  const requiredKeys = ["G0", "G1alpha", "G1beta", "G1gamma", "G1delta"].filter(
      (key) => key !== correctStampEntry
  );
  // 全てのスタンプがmint中以降であるかどうか
  const isEveryMinting = requiredKeys.every((key) => {
    const status = currentTpf2023StatusMap[key as Tpf2023StampType];
    return status && (status === "IN_PROGRESS" || status === "DONE");
  });
  return isEveryMinting;
};

let auth: GoogleAuth<any>;

const getFunctionUrl = async (name: string, location = REGION) => {
  if (!auth) {
    auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
  }
  const projectId = await auth.getProjectId();
  const url =
      "https://cloudfunctions.googleapis.com/v2beta/" +
      `projects/${projectId}/locations/${location}/functions/${name}`;

  const client = await auth.getClient();
  const res = await client.request({url});
  const uri = res.data?.serviceConfig?.uri;
  if (!uri) {
    throw new Error(`Unable to retreive uri for function at ${url}`);
  }
  return uri as string;
};

const requestMint = async (
    userId: string,
    correctStampEntry: Tpf2023StampType,
    isStampCompleted: boolean
) => {
  const badges: { [key: string]: { name: string; description: string } } = {
    G0: {
      name: "",
      description: "",
    },
    G1alpha: {
      name: "",
      description: "",
    },
    G1beta: {
      name: "",
      description: "",
    },
    G1gamma: {
      name: "",
      description: "",
    },
    G1delta: {
      name: "",
      description: "",
    },
  };

  const badge = badges[correctStampEntry];
  const queue = getFunctions().taskQueue(`locations/${REGION}/functions/mintFes23NftTaskv1`);
  const targetUri = await getFunctionUrl("mintFes23NftTask");
  await queue.enqueue(
      {
        name: badge.name,
        description: badge.description,
        type: `TOBIRAPOLISFESTIVAL2023_${correctStampEntry}`,
        userId: userId,
        isStampCompleted: isStampCompleted,
      },
      {
        dispatchDeadlineSeconds: 60 * 5,
        uri: targetUri,
      }
  );
};

const writeMintStatusAsInProgress = async (
    userId: string,
    correctStampEntry: Tpf2023StampType,
    isStampCompleted: boolean
) => {
  const settingData: { mintStatus: MintStatus } = {
    mintStatus: {
      TOBIRAPOLISFESTIVAL2023: {
        [correctStampEntry]: "IN_PROGRESS",
      },
    },
  };
  if (isStampCompleted) {
    settingData.mintStatus.TOBIRAPOLISFESTIVAL2023!.Complete = "IN_PROGRESS";
  }
  await firestore().collection("users").doc(userId).set(settingData, {
    merge: true,
  });
};

/**
 * ログイン状態で、正しいスタンプラリーの合言葉が渡されていれば、
 * その合言葉にあったスタンプNFTをmintし、
 * すべてのスタンプを集めた場合、さらに記念バッジNFTをmintする。
 * また、mintのtransaction発行に成功した場合、
 * db上のmintStatusにおける、そのNFTのmint状態を"IN_PROGRESS"に設定する。
 */
exports.checkReward = functions
    .region(REGION)
    .https.onCall(async (data, context): Promise<StampRallyResultType> => {
      const {user, userId} = await verifyAuthorizedUser(context);
      const correctStampEntry = verifyCorrectStampEntry(data);

      const currentTpf2023StatusMap = user.mintStatus?.TOBIRAPOLISFESTIVAL2023;
      verifyFirstRequest(correctStampEntry, currentTpf2023StatusMap);

      const isStampCompleted = checkStampCompleted(
          correctStampEntry,
          currentTpf2023StatusMap
      );

      await requestMint(userId, correctStampEntry, isStampCompleted);
      await writeMintStatusAsInProgress(
          userId,
          correctStampEntry,
          isStampCompleted
      );

      return {
        stamp: correctStampEntry,
        status: "IN_PROGRESS",
        isComplete: isStampCompleted,
      };
    });
