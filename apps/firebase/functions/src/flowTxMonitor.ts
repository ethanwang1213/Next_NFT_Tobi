import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {PubSub} from "@google-cloud/pubsub";
import {REGION, TOPIC_NAMES} from "./lib/constants";
import * as fcl from "@onflow/fcl";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

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
      await fetchAndUpdateFlowAddress(flowAccounts.docs[0].ref);
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

const createOrGetFlowJobDocRef = async (flowJobId: string) => {
  const existingFlowJobs = await firestore().collection("flowJobs").where("flowJobId", "==", flowJobId).get();
  if (existingFlowJobs.size > 0) {
    return existingFlowJobs.docs[0].ref;
  }
  return await firestore().collection("flowJobs").add({flowJobId});
};

const fetchAndUpdateFlowAddress = async (flowAccountRef: firestore.DocumentReference<firestore.DocumentData>) => {
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
    }: {
      tobiratoryAccountUuid: string,
      address: string,
      publicKey: string,
      txId: string
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
    },
  });
};
