import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {parseNftByName} from "./lib/nft";

exports.checkRedeem = functions.https.onCall(async (data, context) => {
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
  const redeem = data.redeem;
  if (!redeem) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with redeem.");
  }
  const orders = await firestore().collection("orders").where("email", "==", email).get();
  if (orders.empty) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have orders.");
  }
  // loop orders
  for (const order of orders.docs) {
    const items = await order.ref.collection("items").where("redeem", "==", redeem).get();
    if (items.size == 0) {
      continue;
    }
    const item = items.docs[0].data();
    if (!item.used_at) {
      // TODO: make them as a transaction
      const nft = parseNftByName(item.name);
      await firestore().collection("users").doc(context.auth.uid).collection("nft").doc(nft.type).collection("hold").doc(nft.id).set({
        name: nft.name,
        description: "",
        thumbnail: nft.thumbnail,
        acquisition_time: new Date(),
        acquisition_method: "purchase_in_shop",
      });
      await items.docs[0].ref.update({
        used_at: new Date(),
      });
      return item.name;
    } else {
      throw new functions.https.HttpsError("unavailable", "The redeem code is already used.");
    }
  }
  throw new functions.https.HttpsError("not-found", "The redeem code is not found.");
});

exports.getPayments = functions.https.onCall(async (data, context) => {
  console.log("getPayments");
  console.log(data);
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
  const payments = await firestore().collection("payments").where("email", "==", email).get();
  if (payments.empty) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have payments.");
  }
  return payments.docs.map((payment) => {
    return payment.data();
  });
});
