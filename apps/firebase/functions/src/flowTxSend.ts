import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {KeyManagementServiceClient} from "@google-cloud/kms";
import {PubSub} from "@google-cloud/pubsub";
import {
  FUNGIBLE_TOKEN_ADDRESS,
  NON_FUNGIBLE_TOKEN_ADDRESS,
  REGION,
  TOBIRATORY_DIGITAL_ITEMS_ADDRESS,
  TOPIC_NAMES,
} from "./lib/constants";
import * as fcl from "@onflow/fcl";
import * as secp from "@noble/secp256k1";
import {sha256} from "js-sha256";
import {SHA3} from "sha3";
import {ec as EC} from "elliptic";
import {prisma} from "./prisma";
import {giftStatus, mintStatus} from "./native/utils";
import {pushToDevice} from "./appSendPushMessage";

fcl.config({
  "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
  "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
});

const pubsub = new PubSub();
const kmsClient = new KeyManagementServiceClient();

export const flowTxSend = functions.region(REGION)
    .runWith({
      secrets: [
        "KMS_PROJECT_ID",
        "KMS_OPERATION_KEYRING",
        "KMS_OPERATION_KEY",
        "KMS_OPERATION_KEY_LOCATION",
        "KMS_USER_KEYRING",
        "KMS_USER_KEY",
        "KMS_USER_KEY_LOCATION",
        "FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS",
        "FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID",
        "FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH",
        "FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN",
        "FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY",
        "FLOW_TRANSFER_PAYER_ACCOUNT_ADDRESS",
        "FLOW_TRANSFER_PAYER_ACCOUNT_KEY_ID",
        "FLOW_TRANSFER_PAYER_ACCOUNT_KEY_HASH",
        "FLOW_TRANSFER_PAYER_ACCOUNT_KEY_SIGN",
        "FLOW_TRANSFER_PAYER_ACCOUNT_ENCRYPTED_PRIVATE_KEY",
      ],
    })
    .pubsub.topic(TOPIC_NAMES["flowTxSend"]).onPublish(async (message: any) => {
      const flowJobId = message.json.flowJobId;
      const txType = message.json.txType;
      const params = message.json.params;
      console.log(`flowTxSend: ${flowJobId} ${txType} ${JSON.stringify(params)}`);

      const flowJobDocRef = await createOrGetFlowJobDocRef(flowJobId);

      // Add processing here according to txType
      if (txType == "createFlowAccount") {
        try {
          const txId = await generateKeysAndSendFlowAccountCreationTx(params.tobiratoryAccountUuid);
          await flowJobDocRef.update({
            flowJobId,
            txType,
            params,
            txId,
            sentAt: new Date(),
          });
          const messageForMoitoring = {flowJobId, txType, params};
          const messageId = await pubsub.topic(TOPIC_NAMES["flowTxMonitor"]).publishMessage({json: messageForMoitoring});
          console.log(`Message ${messageId} published.`);
        } catch (e) {
          if (params.fcmToken) {
            if (e instanceof Error) {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "createFlowAccount", message: e.message})});
            } else {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "createFlowAccount", message: "Unknown error"})});
            }
          }
          throw e;
        }
      } else if (txType == "createItem") {
        try {
          const {txId} = await sendCreateItemTx(params.digitalItemId, params.metadata);
          await flowJobDocRef.update({
            flowJobId,
            txType,
            params,
            txId,
            sentAt: new Date(),
          });
          await updateDigitalItemRecord(params.digitalItemId, txId);
          const messageForMonitoring = {flowJobId, txType, params};
          const messageId = await pubsub.topic(TOPIC_NAMES["flowTxMonitor"]).publishMessage({json: messageForMonitoring});
          console.log(`Message ${messageId} published.`);
        } catch (e) {
          if (params.fcmToken) {
            if (e instanceof Error) {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "mintNFT", message: e.message})});
            } else {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "mintNFT", message: "Unknown error"})});
            }
          }
          await updateMintNFTRecord(params.digitalItemNftId, mintStatus.error);
          throw e;
        }
      } else if (txType == "mintNFT") {
        const {id} = await createOrUpdateNFTRecord(params.digitalItemId, params.digitalItemNftId, params.tobiratoryAccountUuid, params.metadata, params.notificationBatchId);
        try {
          const {txId} = await sendMintNFTTx(params.tobiratoryAccountUuid, params.itemCreatorAddress, params.itemId, params.digitalItemId);
          await flowJobDocRef.update({
            flowJobId,
            txType,
            params,
            txId,
            sentAt: new Date(),
          });
          params.digitalItemNftId = id;
          await updateNFTRecord(id, txId);
          const messageForMonitoring = {flowJobId, txType, params};
          const messageId = await pubsub.topic(TOPIC_NAMES["flowTxMonitor"]).publishMessage({json: messageForMonitoring});
          console.log(`Message ${messageId} published.`);
        } catch (e) {
          if (params.fcmToken) {
            if (e instanceof Error) {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "mintNFT", message: e.message})});
            } else {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "mintNFT", message: "Unknown error"})});
            }
          }
          await updateMintNFTRecord(id, mintStatus.error);
          throw e;
        }
      } else if (txType == "giftNFT") {
        try {
          const {txId} = await sendGiftNFTTx(params.tobiratoryAccountUuid, params.digitalItemNftId, params.receiveFlowId, params.notificationBatchId);
          await flowJobDocRef.update({
            flowJobId,
            txType,
            params,
            txId,
            sentAt: new Date(),
          });
          await updateGiftTxId(params.digitalItemNftId, txId);
          const messageForMonitoring = {flowJobId, txType, params};
          const messageId = await pubsub.topic(TOPIC_NAMES["flowTxMonitor"]).publishMessage({json: messageForMonitoring});
          console.log(`Message ${messageId} published.`);
        } catch (e) {
          if (params.fcmToken) {
            if (e instanceof Error) {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "giftNFT", message: e.message})});
            } else {
              pushToDevice(params.fcmToken, undefined, {status: "error", body: JSON.stringify({type: "giftNFT", message: "Unknown error"})});
            }
          }
          await updateGiftNFTRecord(params.digitalItemNftId, giftStatus.error, -1);
          throw e;
        }
      }
    });

