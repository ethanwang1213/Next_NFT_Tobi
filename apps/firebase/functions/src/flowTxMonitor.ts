import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {PubSub} from "@google-cloud/pubsub";
import {REGION, TOBIRATORY_DIGITAL_ITEMS_ADDRESS, TOPIC_NAMES} from "./lib/constants";
import {v4 as uuidv4} from "uuid";
import * as fcl from "@onflow/fcl";
import {pushToDevice} from "./appSendPushMessage";
import {prisma} from "./prisma";


fcl.config({
  "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
  "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
});

const pubsub = new PubSub();

export const flowTxMonitor = functions.region(REGION).pubsub.topic(TOPIC_NAMES["flowTxMonitor"]).onPublish(async (message: any) => {
  const flowJobId = message.json.flowJobId;
  const txType = message.json.txType;
  const params = message.json.params;
  console.log(`flowTxSend: flowJobId=${flowJobId} txType=${txType} params=${JSON.stringify(params)}`);

  const flowJobDocRef = await createOrGetFlowJobDocRef(flowJobId);

  // Add processing here according to txType
  if (txType == "createFlowAccount") {
    const flowAccounts = await firestore().collection("flowAccounts").where("tobiratoryAccountUuid", "==", params.tobiratoryAccountUuid).get();
    if (flowAccounts.size == 0) {
      throw new Error("FLOW_ACCOUNT_NOT_FOUND");
    }
    try {
      await fetchAndUpdateFlowAddress(flowAccounts.docs[0].ref, flowJobId);
      await flowJobDocRef.update({status: "done", updatedAt: new Date()});
    } catch (e) {
      if (e instanceof Error && e.message === "TX_FAILED") {
        const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage(message);
        console.log(`Message ${messageId} published.`);
        await flowJobDocRef.update({status: "retrying", updatedAt: new Date()});
      } else {
        throw e;
      }
    }
  } else if (txType == "createItem") {
    try {
      const digitalItemId = params.digitalItemId;
      const {id} = await fetchAndUpdateCreateItem(digitalItemId);
      await flowJobDocRef.update({status: "done", updatedAt: new Date()});
      const {flowAccount} = await fetchFlowAccount(params.tobiratoryAccountUuid);
      const mintMessage = {flowJobId: uuidv4(), txType: "mintNFT", params: {
        tobiratoryAccountUuid: params.tobiratoryAccountUuid,
        itemCreatorAddress: flowAccount.flow_address,
        itemId: id,
        digitalItemId,
        metadata: params.metadata,
        fcmToken: params.fcmToken,
      }};
      const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: mintMessage});
      console.log(`Message ${messageId} published.`);
    } catch (e) {
      if (e instanceof Error && e.message === "TX_FAILED") {
        const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage(message);
        console.log(`Message ${messageId} published.`);
        await flowJobDocRef.update({status: "retrying", updatedAt: new Date()});
      } else {
        throw e;
      }
    }
  } else if (txType == "mintNFT") {
    try {
      await fetchAndUpdateMintNFT(params.digitalItemId, params.fcmToken, params.digitalItemNftId);
      await flowJobDocRef.update({status: "done", updatedAt: new Date()});
    } catch (e) {
      if (e instanceof Error && e.message === "TX_FAILED") {
        const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage(message);
        console.log(`Message ${messageId} published.`);
        await flowJobDocRef.update({status: "retrying", updatedAt: new Date()});
      } else {
        throw e;
      }
    }
  }
});

const fetchFlowAccount = async (creatorUuid: string) => {
  const flowAccount = await prisma.tobiratory_flow_accounts.findUnique({
    where: {
      uuid: creatorUuid,
    },
  });

  if (!flowAccount) {
    throw Error("FLOW_ACCOUNT_NOT_FOUND");
  }
  return {flowAccount};
};

const fetchAndUpdateCreateItem = async (digitalItemId: number) => {
  const digitalItem = await prisma.tobiratory_digital_items.findUnique({
    where: {
      id: digitalItemId,
    },
  });
  if (!digitalItem) {
    throw new Error("DIGITAL_ITEM_NOT_FOUND");
  }
  const txId = digitalItem.tx_id;
  if (!txId) {
    throw new Error("TX_NOT_FOUND");
  }
  const {id} = await fetchCreateItem(txId);
  await prisma.tobiratory_digital_items.update({
    where: {
      id: digitalItemId,
    },
    data: {
      item_id: Number(id),
    },
  });
  return {id};
};

