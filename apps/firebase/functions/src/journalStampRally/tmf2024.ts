import {firestore} from "firebase-admin";
import * as functions from "firebase-functions";
import {
  MintStatus,
  StampRallyResultType,
  Tmf2024StampType,
} from "journal-pkg/types/stampRallyTypes";
import {REGION, TMF2024_STAMP_RALLY_KEYWORDS} from "../lib/constants";
import {
  checkStampCompleted,
  isBefore,
  verifyAuthorizedUser,
  verifyCorrectStampEntry,
  verifyFirstRequest,
} from "./utils";
import {getFunctions} from "firebase-admin/functions";

const Tmf2024StampMetadata: {
  [key in Tmf2024StampType]: { name: string; description: string };
} = {
  TobiraMusicFestival2024: {
    name: "TOBIRA MUSIC FESTIVAL 2024",
    description: "",
  },
  YouSoTotallyRock: {
    name: "You so totally rock!",
    description: "",
  },
};

const requestMint = async (
    userId: string,
    correctStampEntry: Tmf2024StampType,
) => {
  const badge = Tmf2024StampMetadata[correctStampEntry];
  const queue = getFunctions().taskQueue(
      `locations/${REGION}/functions/mintJournalStampRallyNftTask`,
  );
  await queue.enqueue(
      {
        name: badge.name,
        description: badge.description,
        type: correctStampEntry,
        userId: userId,
        event: "tmf2024",
      },
      {
        dispatchDeadlineSeconds: 60 * 5,
      },
  );
};

const writeMintStatusAsInProgress = async (
    userId: string,
    correctStampEntry: Tmf2024StampType
) => {
  const settingData: {
    mintStatus: MintStatus;
    isStampTmf2024Checked: boolean;
  } = {
    mintStatus: {
      TOBIRAMUSICFESTIVAL2024: {
        [correctStampEntry]: "IN_PROGRESS",
      },
    },
    isStampTmf2024Checked: false,
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
exports.checkRewardTmf2024 = functions
    .region(REGION)
    .https.onCall(
        async (data, context): Promise<StampRallyResultType<Tmf2024StampType>> => {
          const {user, userId} = await verifyAuthorizedUser(context);
          const correctStampEntry = verifyCorrectStampEntry(
              data,
              TMF2024_STAMP_RALLY_KEYWORDS
          );

          if (
            (correctStampEntry === "TobiraMusicFestival2024" &&
              !isBefore(new Date("2024-06-23T00:00:00+09:00"))) ||
            (correctStampEntry === "YouSoTotallyRock" &&
              !isBefore(new Date("2024-06-30T00:00:00+09:00")))
          ) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "The keyword is expired."
            );
          }

          const currentStampStatusMap = user.mintStatus?.TOBIRAMUSICFESTIVAL2024;
          verifyFirstRequest(correctStampEntry, currentStampStatusMap);

          const isStampCompleted = checkStampCompleted(
              correctStampEntry,
              currentStampStatusMap
          );

          await requestMint(userId, correctStampEntry);
          await writeMintStatusAsInProgress(userId, correctStampEntry);

          return {
            stamp: correctStampEntry,
            status: "IN_PROGRESS",
            isComplete: isStampCompleted,
          };
        }
    );
