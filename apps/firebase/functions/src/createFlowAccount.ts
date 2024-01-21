import * as functions from "firebase-functions";
import {PubSub} from "@google-cloud/pubsub";
import {firestore} from "firebase-admin";
import {REGION, TOPIC_NAMES} from "./lib/constants";
import * as cors from "cors";

const pubsub = new PubSub();

export const createFlowAccountDemo = functions.region(REGION).https.onRequest(async (request, response) => {
  const flowJobId = request.query.flowJobId;
  const email = request.query.email;
  if (!flowJobId) {
    throw new functions.https.HttpsError("invalid-argument", "The 'flowJobId' parameter is required.");
  }
  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "The 'email' parameter is required.");
  }
  const message = {flowJobId, txType: "createFlowAccount", params: {email}};
  const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
  console.log(`Message ${messageId} published.`);

  const corsHandler = cors({origin: true});
  corsHandler(request, response, () => {
    response.status(200).json({result: "ok"});
  });
});

export const createFlowAccount = functions.region(REGION).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const userDoc = await firestore().collection("users").doc(context.auth.uid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "The user doesn't exist.");
  }
  const email = userDoc.data()?.email;
  if (!email) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have email.");
  }

  const flowJobId = data.flowJobId;
  if (!flowJobId) {
    throw new functions.https.HttpsError("invalid-argument", "The 'flowJobId' parameter is required.");
  }
  const message = {flowJobId, txType: "createFlowAccount", params: {email}};
  const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
  console.log(`Message ${messageId} published.`);
  return {message: "success", flowJobId};
});
