import * as functions from "firebase-functions";
import {KeyManagementServiceClient} from "@google-cloud/kms";
// import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {REGION} from "./lib/constants";
import * as secp from "@noble/secp256k1";

export const decrypt = functions.region(REGION)
    .runWith({
      secrets: [
        "KMS_PROJECT_ID",
        "KMS_OPERATION_KEYRING",
        "KMS_OPERATION_KEY",
        "KMS_OPERATION_KEY_LOCATION",
        "KMS_USER_KEYRING",
        "KMS_USER_KEY",
        "KMS_USER_KEY_LOCATION",
        "FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY",
      ],
    })
    .https.onRequest(async (request, response) => {
      if (
        !process.env.KMS_PROJECT_ID ||
        !process.env.KMS_USER_KEY_LOCATION ||
        !process.env.KMS_USER_KEYRING ||
        !process.env.KMS_USER_KEY
      ) {
        throw new Error("The environment of generate key is not defined.");
      }
      // const secretName = "FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY";
      // const secretVersion = "1";
      // const sms = new SecretManagerServiceClient();
      // const name = sms.secretVersionPath("tobiratory-f6ae1", secretName, secretVersion);
      // const [version] = await sms.accessSecretVersion({
      //   name: name,
      // });
      // const secretValue = version.payload?.data?.toString();
      // const secretValue = process.env.FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY;
      const secretValue = request.query.secretValue;
      if (!secretValue || typeof secretValue !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "The 'secretValue' parameter is required.");
      }

      const kmsClient = new KeyManagementServiceClient();
      const keyName = kmsClient.cryptoKeyPath(
          process.env.KMS_PROJECT_ID,
          process.env.KMS_USER_KEY_LOCATION,
          process.env.KMS_USER_KEYRING,
          process.env.KMS_USER_KEY
      );
      const [result] = await kmsClient.decrypt({name: keyName, ciphertext: secretValue});
      const decryptedData = result.plaintext?.toString();

      response.send(`decryptedData : ${decryptedData}`);
    });

export const encrypt = functions.region(REGION)
    .runWith({
      secrets: [
        "KMS_PROJECT_ID",
        "KMS_OPERATION_KEYRING",
        "KMS_OPERATION_KEY",
        "KMS_OPERATION_KEY_LOCATION",
        "KMS_USER_KEYRING",
        "KMS_USER_KEY",
        "KMS_USER_KEY_LOCATION",
        "FLOW_ACCOUNT_CREATION_ACCOUNT_ENCRYPTED_PRIVATE_KEY",
      ],
    })
    .https.onRequest(async (request, response) => {
      if (
        !process.env.KMS_PROJECT_ID ||
        !process.env.KMS_OPERATION_KEY_LOCATION ||
        !process.env.KMS_OPERATION_KEYRING ||
        !process.env.KMS_OPERATION_KEY
      ) {
        throw new Error("The environment of generate key is not defined.");
      }
      const {privKey, pubKey} = generateKeyPair();
      const kmsClient = new KeyManagementServiceClient();
      const keyName = kmsClient.cryptoKeyPath(
          process.env.KMS_PROJECT_ID,
          process.env.KMS_OPERATION_KEY_LOCATION,
          process.env.KMS_OPERATION_KEYRING,
          process.env.KMS_OPERATION_KEY
      );
      const [result] = await kmsClient.encrypt({name: keyName, plaintext: Buffer.from(privKey)});
      const cypherText = result.ciphertext || "";
      const cypherTextBase64 = Buffer.from(cypherText).toString("base64");
      const [result2] = await kmsClient.decrypt({name: keyName, ciphertext: cypherTextBase64});
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