const updateGiftTxId = async (id: number, txId: string) => {
  await prisma.digital_item_nfts.update({
    where: {
      id: id,
    },
    data: {
      gift_tx_id: txId,
    },
  });
};

const updateDigitalItemRecord = async (id: number, txId: string) => {
  await prisma.digital_items.update({
    where: {
      id: id,
    },
    data: {
      tx_id: txId,
    },
  });
};

const updateNFTRecord = async (id: number, txId: string) => {
  await prisma.digital_item_nfts.update({
    where: {
      id: id,
    },
    data: {
      mint_tx_id: txId,
    },
  });
};

const createOrGetFlowJobDocRef = async (flowJobId: string) => {
  const existingFlowJobs = await firestore().collection("flowJobs").where("flowJobId", "==", flowJobId).get();
  if (existingFlowJobs.size > 0) {
    return existingFlowJobs.docs[0].ref;
  }
  return await firestore().collection("flowJobs").add({flowJobId});
};

const updateGiftNFTRecord = async (digitalItemNftId: number, status: number, notificationBatchId: number) => {
  if (notificationBatchId == -1) {
    await prisma.digital_item_nfts.update({
      where: {
        id: digitalItemNftId,
      },
      data: {
        gift_status: status,
      },
    });
  } else {
    await prisma.digital_item_nfts.update({
      where: {
        id: digitalItemNftId,
      },
      data: {
        gift_status: status,
        notification_batch_id: notificationBatchId,
        notified: false,
      },
    });
  }
};

const updateMintNFTRecord = async (digitalItemNftId: number, status: number) => {
  await prisma.digital_item_nfts.update({
    where: {
      id: digitalItemNftId,
    },
    data: {
      mint_status: status,
      nft_owner: {
        update: {
          status: status,
        },
      },
    },
  });
};

const createOrUpdateNFTRecord = async (digitalItemId: number, digitalItemNftId: number, ownerUuid: string, metadata: any, notificationBatchId: number) => {
  if (digitalItemNftId) {
    await prisma.digital_item_nfts.update({
      where: {
        id: digitalItemNftId,
      },
      data: {
        metadata: JSON.stringify(metadata),
      },
    });
    return {id: digitalItemNftId};
  } else {
    const creatorData = await prisma.accounts.findUnique({
      where: {
        uuid: ownerUuid,
      },
      include: {
        flow_account: true,
      },
    });
    const nft = await prisma.digital_item_nfts.create({
      data: {
        digital_item_id: digitalItemId,
        notification_batch_id: notificationBatchId,
        notified: false,
        metadata: JSON.stringify(metadata),
        nft_owner: {
          create: {
            account_uuid: ownerUuid,
            owner_flow_address: creatorData?.flow_account?.flow_address ?? "",
            nick_name: "",
            status: mintStatus.minting,
            saidan_id: 0,
            box_id: 0,
          },
        },
      },
    });
    return {id: nft.id};
  }
};

type Metadata = {
  type: string,
  name: string | undefined,
  description: string | undefined,
  thumbnailUrl: string,
  modelUrl: string | undefined,
  creatorName: string,
  limit: number | undefined,
  license: string | undefined,
  copyrightHolders: string[],
};