const fetchCreateItem = async (txId: string) => {
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;
  const tx = await fcl.tx(txId).onceSealed();
  console.log(tx);
  for (const event of tx.events) {
    if (event.type === `A.${tobiratoryDigitalItemsAddress}.TobiratoryDigitalItems.ItemCreated`) {
      return {id: event.data.id, type: event.data.type, creatorAddress: event.data.creatorAddress};
    }
  }
  throw Error("TX_FAILED");
};

const fetchAndUpdateMintNFT = async (digitalItemId: number, fcmToken: string, digitalItemNftId: number) => {
  const digitalItem = await prisma.tobiratory_digital_items.findUnique({
    where: {
      id: digitalItemId,
    },
  });
  const nft = await prisma.tobiratory_digital_item_nfts.findUnique({
    where: {
      id: digitalItemNftId,
    },
  });
  if (!digitalItem) {
    throw new Error("DIGITAL_ITEM_NOT_FOUND");
  }
  if (!nft) {
    throw new Error("NFT_NOT_FOUND");
  }
  const txId = nft.tx_id;
  if (!txId) {
    throw new Error("TX_NOT_FOUND");
  }

  const {serialNumber} = await fetchMintNFT(txId);

  await prisma.tobiratory_digital_item_nfts.update({
    where: {
      id: digitalItemNftId,
    },
    data: {
      mint_status: "minted",
      serial_no: serialNumber,
      box_id: 0,
    },
  });
  await prisma.tobiratory_digital_items.update({
    where: {
      id: digitalItemId,
    },
    data: {
      limit: digitalItem.limit ? digitalItem.limit - 1 : null,
    },
  });
  pushToDevice(fcmToken, {
    title: "NFTの作成が完了しました",
    body: "タップして見に行ってみよう!",
  }, {
    body: JSON.stringify({
      type: "mintCompleted",
      data: {id: digitalItemId},
    }),
  });
};

const fetchMintNFT = async (txId: string) => {
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;
  const tx = await fcl.tx(txId).onceSealed();
  console.log(tx);
  for (const event of tx.events) {
    if (event.type === `A.${tobiratoryDigitalItemsAddress}.TobiratoryDigitalItems.Mint`) {
      return {id: event.data.id, itemID: event.data.itemID, serialNumber: event.data.serialNumber};
    }
  }
  throw Error("TX_FAILED");
};

const createOrGetFlowJobDocRef = async (flowJobId: string) => {
  const existingFlowJobs = await firestore().collection("flowJobs").where("flowJobId", "==", flowJobId).get();
  if (existingFlowJobs.size > 0) {
    return existingFlowJobs.docs[0].ref;
  }
  return await firestore().collection("flowJobs").add({flowJobId});
};

const fetchAndUpdateFlowAddress = async (flowAccountRef: firestore.DocumentReference<firestore.DocumentData>, flowJobId: any) => {
  const flowAccount = await flowAccountRef.get();
  if (flowAccount.exists) {
    const flowAccountData = flowAccount.data();
    if (flowAccountData) {
      const txId = flowAccountData.txId;
      const tobiratoryAccountUuid = flowAccountData.tobiratoryAccountUuid;
      const publicKey = flowAccountData.pubKey;
      const address = await fetchFlowAddress(txId);
      await flowAccountRef.update({address});
      await upsertFlowAccountRecord({
        tobiratoryAccountUuid,
        address,
        publicKey,
        txId,
        flowJobId,
      });
    }
  }
};

const fetchFlowAddress = async (txId: string) => {
  const tx = await fcl.tx(txId).onceSealed();
  console.log(tx);
  for (const event of tx.events) {
    if (event.type === "flow.AccountCreated") {
      return event.data.address;
    }
  }
  throw Error("TX_FAILED");
};

const upsertFlowAccountRecord = async (
    {
      tobiratoryAccountUuid,
      address,
      publicKey,
      txId,
      flowJobId,
    }: {
      tobiratoryAccountUuid: string,
      address: string,
      publicKey: string,
      txId: string,
      flowJobId: any,
    }
) => {
  await prisma.tobiratory_flow_accounts.upsert({
    where: {
      uuid: tobiratoryAccountUuid,
    },
    update: {
      flow_address: address,
      public_key: publicKey,
      tx_id: txId,
    },
    create: {
      uuid: tobiratoryAccountUuid,
      flow_address: address,
      public_key: publicKey,
      tx_id: txId,
      flow_job_id: flowJobId,
    },
  });
};
