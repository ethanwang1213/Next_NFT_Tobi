import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {Timestamp} from "firebase-admin/lib/firestore";
import {REGION} from "./lib/constants";

export const taskWrapperLink = functions.region(REGION).https.onRequest(async (request, response) => {
  const id = request.query.id;
  if (!id || typeof id !== "string") {
    response.status(500).send("Invalid parameter 'id'").end();
    return;
  }
  const doc = firestore().collection("taskLink").doc(id);
  const taskLink = await doc.get();
  if (!taskLink.exists) {
    response.status(500).send("'id' does not exists").end();
    return;
  }
  const taskLinkData = taskLink.data();
  if (!taskLinkData) {
    response.status(500).send("Invalid data").end();
    return;
  }
  const url = taskLinkData.url;
  const expiredAt = taskLinkData.expiredAt as Timestamp;
  if (expiredAt.toDate() > new Date()) {
    response.status(500).send("このリンクは有効期限が切れています。もう一度リンクを発行してください。").end();
    return;
  }
  await doc.set({
    visited: true,
  }, {merge: true});
  response.redirect(url);
});