const sendCreateItemTx = async (digitalItemId: number, metadata: Metadata) => {
  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;
  const fungibleTokenAddress = FUNGIBLE_TOKEN_ADDRESS;

  const digitalItem = await prisma.digital_items.findUnique({
    where: {
      id: digitalItemId,
    },
  });
  if (!digitalItem) {
    throw new functions.https.HttpsError("not-found", "The digital item does not exist.");
  }
  const creatorUuid = digitalItem.account_uuid;
  const flowAccountDocRef = await getFlowAccountDocRef(creatorUuid);
  if (!flowAccountDocRef) {
    throw new functions.https.HttpsError("not-found", "The flow account does not exist.");
  }

  const cadence = `\
import MetadataViews from 0x${nonFungibleTokenAddress}
import TobiratoryDigitalItems from 0x${tobiratoryDigitalItemsAddress}
import FungibleToken from 0x${fungibleTokenAddress}

transaction(
    type: String,
    name: String?,
    description: String?,
    thumbnailUrl: String,
    modelUrl: String?,
    creatorName: String,
    limit: UInt32?,
    license: String?,
    copyrightHolders: [String],
) {
    let itemsRef: &TobiratoryDigitalItems.Items
    let itemReviewerRef: &TobiratoryDigitalItems.ItemReviewer
    let royaltyReceiver: Capability<&{FungibleToken.Receiver}>

    prepare(
        creator: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account,
        reviewer: auth(BorrowValue) &Account
    ) {
        if creator.storage.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) == nil {
            let items <- TobiratoryDigitalItems.createItems()
            creator.storage.save(<- items, to: TobiratoryDigitalItems.ItemsStoragePath)
            let cap = creator.capabilities.storage.issue<&TobiratoryDigitalItems.Items>(TobiratoryDigitalItems.ItemsStoragePath)
            creator.capabilities.publish(cap, at: TobiratoryDigitalItems.ItemsPublicPath)
        }
        if creator.storage.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
            creator.storage.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            let cap = creator.capabilities.storage.issue<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionStoragePath)
            creator.capabilities.publish(cap, at: TobiratoryDigitalItems.CollectionPublicPath)
        }
        self.itemsRef = creator.storage.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) ?? panic("Not found")
        self.itemReviewerRef = reviewer.storage.borrow<&TobiratoryDigitalItems.ItemReviewer>(from: TobiratoryDigitalItems.ItemReviewerStoragePath) ?? panic("Not found")
        self.royaltyReceiver = creator.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    }

    execute {
        self.itemsRef.createItem(
            type: type,
            name: name,
            description: description,
            thumbnailUrl: thumbnailUrl,
            modelUrl: modelUrl,
            creatorName: creatorName,
            limit: limit,
            license: license,
            copyrightHolders: copyrightHolders,
            royalties: [
                MetadataViews.Royalty(
                    receiver: self.royaltyReceiver,
                    cut: 0.1,
                    description: ""
                )
            ],
            extraMetadata: {},
            itemReviewer: self.itemReviewerRef,
        )
    }
}`;
  const args = (arg: any, t: any) => [
    arg(String(metadata.type || ""), t.String),
    arg(metadata.name ? String(metadata.name) : null, t.Optional(t.String)),
    arg(metadata.description ? String(metadata.description) : null, t.Optional(t.String)),
    arg(String(metadata.thumbnailUrl || ""), t.String),
    arg(metadata.modelUrl ? String(metadata.modelUrl) : null, t.Optional(t.String)),
    arg(String(metadata.creatorName || ""), t.String),
    arg(metadata.limit || null, t.Optional(t.UInt32)),
    arg(metadata.license ? JSON.stringify(metadata.license) : null, t.Optional(t.String)),
    arg(metadata.copyrightHolders || [], t.Array(t.String)),
  ];

  const txId = await fcl.mutate({
    cadence,
    args,
    proposer: createCreatorAuthz(flowAccountDocRef),
    payer: createItemAuthz(digitalItemId),
    authorizations: [createCreatorAuthz(flowAccountDocRef), createItemAuthz(digitalItemId)],
    limit: 9999,
  });
  console.log({txId});
  return {txId};
};

const decryptUserBase64PrivateKey = async (encryptedPrivateKeyBase64: string) => {
  if (
    !process.env.KMS_PROJECT_ID ||
    !process.env.KMS_USER_KEY_LOCATION ||
    !process.env.KMS_USER_KEYRING ||
    !process.env.KMS_USER_KEY
  ) {
    throw new Error("The environment of flow signer is not defined.");
  }
  const ciphertext = Buffer.from(encryptedPrivateKeyBase64, "base64");
  const keyName = kmsClient.cryptoKeyPath(
      process.env.KMS_PROJECT_ID,
      process.env.KMS_USER_KEY_LOCATION,
      process.env.KMS_USER_KEYRING,
      process.env.KMS_USER_KEY
  );
  const [decryptResponse] = await kmsClient.decrypt({
    name: keyName,
    ciphertext: ciphertext,
  });
  return decryptResponse.plaintext?.toString();
};

