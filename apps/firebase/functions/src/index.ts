import * as functions from "firebase-functions";
import {PubSub} from "@google-cloud/pubsub";
import * as sendgrid from "@sendgrid/mail";
import * as voucher from "voucher-code-generator";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import {firestore} from "firebase-admin";
import * as cors from "cors";
// import fetch from "node-fetch";

// initializeApp() is not needed in Cloud Functions for Firebase
initializeApp({
  credential: applicationDefault(),
});

const topicName = process.env.PUBSUB_TOPIC_NAME || "shopify-sample-topic";
const sgAPIKey = process.env.SENDGRID_API_KEY || "SG.xxx";

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

const generateRedeemCode = () => {
  return voucher.generate({
    pattern: "####-####-####",
    count: 1,
    charset: "0123456789123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  })[0];
};

type Item = {
  name: string;
  redeem: string;
}

export const helloPubSub = functions.pubsub.topic(topicName).onPublish(async (message) => {
  console.log("Hello PubSub!");
  console.log(JSON.stringify(message.json));
  console.log(JSON.stringify(message.json.line_items));
  const orders = {
    email: message.json.email,
    name: message.json.name,
    items: message.json.line_items.map((item: any): Item => {
      return {
        name: item.name,
        redeem: generateRedeemCode(),
      };
    }),
  };
  await firestore().collection("orders").add(orders);
  sendgrid.setApiKey(sgAPIKey);
  const mailOptions = {
    from: process.env.SENDGRID_SENDER_EMAIL || "",
    to: orders.email,
    subject: `Order ${orders.name} redeem codes`,
    html: `<p style="font-size: 16px;">Redeem Codes</p><br />
${orders.items.map((item: Item) => {
    return `<p>${item.name}: ${item.redeem}</p>`;
  }).join("\n").toString()}
`,
  };
  const send = await sendgrid.send(mailOptions);
  return send.toString();
});

export const pubsubHelper = functions.https.onRequest(async (request, response) => {
  console.log("pubsubHelper");
  // 1. make sure the function can't be used in production
  if (!process.env.PUBSUB_EMULATOR_HOST) {
    functions.logger
        .error("This function should only run locally in an emulator.");
    response.status(400).end();
  }

  const email = request.body.email;
  const name = request.body.name;
  const items = request.body.items;

  const pubsub = new PubSub();

  // 2. make sure the test topic exists and
  // if it doesn't then create it.
  const [topics] = await pubsub.getTopics();

  // topic.name is of format 'projects/PROJECT_ID/topics/test-topic',
  const testTopic = topics.filter(
      (topic) => topic.name.includes(topicName)
  )?.[0];
  if (!testTopic) await pubsub.createTopic(topicName);

  // 3. publish to test topic and get message ID
  const messageID = await pubsub.topic(topicName).publishMessage({
    json: {email: email, name: name, line_items: items},
  });

  // 4. send back a helpful message
  response.status(201).send(
      {success: "Published to pubsub test-topic -- message ID: ", messageID}
  );
});

// export const discordOAuth = functions.https.onRequest(async (request, response) => {
//   const code = request.query.code;
//   if (!code || typeof code !== "string") {
//     response.status(500).send("Invalid parameter of code").end();
//     return;
//   }
//   const params = new URLSearchParams();
//   params.append("client_id", process.env.DISCORD_OAUTH_CLIENT_ID || "discord_oauth_client_id");
//   params.append("client_secret", process.env.DISCORD_OAUTH_CLIENT_SECRET || "discord_oauth_client_secret");
//   params.append("grant_type", "authorization_code");
//   params.append("code", code);
//   params.append("redirect_uri", process.env.DISCORD_OAUTH_CLIENT_REDIRECT_URI || "http://localhost:3000/authed");
//   params.append("scope", "identify");
//   const tokenResponse: any = await (await fetch("https://discordapp.com/api/oauth2/token", {
//     method: "POST",
//     body: params,
//     headers: {
//       "Content-type": "application/x-www-form-urlencoded",
//     },
//   })).json();
//   if (tokenResponse.error) {
//     response.status(500).send( "Can't get token").end();
//     return;
//   }
//   const accessToken = tokenResponse.access_token;
//   const userdata: any = await (await fetch("https://discordapp.com/api/users/@me", {
//     headers: {
//       "Authorization": `Bearer ${accessToken}`,
//     },
//   })).json();
//   if (userdata.code == 0) {
//     response.status(500).send("Can't get userdata").end();
//     return;
//   }
//   response.status(200).send(userdata).end();
// });

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
  console.log(redeem);
  if (!redeem) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with redeem.");
  }
  const orders = await firestore().collection("orders").where("email", "==", email).get();
  if (orders.empty) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have orders.");
  }
  // loop orders
  for (const order of orders.docs) {
    const items = order.data().items;
    if (!items) {
      continue;
    }
    const item = items.filter((item: Item) => item.redeem === redeem)[0];
    if (item) {
      await firestore().collection("users").doc(context.auth.uid).collection("nft").doc(item.redeem).set({
        name: item.name,
        type: "tobira-neko",
      });
      return item.name;
    }
  }
  throw new functions.https.HttpsError("not-found", "The redeem code is invalid.");
});
