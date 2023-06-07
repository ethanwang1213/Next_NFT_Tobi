import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import * as sendgrid from "@sendgrid/mail";
import {Item, generateRedeemCode} from "./lib/nft";
import {TOPIC_NAMES, MAIL_HEAD, MAIL_FOOT} from "./lib/constants";

const sgAPIKey = process.env.SENDGRID_API_KEY || "SG.xxx";

/**
  * Shopify Orders Paid PubSub
  * https://shopify.dev/docs/api/admin-graphql/2023-04/enums/WebhookSubscriptionTopic
  */
exports.handleOrdersPaid = functions.pubsub.topic(TOPIC_NAMES["ordersPaid"]).onPublish(async (message) => {
  console.log(JSON.stringify(message.json));
  console.log(JSON.stringify(message.json.line_items));
  const order = {
    email: message.json.email,
    name: message.json.name,
  };
  const items = message.json.line_items.map((item: any): Item => {
    return {
      name: item.name,
      redeem: generateRedeemCode(),
    };
  });
  const orderRef = await firestore().collection("orders").add(order);
  for (const item of items) {
    await orderRef.collection("items").add(item);
  }
  sendgrid.setApiKey(sgAPIKey);
  const mailOptions = {
    from: process.env.SENDGRID_SENDER_EMAIL || "",
    to: order.email,
    subject: `Order ${order.name} redeem codes`,
    html: `${MAIL_HEAD}
${items.map((item: Item) => {
    return `
    <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 32.4px;"><span style="font-size:18px;">${item.name}</span></p>
    <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 32.4px;"><span style="font-size:18px;">${item.redeem}</span></p>
  `;
  }).join("<p style='margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 25.2px;'></p>").toString()}
${MAIL_FOOT}
`,
  };
  const send = await sendgrid.send(mailOptions);
  return send.toString();
});

/**
  * Shopify Orders Create PubSub
  * https://shopify.dev/docs/api/admin-graphql/2023-04/enums/WebhookSubscriptionTopic
  */
exports.handleOrdersCreate = functions.pubsub.topic(TOPIC_NAMES["ordersCreate"]).onPublish(async (message) => {
  console.log(JSON.stringify(message.json));
  console.log(JSON.stringify(message.json.line_items));
  if (message.json.payment_gateway_names != "暗号資産") {
    return;
  }
  const payment = {
    email: message.json.email,
    name: message.json.name,
    total_price: message.json.total_price,
    items: message.json.line_items.map((item: any): Item => {
      return {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      };
    }),
    status: "pending",
  };
  await firestore().collection("payments").add(payment);
  return;
});