const createCreatorAuthz = (flowAccountRef: firestore.DocumentReference<firestore.DocumentData>) => async (account: any) => {
  if (!process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS ||
    !process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID ||
    !process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY ||
    !process.env.KMS_PROJECT_ID ||
    !process.env.KMS_OPERATION_KEY_LOCATION ||
    !process.env.KMS_OPERATION_KEYRING ||
    !process.env.KMS_OPERATION_KEY
  ) {
    throw new Error("The environment of flow signer is not defined.");
  }
  const doc = await flowAccountRef.get();
  const data = doc.data();
  if (!doc.exists || !data) {
    throw new Error("The private key of flow signer is not defined.");
  }

  let privateKey: string | undefined;
  let sign: string;
  if (process.env.PUBSUB_EMULATOR_HOST) {
    privateKey = process.env.FLOW_ACCOUNT_USER_PRIVATE_KEY;
    sign = "ECDSA_P256";
  } else {
    if (!data.encryptedPrivateKeyBase64) {
      throw new Error("The private key of flow signer is not defined.");
    }
    const encryptedPrivateKey = data.encryptedPrivateKeyBase64;
    privateKey = await decryptUserBase64PrivateKey(encryptedPrivateKey);
    sign = "ECDSA_secp256k1";
  }

  if (!privateKey) {
    throw new Error("The private key of flow signer is not defined.");
  }

  const address = data.address;
  if (!address) {
    throw new Error("The address of flow signer is not defined.");
  }
  return {
    ...account,
    tempId: `${address}-0`,
    addr: fcl.sansPrefix(address),
    keyId: 0,
    signingFunction: async (signable: any) => {
      const signature = signWithKey({privateKey: privateKey as string, msgHex: signable.message, hash: "sha3", sign: sign});
      return {
        addr: address,
        keyId: 0,
        signature,
      };
    },
  };
};

const createItemAuthz = (digitalItemId: number) => async (account: any) => {
  const {addr, keyId, privateKey} = await authzBase();
  return {
    ...account,
    tempId: `${addr}-${keyId}`,
    addr: fcl.sansPrefix(addr),
    keyId,
    signingFunction: async (signable: any) => {
      const args = signable.voucher.arguments;
      if (args.length != 9) {
        throw new Error("Invalid arguments");
      }
      const type = args[0].value;
      const name = args[1].value ? args[1].value.value : args[1].value;
      const description = args[2].value ? args[2].value.value : args[2].value;
      const thumbnailUrl = args[3].value;
      const modelUrl = args[4].value ? args[4].value.value : args[4].value;
      const creatorName = args[5].value;
      const limit = args[6].value ? args[6].value.value : args[6].value;
      const license = args[7].value ? args[7].value.value : args[7].value;
      const copyrightHolders = args[8].value.map((copyright: any) => {
        return copyright.value;
      });
      const digitalItem = await prisma.digital_items.findUnique({
        where: {
          id: digitalItemId,
        },
        include: {
          account: {
            include: {
              business: {
                include: {
                  content: true,
                },
              },
            },
          },
          license: true,
        },
      });
      if (!digitalItem) {
        throw new Error("DigitalItem does not found");
      }

      let dbCreatorName = "";
      if (digitalItem.account.business?.content) {
        dbCreatorName = digitalItem.account.business?.content.name;
      } else {
        const user = await prisma.accounts.findUnique({
          where: {
            uuid: digitalItem.account_uuid,
          },
        });
        if (!user) {
          throw new Error("User does not found");
        }
        dbCreatorName = user.username;
      }

      const copyrightRelate = await prisma.digital_items_copyright.findMany({
        where: {
          digital_item_id: digitalItem.id,
        },
      });
      const copyrights = await Promise.all(
          copyrightRelate.map(async (relate) => {
            const copyrightData = await prisma.copyrights.findUnique({
              where: {
                id: relate.copyright_id,
              },
            });
            return copyrightData?.name;
          })
      );

      const metadata = {
        type: String(digitalItem.type),
        name: digitalItem.name,
        description: digitalItem.description,
        thumbnailUrl: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
        modelUrl: digitalItem?.meta_model_url,
        creatorName: dbCreatorName,
        limit: digitalItem.limit,
        license: digitalItem.license,
        copyrightHolders: copyrights,
      };

      console.log("Checking metadata: ");
      console.log(metadata);
      console.log("Checking arguments: ");
      console.log({
        type,
        name,
        description,
        thumbnailUrl,
        modelUrl,
        creatorName,
        limit,
        license,
        copyrightHolders,
      });
      console.log("true or false:");
      console.log("metadata.type === type: " + (metadata.type === type));
      console.log("metadata.name === name: " + (metadata.name === name));
      console.log("metadata.description === description: " + (metadata.description === description));
      console.log("metadata.thumbnailUrl === thumbnailUrl: " + (metadata.thumbnailUrl === thumbnailUrl));
      console.log("metadata.modelUrl === modelUrl: " + (metadata.modelUrl === modelUrl));
      console.log("metadata.creatorName === creatorName: " + (metadata.creatorName === creatorName));
      console.log("metadata.limit == limit: " + (metadata.limit == limit));
      console.log("JSON.stringify(metadata.license) === license: " + (JSON.stringify(metadata.license) === license));
      console.log("arraysEqual(metadata.copyrightHolders, copyrightHolders): " +
        objectEqual(metadata.copyrightHolders, copyrightHolders));

      if (
        metadata.type === type &&
        metadata.name === name &&
        metadata.description === description &&
        metadata.thumbnailUrl === thumbnailUrl &&
        metadata.modelUrl === modelUrl &&
        metadata.creatorName === creatorName &&
        metadata.limit == limit &&
        JSON.stringify(metadata.license) === license &&
        objectEqual(metadata.copyrightHolders, copyrightHolders)
      ) {
        const signature = signWithKey({
          privateKey,
          msgHex: signable.message,
          hash: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH || "",
          sign: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN || "",
        });
        return {
          addr,
          keyId,
          signature,
        };
      } else {
        throw new Error("Invalid arguments");
      }
    },
  };
};

function objectEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const sendMintNFTTx = async (tobiratoryAccountUuid: string, itemCreatorAddress: string, itemId: number, digitalItemId: number) => {
  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;

  const digitalItem = await prisma.digital_items.findUnique({
    where: {
      id: digitalItemId,
    },
    include: {
      account: {
        include: {
          business: {
            include: {
              content: true,
            },
          },
        },
      },
    },
  });
  if (!digitalItem) {
    throw new functions.https.HttpsError("not-found", "The sample item does not exist.");
  }
  let creatorUuid = tobiratoryAccountUuid;
  if (digitalItem.account.business?.content) {
    creatorUuid = digitalItem.account.business?.content.businesses_uuid;
  }

  const creatorAccountDocRef = await getFlowAccountDocRef(creatorUuid);
  const requestAccountDocRef = await getFlowAccountDocRef(tobiratoryAccountUuid);
  if (!creatorAccountDocRef) {
    throw new functions.https.HttpsError("not-found", "The creator account does not exist.");
  }
  if (!requestAccountDocRef) {
    throw new functions.https.HttpsError("not-found", "The flow account does not exist.");
  }

  const cadence = `\
import NonFungibleToken from 0x${nonFungibleTokenAddress}
import TobiratoryDigitalItems from 0x${tobiratoryDigitalItemsAddress}

transaction(
    itemCreatorAddress: Address,
    itemID: UInt64,
) {
    let receiverRef: &{NonFungibleToken.Receiver}
    let minterRef: &TobiratoryDigitalItems.Minter

    prepare(
        user: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account,
        minter: auth(BorrowValue) &Account
    ) {
        if user.storage.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
            user.storage.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            let cap: Capability = user.capabilities.storage.issue<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionStoragePath)
            user.capabilities.publish(cap, at: TobiratoryDigitalItems.CollectionPublicPath)
        }
        self.receiverRef = user.capabilities.get<&{NonFungibleToken.Receiver}>(TobiratoryDigitalItems.CollectionPublicPath).borrow()!
        self.minterRef = minter.storage.borrow<&TobiratoryDigitalItems.Minter>(from: TobiratoryDigitalItems.MinterStoragePath) ?? panic("Not found")
    }

    execute {
        let nft <- self.minterRef.mint(
            itemCreatorAddress: itemCreatorAddress,
            itemID: itemID,
            extraMetadata: {},
        )
        self.receiverRef.deposit(token: <- nft)
    }
}`;
  const args = (arg: any, t: any) => [
    arg(itemCreatorAddress, t.Address),
    arg(itemId, t.UInt64),
  ];

  const txId = await fcl.mutate({
    cadence,
    args,
    proposer: createCreatorAuthz(creatorAccountDocRef),
    payer: createMintAuthz(itemId),
    authorizations: [createCreatorAuthz(requestAccountDocRef), createMintAuthz(itemId)],
    limit: 9999,
  });
  console.log({txId});

  return {txId};
};

