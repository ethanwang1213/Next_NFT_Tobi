import {firestore} from "firebase-admin";
import {getFunctions} from "firebase-admin/functions";
import * as functions from "firebase-functions";
import {
  MintStatus,
  StampRallyResultType,
  Tpf2023StampType,
} from "journal-pkg/types/stampRallyTypes";
import {REGION, TPF2023_STAMP_RALLY_KEYWORDS} from "../lib/constants";
import {
  checkStampCompleted,
  verifyAuthorizedUser,
  verifyCorrectStampEntry,
  verifyFirstRequest,
} from "./utils";

const requestMint = async (
    userId: string,
    correctStampEntry: Tpf2023StampType,
    isStampCompleted: boolean
) => {
  const badges: {
    [key in Tpf2023StampType]: { name: string; description: string };
  } = {
    G0: {
      name: "TOBIRAPOLIS FESTIVAL2023 STAMP G0",
      description: "",
    },
    G1alpha: {
      name: "TOBIRAPOLIS FESTIVAL2023 STAMP G1-Α",
      description: "",
    },
    G1beta: {
      name: "TOBIRAPOLIS FESTIVAL2023 STAMP G1-Β",
      description: "",
    },
    G1gamma: {
      name: "TOBIRAPOLIS FESTIVAL2023 STAMP G1-Γ",
      description: "",
    },
    G1delta: {
      name: "TOBIRAPOLIS FESTIVAL2023 STAMP G1-Δ",
      description: "",
    },
  };

  const badge = badges[correctStampEntry];
  const queue = getFunctions().taskQueue(
      `locations/${REGION}/functions/mintJournalStampRallyNftTask`
  );
  await queue.enqueue(
      {
        name: badge.name,
        description: badge.description,
        type: correctStampEntry,
        userId: userId,
        isStampCompleted: isStampCompleted,
        event: "tpf2023",
      },
      {
        dispatchDeadlineSeconds: 60 * 5,
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
exports.checkRewardTpf2023 = functions
    .region(REGION)
    .https.onCall(
        async (data, context): Promise<StampRallyResultType<Tpf2023StampType>> => {
          const {user, userId} = await verifyAuthorizedUser(context);
          const correctStampEntry = verifyCorrectStampEntry(
              data,
              TPF2023_STAMP_RALLY_KEYWORDS
          );

          const currentStampStatusMap = user.mintStatus?.TOBIRAPOLISFESTIVAL2023;
          verifyFirstRequest(correctStampEntry, currentStampStatusMap);

          const isStampCompleted = checkStampCompleted(
              correctStampEntry,
              currentStampStatusMap
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
        }
    );
