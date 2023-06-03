import * as functions from "firebase-functions";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import {firestore} from "firebase-admin";
import * as cors from "cors";
import fetch from "node-fetch";
import {parseNftByName} from "./lib/nft";

// initializeApp() is not needed in Cloud Functions for Firebase
initializeApp({
  credential: applicationDefault(),
});

exports.shopifyOrders = require("./shopifyOrders");

if (process.env.PUBSUB_EMULATOR_HOST) {
  exports.devtool = require("./devtool");
}

export const background = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  const corsHandler = cors({origin: true});
  corsHandler(request, response, () => {
    const resData = {
      data: {
        v1: "111,000",
        v2: "367872",
        v3: "306",
      },
    };
    response.status(200).json(resData);
  });
});

export const discordOAuth = functions.https.onRequest(async (request, response) => {
  const code = request.query.code;
  if (!code || typeof code !== "string") {
    response.status(500).send("Invalid parameter of code").end();
    return;
  }
  const params = new URLSearchParams();
  params.append("client_id", process.env.DISCORD_OAUTH_CLIENT_ID || "discord_oauth_client_id");
  params.append("client_secret", process.env.DISCORD_OAUTH_CLIENT_SECRET || "discord_oauth_client_secret");
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.DISCORD_OAUTH_CLIENT_REDIRECT_URI || "http://localhost:3000/authed");
  params.append("scope", "identify");
  const tokenResponse: any = await (await fetch("https://discordapp.com/api/oauth2/token", {
    method: "POST",
    body: params,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
  })).json();
  if (tokenResponse.error) {
    response.status(500).send( "Can't get token").end();
    return;
  }
  const accessToken = tokenResponse.access_token;
  const userdata: any = await (await fetch("https://discordapp.com/api/users/@me", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  })).json();
  if (userdata.code == 0) {
    response.status(500).send("Can't get userdata").end();
    return;
  }
  response.status(200).send(userdata).end();
});

export const checkRedeem = functions.https.onCall(async (data, context) => {
  console.log("checkRedeem");
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
      // TODO: get metadata from NFT
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

export const getPayments = functions.https.onCall(async (data, context) => {
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