const createMintAuthz = (itemId: number) => async (account: any) => {
  const {addr, keyId, privateKey} = await authzBase();
  return {
    ...account,
    tempId: `${addr}-${keyId}`,
    addr: fcl.sansPrefix(addr),
    keyId,
    signingFunction: async (signable: any) => {
      const args = signable.voucher.arguments;
      if (args.length != 2) {
        throw new Error("Invalid arguments");
      }
      const itemCreatorAddress = args[0].value;
      const itemID = args[1].value;

      const digitalItem = await prisma.digital_items.findFirst({
        where: {
          flow_item_id: Number(itemId),
        },
      });
      if (!digitalItem) {
        throw new Error("DigitalItem does not found");
      }

      const flowAccountDocRef = await getFlowAccountDocRef(digitalItem.account_uuid);
      if (!flowAccountDocRef) {
        throw new functions.https.HttpsError("not-found", "The flow account does not exist.");
      }

      const doc = await flowAccountDocRef.get();
      const data = doc.data();
      if (!doc.exists || !data || !data.address) {
        throw new Error("The address of flow signer is not defined.");
      }
      const creatorAddress = data.address;
      if (
        itemCreatorAddress === creatorAddress &&
        itemID == digitalItem.flow_item_id
      ) {
        const signature = signWithKey({
          privateKey,
          msgHex: signable.message,
          hash: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH || "",
          sign: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN || "",
        });
        return {
          addr,
          keyId,
          signature,
        };
      } else {
        throw new Error("Invalid arguments");
      }
    },
  };
};

const sendGiftNFTTx = async (tobiratoryAccountUuid: string, digitalItemNftId: number, receiveFlowId: string, notificationBatchId: number) => {
  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;

  const digitalItemNft = await prisma.digital_item_nfts.findUnique({
    where: {
      id: digitalItemNftId,
    },
  });
  if (!digitalItemNft) {
    throw new functions.https.HttpsError("not-found", "The digital item NFT does not exist.");
  }

  const flowNftId = digitalItemNft.flow_nft_id;
  if (!flowNftId) {
    throw new functions.https.HttpsError("not-found", "The flow_nft_id of the digital item NFT does not exist.");
  }

  const senderFlowAccountDocRef = await getFlowAccountDocRef(tobiratoryAccountUuid);
  if (!senderFlowAccountDocRef) {
    throw new functions.https.HttpsError("not-found", "The sender flow account does not exist.");
  }

  const senderFlowAccountDoc = await senderFlowAccountDocRef.get();
  const senderAccountDocData = senderFlowAccountDoc.data();
  if (!senderAccountDocData || !senderAccountDocData.address) {
    throw new functions.https.HttpsError("not-found", "The sender flow account does not exist.");
  }

  await updateGiftNFTRecord(digitalItemNftId, giftStatus.gifting, notificationBatchId);

  const cadence = `\
import NonFungibleToken from 0x${nonFungibleTokenAddress}
import TobiratoryDigitalItems from 0x${tobiratoryDigitalItemsAddress}

transaction(recipient: Address, withdrawID: UInt64) {
    let senderCollectionRef: auth(NonFungibleToken.Withdraw) &TobiratoryDigitalItems.Collection
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    prepare(acct: auth(BorrowValue, GetStorageCapabilityController) &Account) {
        self.senderCollectionRef = acct
            .storage.borrow<auth(NonFungibleToken.Withdraw) &TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath)
            ?? panic("Not found")

        self.recipientCollectionRef = getAccount(recipient)
            .capabilities.get<&{NonFungibleToken.CollectionPublic}>(TobiratoryDigitalItems.CollectionPublicPath)
            .borrow()
            ?? panic("Not found")
    }

    execute {
        let nft <- self.senderCollectionRef.withdraw(withdrawID: withdrawID)
        self.recipientCollectionRef.deposit(token: <-nft)
    }
}
`;

  const args = (arg: any, t: any) => [
    arg(receiveFlowId, t.Address),
    arg(flowNftId, t.UInt64),
  ];

  const txId = await fcl.mutate({
    cadence,
    args,
    proposer: createCreatorAuthz(senderFlowAccountDocRef),
    payer: transferPayer,
    authorizations: [createCreatorAuthz(senderFlowAccountDocRef)],
    limit: 9999,
  });
  console.log({txId});

  return {txId};
};

const generateKeysAndSendFlowAccountCreationTx = async (tobiratoryAccountUuid: string) => {
  if (
    !process.env.KMS_PROJECT_ID ||
    !process.env.KMS_USER_KEY_LOCATION ||
    !process.env.KMS_USER_KEYRING ||
    !process.env.KMS_USER_KEY
  ) {
    throw new Error("The environment of generate key is not defined.");
  }
  const flowAccountRef = await createOrGetFlowAccountDocRef(tobiratoryAccountUuid);
  const {privKey, pubKey, txId} = await sendCreateAccountTx();

  const keyName = kmsClient.cryptoKeyPath(
      process.env.KMS_PROJECT_ID,
      process.env.KMS_USER_KEY_LOCATION,
      process.env.KMS_USER_KEYRING,
      process.env.KMS_USER_KEY
  );
  const [result] = await kmsClient.encrypt({name: keyName, plaintext: Buffer.from(privKey)});
  const encryptedPrivateKey = result.ciphertext || "";
  const encryptedPrivateKeyBase64 = Buffer.from(encryptedPrivateKey).toString("base64");

  await fillInFlowAccountCreattionInfo({flowAccountRef, encryptedPrivateKeyBase64, pubKey, txId});
  return txId;
};

