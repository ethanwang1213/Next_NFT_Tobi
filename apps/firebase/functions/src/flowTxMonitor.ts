import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {PubSub} from "@google-cloud/pubsub";
import {
  NON_FUNGIBLE_TOKEN_ADDRESS,
  REGION,
  TOBIRATORY_DIGITAL_ITEMS_ADDRESS,
  TOPIC_NAMES,
} from "./lib/constants";
import {v4 as uuidv4} from "uuid";
import * as fcl from "@onflow/fcl";
import {pushToDevice} from "./appSendPushMessage";
import {prisma} from "./prisma";
import {
  digitalItemStatus,
  flowAccountStatus,
  giftStatus,
  mintStatus,
  notificationBatchStatus,
  transactionMaxRetryCount,
} from "./native/utils";
import {
  createFlowAccountCreationMail,
} from "./mail_template/flow_account_creation/flow_account_creation";
import {sendEmail} from "./lib/mail";

fcl.config({
  "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
  "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
});

const pubsub = new PubSub();

export const flowTxMonitor = functions.region(REGION).pubsub.topic(TOPIC_NAMES["flowTxMonitor"]).onPublish(async (message: any) => {
  const flowJobId = message.json.flowJobId;
  const txType = message.json.txType;
  const params = message.json.params;
  console.log(`flowTxMonitor: flowJobId=${flowJobId} txType=${txType} params=${JSON.stringify(params)}`);

  const flowJobDocRef = await createOrGetFlowJobDocRef(flowJobId);

  // Add processing here according to txType
  if (txType == "createFlowAccount") {
    const flowAccounts = await firestore().collection("flowAccounts").where("tobiratoryAccountUuid", "==", params.tobiratoryAccountUuid).get();
    if (flowAccounts.size == 0) {
      throw new Error("FLOW_ACCOUNT_NOT_FOUND");
    }
    try {
      const address = await fetchAndUpdateFlowAddress(flowAccounts.docs[0].ref, flowJobId);
      await flowJobDocRef.update({status: "done", updatedAt: new Date()});
      if (address) {
        if (params.fcmToken) {
          pushToDevice(params.fcmToken, undefined, {status: "success", body: JSON.stringify({type: "createFlowAccount", address})});
        }
        if (params.email) {
          await sendAccountCreationEmail(params.email, params.name, params.locale);
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message === "TX_FAILED") {
        const flowAccount = await prisma.flow_accounts.findUnique({
          where: {
            account_uuid: params.tobiratoryAccountUuid,
          },
        });
        if (flowAccount) {
          if (flowAccount.tx_retry_count >= transactionMaxRetryCount) {
            await prisma.flow_accounts.update({
              where: {
                account_uuid: params.tobiratoryAccountUuid,
              },
              data: {
                status: flowAccountStatus.error,
                tx_retry_count: 0,
              },
            });
            await flowJobDocRef.update({status: "error", updatedAt: new Date()});
            return;
          }
          await prisma.flow_accounts.update({
            where: {
              account_uuid: params.tobiratoryAccountUuid,
            },
            data: {
              status: flowAccountStatus.retrying,
              tx_retry_count: flowAccount.tx_retry_count + 1,
            },
          });
        } else {
          await prisma.flow_accounts.create({
            data: {
              account_uuid: params.tobiratoryAccountUuid,
              status: flowAccountStatus.retrying,
              tx_retry_count: 1,
            },
          });
        }
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
        digitalItemNftId: params.digitalItemNftId,
        metadata: params.metadata,
        notificationBatchId: params.notificationBatchId,
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
      await fetchAndUpdateMintNFT(params.digitalItemId, params.notificationBatchId, params.digitalItemNftId);
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
  } else if (txType == "giftNFT") {
    try {
      await fetchAndUpdateGiftNFT(params.digitalItemNftId, params.notificationBatchId);
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
  const flowAccount = await prisma.flow_accounts.findUnique({
    where: {
      account_uuid: creatorUuid,
    },
  });

  if (!flowAccount) {
    throw Error("FLOW_ACCOUNT_NOT_FOUND");
  }
  return {flowAccount};
};

const fetchAndUpdateCreateItem = async (digitalItemId: number) => {
  const digitalItem = await prisma.digital_items.findUnique({
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
  await prisma.digital_items.update({
    where: {
      id: digitalItemId,
    },
    data: {
      flow_item_id: Number(id),
    },
  });
  return {id};
};

const fetchCreateItem = async (txId: string) => {
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;
  const tx = await fcl.tx(txId).onceSealed();
  console.log(JSON.stringify(tx));
  for (const event of tx.events) {
    if (event.type === `A.${tobiratoryDigitalItemsAddress}.TobiratoryDigitalItems.ItemCreated`) {
      return {id: event.data.id, type: event.data.type, creatorAddress: event.data.creatorAddress};
    }
  }
  throw Error("TX_FAILED");
};

const fetchAndUpdateMintNFT = async (digitalItemId: number, notificationBatchId: number, digitalItemNftId: number) => {
  const digitalItem = await prisma.digital_items.findUnique({
    where: {
      id: digitalItemId,
    },
    include: {
      account: {
        include: {
          business: true,
        },
      },
    },
  });
  const nft = await prisma.digital_item_nfts.findUnique({
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
  const txId = nft.mint_tx_id;
  if (!txId) {
    throw new Error("TX_NOT_FOUND");
  }

  if (!digitalItem) {
    throw new Error("DIGITAL_ITEM_NOT_FOUND");
  }

  const {id, serialNumber, to} = await fetchMintNFT(txId);
  const itemId = digitalItem.flow_item_id;
  const creatorFlowAccount = await prisma.flow_accounts.findUnique({
    where: {
      account_uuid: digitalItem.account_uuid,
    },
  });
  if (!itemId) {
    throw new Error("ITEM_ID_NOT_FOUND");
  }
  if (!creatorFlowAccount) {
    throw new Error("CREATOR_FLOW_ACCOUNT_NOT_FOUND");
  }
  const creatorAddress = creatorFlowAccount.flow_address;
  if (!creatorAddress) {
    throw new Error("CREATOR_ADDRESS_NOT_FOUND");
  }
  const limit = await fetchMintLimit(itemId, creatorAddress);
  const mintedCount = await fetchMintedCount(itemId, creatorAddress);

  let status = digitalItemStatus.private;
  if (digitalItem.metadata_status == digitalItemStatus.hidden) {
    status = digitalItemStatus.hidden;
  }

  await prisma.digital_item_nfts.update({
    where: {
      id: digitalItemNftId,
    },
    data: {
      mint_status: mintStatus.minted,
      serial_no: Number(serialNumber),
      flow_nft_id: Number(id),
    },
  });
  await prisma.digital_items.update({
    where: {
      id: digitalItemId,
    },
    data: {
      limit: Number(limit),
      minted_count: Number(mintedCount),
      metadata_status: status,
    },
  });
  const flowAccount = await prisma.flow_accounts.findFirst({
    where: {
      flow_address: to,
    },
  });
  if (!flowAccount) {
    throw new Error("FLOW_ACCOUNT_NOT_FOUND");
  }
  const notificationBatch = await prisma.notification_batch.findUnique({
    where: {
      id: notificationBatchId,
    },
    include: {
      nfts: true,
    },
  });
  if (notificationBatch) {
    const nfts = notificationBatch.nfts;
    const length = nfts.filter((nft) => !nft.notified).length;
    console.log(length);
    if (length == 1) {
      const fcmToken = notificationBatch.fcm_token;
      if (fcmToken) {
        pushToDevice(fcmToken, {
          title: "NFTの作成が完了しました",
          body: "タップして見に行ってみよう!",
        }, {
          status: "success",
          body: JSON.stringify({
            type: "mintCompleted",
            data: {ids: notificationBatch.nfts.map((nft) => nft.id)},
          }),
        });
      }
      await prisma.digital_item_nfts.updateMany({
        where: {
          id: {
            in: notificationBatch.nfts.map((nft) => nft.id),
          },
        },
        data: {
          notification_batch_id: null,
          notified: false,
        },
      });
      await prisma.notification_batch.update({
        where: {
          id: notificationBatchId,
        },
        data: {
          status: notificationBatchStatus.completed,
          complete_time: new Date(),
        },
      });
    } else {
      await prisma.digital_item_nfts.update({
        where: {
          id: digitalItemNftId,
        },
        data: {
          notified: true,
        },
      });
    }
  }
};

const fetchMintNFT = async (txId: string) => {
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;
  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tx = await fcl.tx(txId).onceSealed();
  console.log(JSON.stringify(tx));
  const result: {
    id: number,
    itemID: number,
    serialNumber: number,
    to: string
  } = {
    id: -1,
    itemID: -1,
    serialNumber: -1,
    to: "",
  };
  for (const event of tx.events) {
    if (event.type === `A.${tobiratoryDigitalItemsAddress}.TobiratoryDigitalItems.Mint`) {
      result.id = event.data.id;
      result.itemID = event.data.itemID;
      result.serialNumber = event.data.serialNumber;
    } else if (event.type === `A.${nonFungibleTokenAddress}.NonFungibleToken.Deposited`) {
      result.to = event.data.to;
    }
  }
  if (result.id != -1) {
    return result;
  }
  throw Error("TX_FAILED");
};

const fetchMintLimit = async (itemId: number, creatorFlowAccount: string) => {
  const cadence = `
import TobiratoryDigitalItems from 0x${TOBIRATORY_DIGITAL_ITEMS_ADDRESS}

access(all) fun main(address: Address, itemID: UInt64): UInt32? {
    let items = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Items>(TobiratoryDigitalItems.ItemsPublicPath)
        .borrow()
        ?? panic("Could not borrow the NFT collection reference")
    let item = items.borrowItem(itemID: itemID)

    return item?.limit;
}`;
  return await fcl.query({
    cadence,
    args: (arg: any, t: any) => [arg(creatorFlowAccount, t.Address), arg(itemId, t.UInt64)],
  });
};

const fetchMintedCount = async (itemId: number, creatorFlowAccount: string) => {
  const cadence = `
import TobiratoryDigitalItems from 0x${TOBIRATORY_DIGITAL_ITEMS_ADDRESS}

access(all) fun main(address: Address, itemID: UInt64): UInt32? {
    let items = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Items>(TobiratoryDigitalItems.ItemsPublicPath)
        .borrow()
        ?? panic("Could not borrow the NFT collection reference")
    let item = items.borrowItem(itemID: itemID)

    return item?.mintedCount;
}`;

  return await fcl.query({
    cadence,
    args: (arg: any, t: any) => [arg(creatorFlowAccount, t.Address), arg(itemId, t.UInt64)],
  });
};

const fetchAndUpdateGiftNFT = async (nftId: number, notificationBatchId: number) => {
  const nft = await prisma.digital_item_nfts.findUnique({
    where: {
      id: nftId,
    },
  });
  if (!nft) {
    throw new Error("NFT_NOT_FOUND");
  }
  const txId = nft.gift_tx_id;
  if (!txId) {
    throw new Error("TX_NOT_FOUND");
  }
  const {withdraw, deposit} = await fetchGiftNFT(txId);
  if (withdraw && deposit) {
    const depositerFlowAccount = await prisma.flow_accounts.findFirst({
      where: {
        flow_address: deposit.to,
      },
    });
    if (depositerFlowAccount) {
      await prisma.digital_item_nfts.update({
        where: {
          id: nftId,
        },
        data: {
          gift_status: giftStatus.none,
          nft_owner: {
            update: {
              account_uuid: depositerFlowAccount.account_uuid,
              owner_flow_address: deposit.to,
              saidan_id: 0,
              box_id: 0,
            },
          },
        },
      });
    } else {
      await prisma.digital_item_nfts.update({
        where: {
          id: nftId,
        },
        data: {
          gift_status: giftStatus.none,
          nft_owner: {
            update: {
              account_uuid: null,
              owner_flow_address: deposit.to,
              saidan_id: 0,
              box_id: 0,
            },
          },
        },
      });
    }

    const notificationBatch = await prisma.notification_batch.findUnique({
      where: {
        id: notificationBatchId,
      },
      include: {
        nfts: true,
      },
    });
    if (notificationBatch) {
      const nfts = notificationBatch.nfts;
      const length = nfts.filter((nft) => !nft.notified).length;
      console.log(length);
      if (length == 1) {
        const fcmToken = notificationBatch.fcm_token;
        if (fcmToken) {
          pushToDevice(fcmToken, {
            title: "NFTのプレゼントが完了しました",
            body: "タップして受け取ってみよう!",
          }, {
            status: "success",
            body: JSON.stringify({
              type: "giftCompleted",
              data: {ids: notificationBatch.nfts.map((nft) => nft.id)},
            }),
          });
        }
        await prisma.digital_item_nfts.updateMany({
          where: {
            id: {
              in: notificationBatch.nfts.map((nft) => nft.id),
            },
          },
          data: {
            notification_batch_id: null,
            notified: false,
          },
        });
        await prisma.notification_batch.update({
          where: {
            id: notificationBatchId,
          },
          data: {
            status: notificationBatchStatus.completed,
            complete_time: new Date(),
          },
        });
      } else {
        await prisma.digital_item_nfts.update({
          where: {
            id: nftId,
          },
          data: {
            notified: true,
          },
        });
      }
    }
  }
};

const fetchGiftNFT = async (txId: string) => {
  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tx = await fcl.tx(txId).onceSealed();
  console.log(JSON.stringify(tx));
  const result: { withdraw: {
      id: number,
      from: string,
      date: number,
    } | null, deposit: {
      id: number,
      to: string,
      date: number,
    } | null } = {
      "withdraw": null,
      "deposit": null,
    };
  for (const event of tx.events) {
    if (event.type === `A.${nonFungibleTokenAddress}.NonFungibleToken.Withdrawn`) {
      result.withdraw = {id: event.data.id, from: event.data.from, date: new Date().getTime()};
    } else if (event.type === `A.${nonFungibleTokenAddress}.NonFungibleToken.Deposited`) {
      result.deposit = {id: event.data.id, to: event.data.to, date: new Date().getTime()};
    }
  }
  if (result.withdraw && result.deposit) {
    return result;
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
      return String(address);
    }
  }
  return null;
};

const fetchFlowAddress = async (txId: string) => {
  const tx = await fcl.tx(txId).onceSealed();
  console.log(JSON.stringify(tx));
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
  await prisma.flow_accounts.upsert({
    where: {
      account_uuid: tobiratoryAccountUuid,
    },
    update: {
      flow_address: address,
      public_key: publicKey,
      tx_id: txId,
      status: flowAccountStatus.success,
      flow_job_id: flowJobId,
    },
    create: {
      account_uuid: tobiratoryAccountUuid,
      flow_address: address,
      public_key: publicKey,
      tx_id: txId,
      flow_job_id: flowJobId,
      status: flowAccountStatus.success,
    },
  });
};

const sendAccountCreationEmail = async (email: string, name?: string, locale?: string) => {
  const mailData = createFlowAccountCreationMail(name, locale);
  await sendEmail(email, mailData.subject, mailData.body);
};
