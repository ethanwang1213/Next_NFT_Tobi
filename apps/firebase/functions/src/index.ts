import * as functions from "firebase-functions";
import {PubSub} from "@google-cloud/pubsub";
import * as sendgrid from "@sendgrid/mail";
import * as voucher from "voucher-code-generator";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import {firestore} from "firebase-admin";

// initializeApp() is not needed in Cloud Functions for Firebase
initializeApp({
  credential: applicationDefault(),
});

const topicName = process.env.PUBSUB_TOPIC_NAME || "shopify-sample-topic";
const sgAPIKey = process.env.SENDGRID_API_KEY || "SG.xxx";

export const background = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  const resData = {
    data: {
      v1: "111,000",
      v2: "367872",
      v3: "306",
    },
  };
  response.status(200).json(resData);
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
    json: {email: email, name: name, line_items: [
      {name: "TOBIRA NEKO #3"},
      {name: "TOBIRA NEKO #4"},
    ]},
  });

  // 4. send back a helpful message
  response.status(201).send(
      {success: "Published to pubsub test-topic -- message ID: ", messageID}
  );
});
