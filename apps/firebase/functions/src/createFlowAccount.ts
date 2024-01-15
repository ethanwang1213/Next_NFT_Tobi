import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {REGION} from "./lib/constants";
import * as fcl from "@onflow/fcl";
import * as secp from "@noble/secp256k1";
import {sha256} from "js-sha256";
import {SHA3} from "sha3";
import {ec as EC} from "elliptic";
// import * as cors from "cors";

// export const createFlowAccountDemo = functions.region(REGION).https.onRequest(async (request, response) => {
//     const email = 'test@test.com';
//     const txId = await generateKeysAndSendFlowAccountCreationTx(email);
//     const corsHandler = cors({origin: true});
//     corsHandler(request, response, () => {
//       response.status(200).json({ txId });
//     });
// });

export const createFlowAccount = functions.region(REGION).https.onCall(async (data, context) => {
  // TODO: Is this the correct way to use the "users" table?
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const userDoc = await firestore().collection("users").doc(context.auth.uid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "The user doesn't exist.");
  }
  const user = userDoc.data();
  const email = user?.email;
  if (!email) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have email.");
  }

  const txId = await generateKeysAndSendFlowAccountCreationTx(email);
  return {txId};
});

const generateKeysAndSendFlowAccountCreationTx = async (email: string) => {
  // Create or Get Flow Account Doc Ref
  const flowAccountRef = await createOrGetFlowAccountDocRef(email);

  // Generate new key pair & Send Flow account creation tx
  const {privKey, pubKey} = generateKeyPair();
  const txId = await sendCreateAccountTx(pubKey);
  console.log({txId});

  // Set key pair and tx info
  await flowAccountRef.update({
    privKey,
    pubKey, // TODO: Encryption
    txId,
    sentAt: new Date(),
  });

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

const generateKeyPair = () => {
  const privKey = secp.utils.randomPrivateKey(); // ECDSA_secp256k1
  const pubKey = secp.getPublicKey(privKey);
  return {
    privKey: Buffer.from(privKey).toString("hex"),
    pubKey: Buffer.from(pubKey).toString("hex").replace(/^04/, ""), // Remove uncompressed key prefix
  };
};

const sendCreateAccountTx = async (pubKey: string) => {
  fcl.config({
    "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
    "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
  });

  // TODO: Add initialization for Tobiratory-related NFT Collection?
  const cadence = `\
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
  return txId;
};

const authz = async (account: any) => {
  const addr = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ADDRESS;
  const privateKey = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_PRIVATE_KEY;
  const keyId = Number(process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_KEY_ID);
  if (!addr || !privateKey) {
    throw new Error("The environment of flow signer is not defined.");
  }
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
