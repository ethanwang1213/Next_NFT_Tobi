import {firestore} from "firebase-admin";
import * as functions from "firebase-functions";
import {MintStatus, StampRallyResultType, Tpf2025StampType} from "journal-pkg/types/stampRallyTypes";
import {REGION, TPF2025_STAMP_RALLY_KEYWORDS} from "../lib/constants";
import {
  checkStampCompleted,
  isBefore,
  verifyAuthorizedUser,
  verifyCorrectStampEntry,
  verifyFirstRequest,
} from "./utils";
import {getFunctions} from "firebase-admin/functions";

const Tpfw2025StampMetadata: {
  [key in Tpf2025StampType]: { name: string; description: string };
} = {
  TobirapolisFestival2025: {
    name: "TOBIRAPOLIS FESTIVAL2025",
    description: "",
  },
};

const requestMint = async (userId: string, correctStampEntry: Tpf2025StampType) => {
  const badge = Tpfw2025StampMetadata[correctStampEntry];
  const queue = getFunctions().taskQueue(
      `locations/${REGION}/functions/mintJournalStampRallyNftTask`
  );
  await queue.enqueue(
      {
        name: badge.name,
        description: badge.description,
        type: correctStampEntry,
        userId: userId,
        event: "tpf2025",
      },
      {
        dispatchDeadlineSeconds: 60 * 5,
      }
  );
};

const writeMintStatusAsInProgress = async (userId: string, correctStampEntry: Tpf2025StampType) => {
  const settingData: {
    mintStatus: MintStatus;
    isStampTpf2025Checked: boolean;
  } = {
    mintStatus: {
      TOBIRAPOLISFESTIVAL2025: {
        [correctStampEntry]: "IN_PROGRESS",
      },
    },
    isStampTpf2025Checked: false,
  };
  await firestore().collection("users").doc(userId).set(settingData, {
    merge: true,
  });
};

/**
 * ログイン状態で、正しいスタンプラリーの合言葉が渡されていれば、
 * その合言葉にあったスタンプNFTをmintする。
 * 今回はスタンプは1種類のみであり、コンプリートの記念バッジもない。
 * また、mintのtransaction発行に成功した場合、
 * db上のmintStatusにおける、そのNFTのmint状態を"IN_PROGRESS"に設定する。
 */
exports.checkRewardTpf2025 = functions
    .region(REGION)
    .https.onCall(async (data, context): Promise<StampRallyResultType<Tpf2025StampType>> => {
      const {user, userId} = await verifyAuthorizedUser(context);
      const correctStampEntry = verifyCorrectStampEntry(data, TPF2025_STAMP_RALLY_KEYWORDS);

      if (
        correctStampEntry === "TobirapolisFestival2025" &&
      !isBefore(new Date("2025-03-02T00:00:00+09:00"))
      ) {
        throw new functions.https.HttpsError("invalid-argument", "The keyword is expired.");
      }

      const currentStampStatusMap = user.mintStatus?.TOBIRAPOLISFESTIVAL2025;
      verifyFirstRequest(correctStampEntry, currentStampStatusMap);

      const isStampCompleted = checkStampCompleted(correctStampEntry, currentStampStatusMap);

      await requestMint(userId, correctStampEntry);
      await writeMintStatusAsInProgress(userId, correctStampEntry);

      return {
        stamp: correctStampEntry,
        status: "IN_PROGRESS",
        isComplete: isStampCompleted,
      };
    });