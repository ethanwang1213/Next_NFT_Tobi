// メール送信に失敗したユーザを抽出して、再度メールを送るアドホックコードです

import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import {Item} from "../src/lib/nft";
import * as sendgrid from "@sendgrid/mail";

import {MAIL_HEAD, MAIL_FOOT} from "../src/lib/constants";
const sgAPIKey = "SG.";
sendgrid.setApiKey(sgAPIKey);

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = getFirestore();

const sendMail = async (order: any, items: any[]) => {
  const mailOptions = {
    from: "Tobiratory <system@tobiratory.com>",
    to: order.email,
    bcc: "Tobiratory <system@tobiratory.com>",
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
  return send.toString();
  // return mailOptions;
};

const now = "2023-06-25 21:31:00"; // 手動で送ったもののフラグ

const getData = async () => {
  const ref = db.collection("orders");
  ref.get().then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.mail_sent == now || data.mail_sent == "done") {
        return;
      }
      const order = {
        id: doc.id,
        email: data.email,
        name: data.name,
      };
      doc.ref.collection("items").get().then(async (snapshot) => {
        const items = snapshot.docs.map((doc) => {
          return doc.data();
        }).filter((data2) => {
          return typeof data2.used_at === "undefined";
        }).map((data2) => {
          return {
            name: data2.name,
            redeem: data2.redeem,
          };
        });
        if (items.length > 0) {
          const res = await sendMail(order, items);
          doc.ref.update({
            mail_sent: now,
          });
          console.log(res, order, items);
          // console.log(order, items);
        }
      });
    });
  });
};

const main = async () => {
  await getData();
  // const order = {
  //   id: "4GkBZL5P1lPmyNxTP7ey",
  //   email: "knagato@tobiratory.com",
  //   name: "#1022",
  // };
  // const items = [{name: "TOBIRA NEKO #00004 [test]", redeem: "i8a5-fkcD-fiMx"}];
  // const res = await sendMail(order, items);
  // console.log(res, order, items);
};

main();
