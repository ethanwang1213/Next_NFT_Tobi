import {firestore} from "firebase-admin";
import * as functions from "firebase-functions";
import {MintStatus, StampRallyResultType, Tpfw2024StampType} from "journal-pkg/types/stampRallyTypes";
import {REGION, TPFW2024_STAMP_RALLY_KEYWORDS} from "../lib/constants";
import {
  checkStampCompleted,
  isBefore,
  verifyAuthorizedUser,
  verifyCorrectStampEntry,
  verifyFirstRequest,
} from "./utils";
import {getFunctions} from "firebase-admin/functions";

const Tpfw2024StampMetadata: {
  [key in Tpfw2024StampType]: { name: string; description: string };
} = {
  TobirapolisFireworks2024: {
    name: "TOBIRAPOLIS FIREWORKS 2024",
    description: "",
  },
  ReflectedInTheRiver: {
    name: "Reflected in the River",
    description: "",
  },
};

const requestMint = async (
    userId: string,
    correctStampEntry: Tpfw2024StampType
) => {
  const badge = Tpfw2024StampMetadata[correctStampEntry];
  const queue = getFunctions().taskQueue(
      `locations/${REGION}/functions/mintJournalStampRallyNftTask`
  );
  await queue.enqueue(
      {
        name: badge.name,
        description: badge.description,
        type: correctStampEntry,
        userId: userId,
        event: "tpfw2024",
      },
      {
        dispatchDeadlineSeconds: 60 * 5,
      }
  );
};

const writeMintStatusAsInProgress = async (
    userId: string,
    correctStampEntry: Tpfw2024StampType
) => {
  const settingData: {
    mintStatus: MintStatus;
    isStampTpfw2024Checked: boolean;
  } = {
    mintStatus: {
      TOBIRAPOLISFIREWORKS2024: {
        [correctStampEntry]: "IN_PROGRESS",
      },
    },
    isStampTpfw2024Checked: false,
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
exports.checkRewardTpfw2024 = functions
    .region(REGION)
    .https.onCall(async (data, context): Promise<StampRallyResultType<Tpfw2024StampType>> => {
      const {user, userId} = await verifyAuthorizedUser(context);
      const correctStampEntry = verifyCorrectStampEntry(data, TPFW2024_STAMP_RALLY_KEYWORDS);

      if (
        (correctStampEntry === "TobirapolisFireworks2024" &&
        !isBefore(new Date("2024-09-23T00:00:00+09:00"))) ||
      (correctStampEntry === "ReflectedInTheRiver" &&
        !isBefore(new Date("2024-09-23T00:00:00+09:00")))
      ) {
        throw new functions.https.HttpsError("invalid-argument", "The keyword is expired.");
      }

      const currentStampStatusMap = user.mintStatus?.TOBIRAPOLISFIREWORKS2024;
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
