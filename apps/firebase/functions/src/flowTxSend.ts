import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {KeyManagementServiceClient} from "@google-cloud/kms";
import {PubSub} from "@google-cloud/pubsub";
import {NON_FUNGIBLE_TOKEN_ADDRESS, REGION, TOBIRATORY_DIGITAL_ITEMS_ADDRESS, TOPIC_NAMES} from "./lib/constants";
import * as fcl from "@onflow/fcl";
import * as secp from "@noble/secp256k1";
import {sha256} from "js-sha256";
import {SHA3} from "sha3";
import {ec as EC} from "elliptic";
import {prisma} from "./prisma";

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
      } else if (txType == "createItem") {
        const {txId} = await sendCreateItemTx(params.tobiratoryAccountUuid, params.digitalItemId, params.metadata);
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
      } else if (txType == "mintNFT") {
        const {id} = await createNFTRecord(params.digitalItemId, params.tobiratoryAccountUuid, params.metadata);
        const {txId} = await sendMintNFTTx(params.tobiratoryAccountUuid, params.itemCreatorAddress, params.itemId, id);
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
      }
    });

const updateDigitalItemRecord = async (id: number, txId: string) => {
  await prisma.tobiratory_digital_items.update({
    where: {
      id: id,
    },
    data: {
      tx_id: txId,
    },
  });
};