const getFlowAccountDocRef = async (tobiratoryAccountUuid: string) => {
  const existingFlowAccounts = await firestore().collection("flowAccounts").where("tobiratoryAccountUuid", "==", tobiratoryAccountUuid).get();
  if (existingFlowAccounts.size > 0) {
    const existingFlowAccountSnapshot = existingFlowAccounts.docs[0];
    return existingFlowAccountSnapshot.ref;
  }
  return null;
};

const createOrGetFlowAccountDocRef = async (tobiratoryAccountUuid: string) => {
  const existingFlowAccounts = await firestore().collection("flowAccounts").where("tobiratoryAccountUuid", "==", tobiratoryAccountUuid).get();
  if (existingFlowAccounts.size > 0) {
    const existingFlowAccountSnapshot = existingFlowAccounts.docs[0];
    const data = existingFlowAccountSnapshot.data();
    if (data.txId) {
      const flowAccount = await prisma.flow_accounts.findUnique({
        where: {
          account_uuid: tobiratoryAccountUuid,
          is_deleted: false,
        },
      });
      if (!flowAccount || !flowAccount.flow_address) {
        const flowJobs = await firestore().collection("flowJobs").where("txId", "==", data.txId).get();
        if (flowJobs.size <= 0) {
          throw new functions.https.HttpsError("not-found", "The transaction history is not found.");
        }
        const flowJob = flowJobs.docs[0].data();
        await prisma.flow_accounts.upsert({
          where: {
            account_uuid: tobiratoryAccountUuid,
          },
          update: {
            flow_address: data.address,
            public_key: data.pubKey,
            tx_id: data.txId,
          },
          create: {
            account_uuid: tobiratoryAccountUuid,
            flow_address: data.address,
            public_key: data.pubKey,
            tx_id: data.txId,
            flow_job_id: flowJob.flowJobId,
          },
        });
      }
      throw new functions.https.HttpsError("already-exists", "The transaction has already been sent.");
    }
    return existingFlowAccountSnapshot.ref;
  }
  return await firestore().collection("flowAccounts").add({
    tobiratoryAccountUuid,
  });
};

const sendCreateAccountTx = async () => {
  const {privKey, pubKey} = generateKeyPair();

  // const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  // const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;

  // TODO: Add initialization for Tobiratory-related NFT Collection
  const cadence = `\
transaction(publicKey: String) {
    prepare(signer: auth(BorrowValue) &Account) {
        let key = PublicKey(
            publicKey: publicKey.decodeHex(),
            signatureAlgorithm: SignatureAlgorithm.ECDSA_secp256k1
        )

        let account = Account(payer: signer)

        account.keys.add(
            publicKey: key, 
            hashAlgorithm: 
            HashAlgorithm.SHA3_256, 
            weight: 1000.0
        )
    }
}`;
  const args = (arg: any, t: any) => [arg(pubKey, t.String)];
  const txId = await fcl.mutate({
    cadence,
    args,
    proposer: authz,
    payer: authz,
    authorizations: [authz],
    limit: 9999,
  });
  console.log({txId});
  return {privKey, pubKey, txId};
};

const generateKeyPair = () => {
  const privKey = secp.utils.randomPrivateKey(); // ECDSA_secp256k1
  const pubKey = secp.getPublicKey(privKey);
  return {
    privKey: Buffer.from(privKey).toString("hex"),
    pubKey: Buffer.from(pubKey).toString("hex").replace(/^04/, ""), // Remove uncompressed key prefix
  };
};

const transferPayer = async (account: any) => {
  const {addr, keyId, privateKey} = await transferPayerBase();
  return {
    ...account,
    tempId: `${addr}-${keyId}`,
    addr: fcl.sansPrefix(addr),
    keyId,
    signingFunction: async (signable: any) => {
      const signature = signWithKey({
        privateKey,
        msgHex: signable.message,
        hash: process.env.FLOW_TRANSFER_PAYER_ACCOUNT_KEY_HASH || "",
        sign: process.env.FLOW_TRANSFER_PAYER_ACCOUNT_KEY_SIGN || "",
      });
      return {
        addr,
        keyId,
        signature,
      };
    },
  };
};

const authz = async (account: any) => {
  const {addr, keyId, privateKey} = await authzBase();
  return {
    ...account,
    tempId: `${addr}-${keyId}`,
    addr: fcl.sansPrefix(addr),
    keyId,
    signingFunction: async (signable: any) => {
      const signature = signWithKey({
        privateKey,
        msgHex: signable.message,
        hash: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH || "",
        sign: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN || "",
      });
      return {
        addr,
        keyId,
        signature,
      };
    },
  };
};

