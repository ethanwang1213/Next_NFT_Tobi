import * as functions from "firebase-functions";
import {KeyManagementServiceClient} from "@google-cloud/kms";
// import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {REGION} from "./lib/constants";
import * as secp from "@noble/secp256k1";

const projectId = "tobiratory-key";
const keyring = "operation-data-encryption";
const key = "pkey-encryption";
const location = "global";

export const decrypt = functions.region(REGION)
    .runWith({
      secrets: ["FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY"],
    })
    .https.onRequest(async (request, response) => {
      // const secretName = "FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY";
      // const secretVersion = "1";
      // const sms = new SecretManagerServiceClient();
      // const name = sms.secretVersionPath("tobiratory-f6ae1", secretName, secretVersion);
      // const [version] = await sms.accessSecretVersion({
      //   name: name,
      // });
      // const secretValue = version.payload?.data?.toString();
      const secretValue = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY;

      const client = new KeyManagementServiceClient();
      const keyName = client.cryptoKeyPath(projectId, location, keyring, key);
      const [result] = await client.decrypt({name: keyName, ciphertext: secretValue});
      const decryptedData = result.plaintext?.toString();

      response.send(`decryptedData : ${decryptedData}`);
    });

export const encrypt = functions.region(REGION).https.onRequest(async (request, response) => {
  const {privKey, pubKey} = generateKeyPair();
  const client = new KeyManagementServiceClient();
  const keyName = client.cryptoKeyPath(projectId, location, keyring, key);
  const [result] = await client.encrypt({name: keyName, plaintext: Buffer.from(privKey)});
  const cypherText = result.ciphertext || "";
  const cypherTextBase64 = Buffer.from(cypherText).toString("base64");
  const [result2] = await client.decrypt({name: keyName, ciphertext: cypherTextBase64});
  const decryptedData = result2.plaintext?.toString();
  const res = `
  privKey : ${privKey}\n
  pubKey : ${pubKey}\n
  encrypted privKey : ${cypherTextBase64}\n
  decrypted privKey : ${decryptedData}\n
  `;
  response.send(res);
});

const generateKeyPair = () => {
  const privKey = secp.utils.randomPrivateKey(); // ECDSA_secp256k1
  const pubKey = secp.getPublicKey(privKey);
  return {
    privKey: Buffer.from(privKey).toString("hex"),
    pubKey: Buffer.from(pubKey).toString("hex").replace(/^04/, ""), // Remove uncompressed key prefix
  };
};
