import * as functions from "firebase-functions";
import {PubSub} from "@google-cloud/pubsub";
import {REGION, TOPIC_NAMES} from "./lib/constants";
import {v4 as uuidv4} from "uuid";
import * as cors from "cors";

const pubsub = new PubSub();

export const createFlowAccountDemo = functions.region(REGION).https.onRequest(async (request, response) => {
  const tobiratoryAccountUuid = request.query.uuid;
  if (!tobiratoryAccountUuid || typeof tobiratoryAccountUuid !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "The 'uuid' parameter is required.");
  }
  createFlowAccount(tobiratoryAccountUuid);
  const corsHandler = cors({origin: true});
  corsHandler(request, response, () => {
    response.status(200).json({result: "ok"});
  });
});

export const createFlowAccount = async (tobiratoryAccountUuid: string, fcmToken?: string, email?: string, name?: string, locale?: string) => {
  const flowJobId = uuidv4();
  const message = {flowJobId, txType: "createFlowAccount", params: {tobiratoryAccountUuid, fcmToken, email, name, locale}};
  const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
  console.log(`Message ${messageId} published.`);
  return {message: "success", flowJobId};
};