const transferPayerBase = async () => {
  if (!process.env.FLOW_TRANSFER_PAYER_ACCOUNT_ADDRESS ||
    !process.env.FLOW_TRANSFER_PAYER_ACCOUNT_KEY_ID ||
    !process.env.FLOW_TRANSFER_PAYER_ACCOUNT_ENCRYPTED_PRIVATE_KEY ||
    !process.env.KMS_PROJECT_ID ||
    !process.env.KMS_OPERATION_KEY_LOCATION ||
    !process.env.KMS_OPERATION_KEYRING ||
    !process.env.KMS_OPERATION_KEY
  ) {
    throw new Error("The environment of flow signer is not defined.");
  }
  let privateKey: string | undefined;
  let addr: string | undefined;
  let keyId: number;
  if (process.env.PUBSUB_EMULATOR_HOST) {
    privateKey = process.env.FLOW_ACCOUNT_PRIVATE_KEY;
    addr = process.env.FLOW_TRANSFER_PAYER_ACCOUNT_ADDRESSES || "";
    keyId = Number(process.env.FLOW_TRANSFER_PAYER_ACCOUNT_KEY_ID);
  } else {
    const encryptedPrivateKey = process.env.FLOW_TRANSFER_PAYER_ACCOUNT_ENCRYPTED_PRIVATE_KEY;
    const keyName = kmsClient.cryptoKeyPath(
        process.env.KMS_PROJECT_ID,
        process.env.KMS_OPERATION_KEY_LOCATION,
        process.env.KMS_OPERATION_KEYRING,
        process.env.KMS_OPERATION_KEY
    );
    const [decryptedData] = await kmsClient.decrypt({name: keyName, ciphertext: encryptedPrivateKey});
    privateKey = decryptedData.plaintext?.toString();
    addr = process.env.FLOW_TRANSFER_PAYER_ACCOUNT_ADDRESS;
    keyId = Number(process.env.FLOW_TRANSFER_PAYER_ACCOUNT_KEY_ID);
  }

  if (!privateKey || !addr) {
    throw new Error("The environment variable of flow signer is not defined.");
  }

  return {addr: addr as string, keyId, privateKey: privateKey as string};
};

const authzBase = async () => {
  if (!process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS ||
    !process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID ||
    !process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY ||
    !process.env.KMS_PROJECT_ID ||
    !process.env.KMS_OPERATION_KEY_LOCATION ||
    !process.env.KMS_OPERATION_KEYRING ||
    !process.env.KMS_OPERATION_KEY
  ) {
    throw new Error("The environment of flow signer is not defined.");
  }
  let addr = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS;
  const keyId = Number(process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID);
  let privateKey: string | undefined;
  if (process.env.PUBSUB_EMULATOR_HOST) {
    privateKey = process.env.FLOW_ACCOUNT_PRIVATE_KEY;
    addr = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESSES || "";
  } else {
    const encryptedPrivateKey = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY;
    const keyName = kmsClient.cryptoKeyPath(
        process.env.KMS_PROJECT_ID,
        process.env.KMS_OPERATION_KEY_LOCATION,
        process.env.KMS_OPERATION_KEYRING,
        process.env.KMS_OPERATION_KEY
    );
    const [decryptedData] = await kmsClient.decrypt({name: keyName, ciphertext: encryptedPrivateKey});
    privateKey = decryptedData.plaintext?.toString();
  }

  if (!privateKey) {
    throw new Error("The private key of flow signer is not defined.");
  }

  return {addr: addr as string, keyId, privateKey: privateKey as string};
};

const hashMessageHex = (hashType: string, msgHex: string) => {
  const buffer = Buffer.from(msgHex, "hex");
  if (hashType === "sha256") {
    return sha256.digest(buffer);
  } else if (hashType === "sha3") {
    const sha3 = new SHA3(256);
    sha3.update(buffer);
    return sha3.digest();
  } else {
    throw Error("Invalid arguments3");
  }
};

const getSignCurve = (signType: string) => {
  if (signType == "ECDSA_secp256k1") {
    return new EC("secp256k1");
  } else if (signType == "ECDSA_P256") {
    return new EC("p256");
  } else {
    throw Error("Invalid arguments4");
  }
};

const signWithKey = ({privateKey, msgHex, hash, sign}: { privateKey: string, msgHex: string, hash: string, sign: string }) => {
  const curve = getSignCurve(sign);
  const key = curve.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMessageHex(hash, msgHex));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

const fillInFlowAccountCreattionInfo = async ({
  flowAccountRef,
  encryptedPrivateKeyBase64,
  pubKey,
  txId,
}: {
  flowAccountRef: firestore.DocumentReference<firestore.DocumentData>;
  encryptedPrivateKeyBase64: string;
  pubKey: string;
  txId: string;
}) => {
  await flowAccountRef.update({
    encryptedPrivateKeyBase64,
    pubKey,
    txId,
    sentAt: new Date(),
    address: "",
  });
};
