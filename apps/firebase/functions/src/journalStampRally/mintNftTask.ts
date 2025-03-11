import {REGION} from "../lib/constants";
import {sendMintJournalStampRallyNftTx} from "./transaction";
import {firestore} from "firebase-admin";
import * as functions from "firebase-functions";
import Timestamp = firestore.Timestamp;
import {
  CompleteStampType,
  MintStatus,
  StampRallyEventType,
  Tpf2023StampType,
  Tmf2024StampType,
  Tpfw2024StampType,
  Tpf2025StampType,
  MintStatusType,
} from "journal-pkg/types/stampRallyTypes";

const mintNFT = async (
    name: string,
    description: string,
    userId: string,
    type: Tpf2023StampType | CompleteStampType | Tmf2024StampType | Tpfw2024StampType | Tpf2025StampType,
    stampRallyEventType: StampRallyEventType,
    onComplete?: () => void
) => {
  const txDetails = await sendMintJournalStampRallyNftTx(name, description);
  console.log(JSON.stringify({txDetails}));
  const events = txDetails.events;

  let imageUrl = null;

  if (stampRallyEventType === "tpf2023") {
    imageUrl = `${process.env.TOBIRAPOLIS_FESTIVAL23_STAMP_IMAGE_URL}${type.toLowerCase()}.png`;
  } else if (stampRallyEventType === "tmf2024") {
    imageUrl = `${process.env.TMF2024_STAMP_IMAGE_URL}${type.toLowerCase()}.png`;
  } else if (stampRallyEventType === "tpfw2024") {
    imageUrl = `${process.env.TPFW2024_STAMP_IMAGE_URL}${type.toLowerCase()}.png`;
  } else if (stampRallyEventType === "tpf2025") {
    imageUrl = `${process.env.TPF2025_STAMP_IMAGE_URL}${type.toLowerCase()}.png`;  
  }

  if (!imageUrl) {
    throw new Error("Failed to mint NFT");
  }

  for (const mintEvent of events) {
    if (mintEvent.type === `${process.env.FLOW_NON_FUNGIBLE_TOKEN_CONTRACT_ID}.${process.env.FLOW_NON_FUNGIBLE_TOKEN_DEPOSITED_EVENT_NAME}`) {
      const nftId = mintEvent.data.id;
      await createMetadata(nftId, type, name, description, imageUrl);
      await recordMintResult(userId, nftId, name, description, new Date(), imageUrl, type);

      if (onComplete) {
        await onComplete();
      }
      break;
    }
  }
};

export const mintJournalStampRallyNftTask = functions.region(REGION).runWith({}).tasks.taskQueue({
  retryConfig: {
    maxAttempts: 5,
    minBackoffSeconds: 60,
  },
  rateLimits: {
    maxConcurrentDispatches: 1,
  },
}).onDispatch(async (data) => {
  const {name, description, type, userId, event} = data;
  if (event === "tpf2023") {
    const {isStampCompleted} = data;
    await mintNFT(name, description, userId, type, event, async () => {
      const setData: { mintStatus: MintStatus } = {
        mintStatus: {
          TOBIRAPOLISFESTIVAL2023: {
            [type as Tpf2023StampType]: "DONE",
          },
        },
      };
      await recordNewActivity(userId, `${name} を獲得した`);
      if (isStampCompleted) {
        const completeBadgeName = "TOBIRAPOLIS FESTIVAL2023 STAMP Complete";
        await mintNFT(completeBadgeName, "", userId, "Complete", event);
        await recordNewActivity(userId, "「TOBIRAPOLIS祭2023」すべてのスタンプを獲得した");
        await recordNewActivity(userId, `${completeBadgeName} を獲得した`);
        setData.mintStatus.TOBIRAPOLISFESTIVAL2023!.Complete = "DONE";
      }
      await firestore().collection("users").doc(userId).set(setData, {
        merge: true,
      });
    });
  } else if (event === "tmf2024") {
    await mintNFT(name, description, userId, type, event, async () => {
      const setData: { mintStatus: MintStatus } = {
        mintStatus: {
          TOBIRAMUSICFESTIVAL2024: {
            [type as Tmf2024StampType]: "DONE",
          },
        },
      };
      await recordNewActivity(userId, `${name} を獲得した`);
      await firestore().collection("users").doc(userId).set(setData, {
        merge: true,
      });
    });
  } else if (event === "tpfw2024") {
    await mintNFT(name, description, userId, type, event, async () => {
      const setData: { mintStatus: MintStatus } = {
        mintStatus: {
          TOBIRAPOLISFIREWORKS2024: {
            [type as Tpfw2024StampType]: "DONE" as MintStatusType,
          },
        },
      };
      await recordNewActivity(userId, `${name} を獲得した`);
      await firestore().collection("users").doc(userId).set(setData, {
        merge: true,
      });
    });
  } else if (event === "tpf2025") {
    await mintNFT(name, description, userId, type, event, async () => {
      const setData: { mintStatus: MintStatus } = {
        mintStatus: {
          TOBIRAPOLISFESTIVAL2025: {
            [type as Tpf2025StampType]: "DONE" as MintStatusType,
          },
        },
      };
      await recordNewActivity(userId, `${name} を獲得した`);
      await firestore().collection("users").doc(userId).set(setData, {
        merge: true,
      });
    });
  }
});

/*
export const mintFes23NftTask = onTaskDispatched({
  retryConfig: {
    maxAttempts: 5,
    minBackoffSeconds: 60,
  },
  rateLimits: {
    maxConcurrentDispatches: 1,
  },
  region: REGION,
}, async (req) => {
  const {name, description, type, userId, isStampCompleted} = req.data;
  await mintNFT(name, description, userId, type, async () => {
    const setData: { mintStatus: MintStatus } = {
      mintStatus: {
        TOBIRAPOLISFESTIVAL2023: {
          [type as Tpf2023StampType]: "DONE",
        },
      },
    };
    if (isStampCompleted) {
      await mintNFT("Complete", "", userId, "Complete");
      setData.mintStatus.TOBIRAPOLISFESTIVAL2023!.Complete = "DONE";
    }
    await firestore().collection("users").doc(userId).set(setData, {
      merge: true,
    });
  });
});
 */

const recordNewActivity = async (userId: string, text: string) => {
  await firestore().collection("users").doc(userId).collection("activity").add({
    text: text,
    timestamp: Timestamp.fromDate(new Date()),
  });
};

const createMetadata = async (nftId: number, type: string, name: string, description: string, imageUrl: string) => {
  await firestore().collection("journalStampRally").doc(nftId.toString()).set({
    description: description,
    type: type,
    image: imageUrl,
    name: name,
  });
};

const recordMintResult = async (userId: string, nftId: number, name: string, description: string, date: Date, imageUrl: string, type: string) => {
  await firestore().collection("users").doc(userId).collection("nft").doc(process.env.FLOW_JOURNAL_STAMP_RALLY_CONTRACT_ID ?? "").set({
    created_at: Timestamp.fromDate(date),
  });
  await firestore().collection("users").doc(userId).collection("nft").doc(process.env.FLOW_JOURNAL_STAMP_RALLY_CONTRACT_ID ?? "").collection("hold").doc(nftId.toString()).set({
    name: name,
    description: description,
    thumbnail: imageUrl,
    acquisition_time: Timestamp.fromDate(date),
    acquisition_method: "receive_from_system",
    type: type,
  });
};
