import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {KeyManagementServiceClient} from "@google-cloud/kms";
import {PubSub} from "@google-cloud/pubsub";
import {REGION, TOPIC_NAMES} from "./lib/constants";
import * as fcl from "@onflow/fcl";
import * as secp from "@noble/secp256k1";
import {sha256} from "js-sha256";
import {SHA3} from "sha3";
import {ec as EC} from "elliptic";

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
        const txId = await generateKeysAndSendFlowAccountCreationTx(params.email);
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
      }
    });

const createOrGetFlowJobDocRef = async (flowJobId: string) => {
  const existingFlowJobs = await firestore().collection("flowJobs").where("flowJobId", "==", flowJobId).get();
  if (existingFlowJobs.size > 0) {
    return existingFlowJobs.docs[0].ref;
  }
  return await firestore().collection("flowJobs").add({flowJobId});
  return await firestore().collection("flowJobs").add({flowJobId});
};

const generateKeysAndSendFlowAccountCreationTx = async (email: string) => {
  if (
    !process.env.KMS_PROJECT_ID ||
    !process.env.KMS_USER_KEY_LOCATION ||
    !process.env.KMS_USER_KEYRING ||
    !process.env.KMS_USER_KEY
  ) {
    throw new Error("The environment of generate key is not defined.");
  }
  const flowAccountRef = await createOrGetFlowAccountDocRef(email);
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

const createOrGetFlowAccountDocRef = async (email: string) => {
  const existingFlowAccounts = await firestore().collection("flowAccounts").where("email", "==", email).get();
  if (existingFlowAccounts.size > 0) {
    const existingFlowAccountSnapshot = existingFlowAccounts.docs[0];
    if (existingFlowAccountSnapshot.data().txId) {
      throw new functions.https.HttpsError("already-exists", "The transaction has already been sent.");
    }
    return existingFlowAccountSnapshot.ref;
  }
  return await firestore().collection("flowAccounts").add({
    email,
  });
};

const sendCreateAccountTx = async () => {
  const {privKey, pubKey} = generateKeyPair();

  const nonFungibleTokenAddress = process.env.FLOW_NETWORK == "mainnet" ? "0x1d7e57aa55817448" : "0x631e88ae7f1d7c20";
  const tobiratoryDigitalItemsAddress = process.env.FLOW_NETWORK == "mainnet" ? "TODO" : "TODO";

  // TODO: Add initialization for Tobiratory-related NFT Collection
  const cadence = `\
// import NonFungibleToken from ${nonFungibleTokenAddress}
// import MetadataViews from ${nonFungibleTokenAddress}
// import TobiratoryDigitalItems from ${tobiratoryDigitalItemsAddress}

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
  // const privateKey = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_PRIVATE_KEY;
  const encryptedPrivateKey = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY;
  const keyName = kmsClient.cryptoKeyPath(
      process.env.KMS_PROJECT_ID,
      process.env.KMS_OPERATION_KEY_LOCATION,
      process.env.KMS_OPERATION_KEYRING,
      process.env.KMS_OPERATION_KEY
  );
  const [decryptedData] = await kmsClient.decrypt({name: keyName, ciphertext: encryptedPrivateKey});
  const privateKey = decryptedData.plaintext?.toString();

  if (!privateKey) {
    throw new Error("The private key of flow signer is not defined.");
  }
  const addr = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS;
  const keyId = Number(process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID);
  return {
    ...account,
    tempId: `${addr}-${keyId}`,
    addr: fcl.sansPrefix(addr),
    keyId,
    signingFunction: async (signable: any) => {
      const signature = signWithKey({privateKey, msgHex: signable.message});
      return {
        addr,
        keyId,
        signature,
      };
    },
  };
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
    throw Error("Invalid arguments");
  }
};

const curve = new EC("secp256k1");

const signWithKey = ({privateKey, msgHex}: {privateKey: string, msgHex: string}) => {
  const key = curve.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const hash = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_HASH;
  if (!hash) {
    throw new Error("The environment of flow signer is not defined.");
  }
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
