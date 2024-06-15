import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import {
  MintStatus,
  StampRallyResultType,
  Tmf2024StampType,
} from "types/stampRallyTypes";
import { REGION, TMF2024_STAMP_RALLY_KEYWORDS } from "../lib/constants";
import { checkStampCompleted, verifyAuthorizedUser, verifyCorrectStampEntry, verifyFirstRequest } from "./utils";

const requestMint = async (
  userId: string,
  correctStampEntry: Tmf2024StampType,
  isStampCompleted: boolean
) => {
  const badges: {
    [key in Tmf2024StampType]: { name: string; description: string };
  } = {
    Stamp: {
      name: "TOBIRAPOLIS MUSIC FESTIVAL2024 STAMP",
      description: "",
    },
  };

  const badge = badges[correctStampEntry];
  // const queue = getFunctions().taskQueue(
  //   `locations/${REGION}/functions/mintFes23NftTaskv1`,
  // );
  // await queue.enqueue(
  //   {
  //     name: badge.name,
  //     description: badge.description,
  //     type: correctStampEntry,
  //     userId: userId,
  //     isStampCompleted: isStampCompleted,
  //   },
  //   {
  //     dispatchDeadlineSeconds: 60 * 5,
  //   },
  // );
};

const writeMintStatusAsInProgress = async (
  userId: string,
  correctStampEntry: Tmf2024StampType
) => {
  const settingData: { mintStatus: MintStatus } = {
    mintStatus: {
      Tmf2024: {
        [correctStampEntry]: "IN_PROGRESS",
      },
    },
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
export const checkRewardTmf2024 = functions
  .region(REGION)
  .https.onCall(
    async (data, context): Promise<StampRallyResultType<Tmf2024StampType>> => {
      const { user, userId } = await verifyAuthorizedUser(context);
      const correctStampEntry = verifyCorrectStampEntry(
        data,
        TMF2024_STAMP_RALLY_KEYWORDS
      );

      const currentStampStatusMap = user.mintStatus?.Tmf2024;
      verifyFirstRequest(correctStampEntry, currentStampStatusMap);

      const isStampCompleted = checkStampCompleted(
        correctStampEntry,
        currentStampStatusMap
      );

      await requestMint(userId, correctStampEntry, isStampCompleted);
      await writeMintStatusAsInProgress(userId, correctStampEntry);

      return {
        stamp: correctStampEntry,
        status: "IN_PROGRESS",
        isComplete: isStampCompleted,
      };
    }
  );
