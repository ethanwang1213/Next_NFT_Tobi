import {REGION} from "./lib/constants";
import {mintTobirapolisFestival23BadgeNFT} from "./lib/tobirapolisFestival23Flow";
import {firestore} from "firebase-admin";
import {MintStatus, Tpf2023Complete, Tpf2023StampType} from "types/journal-types";
import * as functions from "firebase-functions";
import Timestamp = firestore.Timestamp;

const mintNFT = async (name: string, description: string, userId: string, type: Tpf2023StampType | Tpf2023Complete, onComplete?: () => void) => {
  const txDetails = await mintTobirapolisFestival23BadgeNFT(name, description);
  console.log({txDetails});
  const events = txDetails.events;
  for (const mintEvent of events) {
    if (mintEvent.type === `${process.env.FLOW_TOBIRAPOLIS_FESTIVAL23_BADGE_CONTRACT_ID}.${process.env.FLOW_TOBIRAPOLIS_FESTIVAL23_BADGE_EVENT_NAME}`) {
      const totalSupply = mintEvent.data.totalSupply;
      if (!totalSupply) {
        return;
      }
      const nftId = totalSupply - 1;
      const imageUrl = `${process.env.TOBIRAPOLIS_FESTIVAL23_BADGE_IMAGE_URL}${type.toLowerCase()}.png`;
      await createTobirapolisFestival23BadgeMetadata(nftId, type, name, description, imageUrl);
      await transferTobirapolisFestival23Badge(userId, nftId, name, description, new Date(), imageUrl, type);

      if (onComplete) await onComplete();
      break;
    }
  }
};

export const mintFes23NftTaskv1 = functions.region(REGION).runWith({}).tasks.taskQueue({
  retryConfig: {
    maxAttempts: 5,
    minBackoffSeconds: 60,
  },
  rateLimits: {
    maxConcurrentDispatches: 1,
  },
}).onDispatch(async (data) => {
  const {name, description, type, userId, isStampCompleted} = data;
  await mintNFT(name, description, userId, type, async () => {
    const setData: { mintStatus: MintStatus } = {
      mintStatus: {
        TOBIRAPOLISFESTIVAL2023: {
          [type as Tpf2023StampType]: "DONE",
        },
      },
    };
    if (isStampCompleted) {
      await mintNFT("TOBIRAPOLIS FESTIVAL2023 STAMP Complete", "", userId, "Complete");
      setData.mintStatus.TOBIRAPOLISFESTIVAL2023!.Complete = "DONE";
    }
    await firestore().collection("users").doc(userId).set(setData, {
      merge: true,
    });
  });
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

const createTobirapolisFestival23BadgeMetadata = async (nftId: number, type: string, name: string, description: string, imageUrl: string) => {
  await firestore().collection("tobirapolisFestival23").doc(nftId.toString()).set({
    description: description,
    house_type: type,
    image: imageUrl,
    name: name,
  });
};

const transferTobirapolisFestival23Badge = async (userId: string, nftId: number, name: string, description: string, date: Date, imageUrl: string, type: string) => {
  await firestore().collection("users").doc(userId).collection("nft").doc(process.env.FLOW_TOBIRAPOLIS_FESTIVAL23_BADGE_CONTRACT_ID ?? "").set({
    created_at: Timestamp.fromDate(date),
  });
  await firestore().collection("users").doc(userId).collection("nft").doc(process.env.FLOW_TOBIRAPOLIS_FESTIVAL23_BADGE_CONTRACT_ID ?? "").collection("hold").doc(nftId.toString()).set({
    name: name,
    description: description,
    thumbnail: imageUrl,
    acquisition_time: Timestamp.fromDate(date),
    acquisition_method: "receive_from_system",
    type: type,
  });
};
