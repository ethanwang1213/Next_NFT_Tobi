import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import * as sendgrid from "@sendgrid/mail";
import fetch from "node-fetch";
import {Item, generateRedeemCode} from "./lib/nft";
import {REGION, TOPIC_NAMES, MAIL_HEAD, MAIL_FOOT, SLACK_WEBHOOK_URL_FOR_ORDERS_CREATE} from "./lib/constants";

const sgAPIKey = process.env.SENDGRID_API_KEY || "SG.xxx";

/**
  * Shopify Orders Paid PubSub
  * https://shopify.dev/docs/api/admin-graphql/2023-04/enums/WebhookSubscriptionTopic
  */
exports.handleOrdersPaid = functions.region(REGION).pubsub.topic(TOPIC_NAMES["ordersPaid"]).onPublish(async (message) => {
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
    bcc: process.env.SENDGRID_SENDER_EMAIL || "",
    subject: `【引き換えコード】注文番号：${order.name}`,
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
  await orderRef.update({
    mail_sent: "done",
  });
  return send.toString();
});

/**
  * Shopify Orders Create PubSub
  * https://shopify.dev/docs/api/admin-graphql/2023-04/enums/WebhookSubscriptionTopic
  */
exports.handleOrdersCreate = functions.region(REGION).pubsub.topic(TOPIC_NAMES["ordersCreate"]).onPublish(async (message) => {
  console.log(JSON.stringify(message.json));
  console.log(JSON.stringify(message.json.line_items));

  const isCrypto = message.json.payment_gateway_names == "暗号資産";
  const payment = {
    email: message.json.email || "",
    name: message.json.name || "",
    total_price: message.json.total_price || "",
    currency: message.json.currency || "",
    billing_address: {
      name: message.json.billing_address?.name || "",
    },
    items: message.json.line_items.map((item: any): Item => {
      return {
        name: item.name || "",
        price: item.price || "",
        quantity: item.quantity || "",
      };
    }),
    payment_gateway_names: message.json.payment_gateway_names || "",
    status: isCrypto ? "pending" : "paid",
  };
  const slackMessage = `
以下の注文を確認しました。

注文番号：${payment.name}
注文者メールアドレス：${payment.email}
注文者名：${payment.billing_address.name}
合計金額：${payment.total_price} ${payment.currency}
購入方法：${payment.payment_gateway_names}

購入アイテム:
${payment.items.map((item: Item, index: number) => {
    return ` ${index + 1}. ${item.name}: ${item.price} ${payment.currency} x ${item.quantity}`;
  }).join("\n").toString()}
`;
  // console.log(slackMessage);
  try {
    if (SLACK_WEBHOOK_URL_FOR_ORDERS_CREATE) {
      const slack = await fetch(SLACK_WEBHOOK_URL_FOR_ORDERS_CREATE, {
        method: "POST",
        body: JSON.stringify({
          username: "shopify",
          text: slackMessage,
          icon_emoji: ":shopping_trolley:",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(slack);
    }
  } catch (error) {
    console.error(error);
  }
  if (isCrypto) {
    await firestore().collection("payments").add(payment);
  }
  return;
});