const updateNFTRecord = async (id: number, txId: string) => {
  await prisma.tobiratory_digital_item_nfts.update({
    where: {
      id: id,
    },
    data: {
      tx_id: txId,
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

const createNFTRecord = async (digitalItemId: number, ownerUuid: string, metadata: any) => {
  const nft = await prisma.tobiratory_digital_item_nfts.create({
    data: {
      digital_item_id: digitalItemId,
      owner_uuid: ownerUuid,
      nft_metadata: JSON.stringify(metadata),
      nft_model: metadata.model_url,
    },
  });

  return {id: nft.id};
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

const sendCreateItemTx = async (tobiratoryAccountUuid: string, digitalItemId: number, metadata: Metadata) => {
  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;

  const flowAccountDocRef = await getFlowAccountDocRef(tobiratoryAccountUuid);
  if (!flowAccountDocRef) {
    throw new functions.https.HttpsError("not-found", "The flow account does not exist.");
  }

  const cadence = `\
import NonFungibleToken from ${nonFungibleTokenAddress}
import MetadataViews from ${nonFungibleTokenAddress}
import TobiratoryDigitalItems from 0x${tobiratoryDigitalItemsAddress}
import FungibleToken from 0xee82856bf20e2aa6

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
    let royaltyReceiver: Capability<&AnyResource{FungibleToken.Receiver}>

    prepare(creator: AuthAccount, reviewer: AuthAccount) {
        if creator.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) == nil {
            let items <- TobiratoryDigitalItems.createItems()
            creator.save(<- items, to: TobiratoryDigitalItems.ItemsStoragePath)
            creator.link<&TobiratoryDigitalItems.Items{TobiratoryDigitalItems.ItemsPublic}>(
                TobiratoryDigitalItems.ItemsPublicPath,
                target: TobiratoryDigitalItems.ItemsStoragePath
            )
        }
        if creator.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection: @TobiratoryDigitalItems.Collection <- TobiratoryDigitalItems.createEmptyCollection() as! @TobiratoryDigitalItems.Collection
            creator.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            creator.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
                TobiratoryDigitalItems.CollectionPublicPath,
                target: TobiratoryDigitalItems.CollectionStoragePath
            )
        }
        self.itemsRef = creator.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) ?? panic("Not found")
        self.itemReviewerRef = reviewer.borrow<&TobiratoryDigitalItems.ItemReviewer>(from: TobiratoryDigitalItems.ItemReviewerStoragePath) ?? panic("Not found")
        self.royaltyReceiver = creator.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        // self.royaltyReceiver = creator.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver) ?? panic("Not found")
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
    arg(metadata.type, t.String),
    arg(metadata.name, t.Optional(t.String)),
    arg(metadata.description, t.Optional(t.String)),
    arg(metadata.thumbnailUrl, t.String),
    arg(metadata.modelUrl, t.Optional(t.String)),
    arg(metadata.creatorName, t.String),
    arg(metadata.limit, t.Optional(t.UInt32)),
    arg(metadata.license, t.Optional(t.String)),
    arg(metadata.copyrightHolders, t.Array(t.String)),
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
  if (!doc.exists || !data || !data.encryptedPrivateKeyBase64) {
    throw new Error("The private key of flow signer is not defined.");
  }
  const encryptedPrivateKey = data.encryptedPrivateKeyBase64;
  const privateKey = await decryptUserBase64PrivateKey(encryptedPrivateKey);

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
      const signature = signWithKey({privateKey: privateKey as string, msgHex: signable.message, hash: "sha3", sign: "ECDSA_secp256k1"});
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
      const copyrightHolders = args[8].value;
      const digitalItem = await prisma.tobiratory_digital_items.findUnique({
        where: {
          id: digitalItemId,
        },
      });
      if (!digitalItem) {
        throw new Error("DigitalItem does not found");
      }

      let dbCreatorName = "";
      const sampleItem = await prisma.tobiratory_sample_items.findUnique({
        where: {
          digital_item_id: digitalItem.id,
        },
      });
      if (sampleItem?.content_id) {
        const content = await prisma.tobiratory_contents.findUnique({
          where: {
            id: sampleItem?.content_id,
          },
        });
        if (content) {
          dbCreatorName = content.name;
        } else {
          const user = await prisma.tobiratory_accounts.findUnique({
            where: {
              uuid: digitalItem.creator_uuid,
            },
          });
          if (!user) {
            throw new Error("User does not found");
          }
          dbCreatorName = user.username;
        }
      } else {
        const user = await prisma.tobiratory_accounts.findUnique({
          where: {
            uuid: digitalItem.creator_uuid,
          },
        });
        if (!user) {
          throw new Error("User does not found");
        }
        dbCreatorName = user.username;
      }

      const copyrightRelate = await prisma.tobiratory_digital_items_copyright.findMany({
        where: {
          digital_item_id: digitalItem.id,
        },
      });
      const copyrights = await Promise.all(
          copyrightRelate.map(async (relate)=>{
            const copyrightData = await prisma.tobiratory_copyright.findUnique({
              where: {
                id: relate.copyright_id,
              },
            });
            return copyrightData?.copyright_name;
          })
      );

      const metadata = {
        type: String(digitalItem.type),
        name: digitalItem.name,
        description: digitalItem.description,
        thumbnailUrl: digitalItem.is_default_thumb?digitalItem.default_thumb_url:digitalItem.custom_thumb_url,
        modelUrl: sampleItem?.model_url,
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
      console.log("metadata.license === license: " + (metadata.license === license));
      console.log("arraysEqual(metadata.copyrightHolders, copyrightHolders): " +
          arraysEqual(metadata.copyrightHolders, copyrightHolders));

      if (
        metadata.type === type &&
          metadata.name === name &&
          metadata.description === description &&
          metadata.thumbnailUrl === thumbnailUrl &&
          metadata.modelUrl === modelUrl &&
          metadata.creatorName === creatorName &&
          metadata.limit == limit &&
          metadata.license === license &&
          arraysEqual(metadata.copyrightHolders, copyrightHolders)
      ) {
        const signature = signWithKey({privateKey,
          msgHex: signable.message,
          hash: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH || "",
          sign: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN || ""});
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

function arraysEqual(a: any[], b: any[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const sendMintNFTTx = async (tobiratoryAccountUuid: string, itemCreatorAddress: string, itemId: number, id: number) => {
  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;

  const flowAccountDocRef = await getFlowAccountDocRef(tobiratoryAccountUuid);
  if (!flowAccountDocRef) {
    throw new functions.https.HttpsError("not-found", "The flow account does not exist.");
  }

  const cadence = `\
import NonFungibleToken from ${nonFungibleTokenAddress}
import MetadataViews from ${nonFungibleTokenAddress}
import TobiratoryDigitalItems from 0x${tobiratoryDigitalItemsAddress}

transaction(
    itemCreatorAddress: Address,
    itemID: UInt64,
) {
    let receiverRef: &{NonFungibleToken.Receiver}
    let minterRef: &TobiratoryDigitalItems.Minter

    prepare(user: AuthAccount, minter: AuthAccount) {
        if user.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection: @TobiratoryDigitalItems.Collection <- TobiratoryDigitalItems.createEmptyCollection() as! @TobiratoryDigitalItems.Collection
            user.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            user.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
                TobiratoryDigitalItems.CollectionPublicPath,
                target: TobiratoryDigitalItems.CollectionStoragePath
            )
        }
        self.receiverRef = user.getCapability<&{NonFungibleToken.Receiver}>(TobiratoryDigitalItems.CollectionPublicPath).borrow()!
        self.minterRef = minter.borrow<&TobiratoryDigitalItems.Minter>(from: TobiratoryDigitalItems.MinterStoragePath) ?? panic("Not found")
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
    proposer: createCreatorAuthz(flowAccountDocRef),
    payer: createMintAuthz(itemId),
    authorizations: [createCreatorAuthz(flowAccountDocRef), createMintAuthz(itemId)],
    limit: 9999,
  });
  console.log({txId});

  await updateDigitalItemNFT(id, txId);

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

      const digitalItem = await prisma.tobiratory_digital_items.findFirst({
        where: {
          item_id: Number(itemId),
        },
      });
      if (!digitalItem) {
        throw new Error("DigitalItem does not found");
      }

      const flowAccountDocRef = await getFlowAccountDocRef(digitalItem.creator_uuid);
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
          itemID == digitalItem.item_id
      ) {
        const signature = signWithKey({privateKey,
          msgHex: signable.message,
          hash: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH || "",
          sign: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN || ""});
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
    if (existingFlowAccountSnapshot.data().txId) {
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

  const nonFungibleTokenAddress = NON_FUNGIBLE_TOKEN_ADDRESS;
  const tobiratoryDigitalItemsAddress = TOBIRATORY_DIGITAL_ITEMS_ADDRESS;

  // TODO: Add initialization for Tobiratory-related NFT Collection
  const cadence = `\
import NonFungibleToken from ${nonFungibleTokenAddress}
import MetadataViews from ${nonFungibleTokenAddress}
import TobiratoryDigitalItems from 0x${tobiratoryDigitalItemsAddress}

transaction(publicKey: String) {
    prepare(signer: AuthAccount) {
        let account = AuthAccount(payer: signer)
        account.keys.add(
            publicKey: PublicKey(
                publicKey: publicKey.decodeHex(),
                signatureAlgorithm: SignatureAlgorithm.ECDSA_secp256k1
            ),
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 1000.0
        )

        // let collection: @TobiratoryDigitalItems.Collection <- TobiratoryDigitalItems.createEmptyCollection() as! @TobiratoryDigitalItems.Collection
        // signer.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
        // signer.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
        //     TobiratoryDigitalItems.CollectionPublicPath,
        //     target: TobiratoryDigitalItems.CollectionStoragePath
        // )
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

const authz = async (account: any) => {
  const {addr, keyId, privateKey} = await authzBase();
  return {
    ...account,
    tempId: `${addr}-${keyId}`,
    addr: fcl.sansPrefix(addr),
    keyId,
    signingFunction: async (signable: any) => {
      const signature = signWithKey({privateKey,
        msgHex: signable.message,
        hash: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH || "",
        sign: process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_SIGN || ""});
      return {
        addr,
        keyId,
        signature,
      };
    },
  };
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
  let privateKey: string | undefined;
  if (process.env.PUBSUB_EMULATOR_HOST) {
    privateKey = process.env.FLOW_ACCOUNT_PRIVATE_KEY;
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
  const addr = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS;
  const keyId = Number(process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID);

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

const signWithKey = ({privateKey, msgHex, hash, sign}: {privateKey: string, msgHex: string, hash: string, sign: string}) => {
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
} : {
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

const updateDigitalItemNFT = async (id: number, txId: string) => {
  prisma.tobiratory_digital_item_nfts.update({
    where: {
      id: id,
    },
    data: {
      tx_id: txId,
    },
  });
};
