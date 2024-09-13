import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import * as sendgrid from "@sendgrid/mail";
import {v4 as uuidv4} from "uuid";
import {parseNftByName} from "./lib/nft";
import {REGION, REDEEM_LINK_CODE_EXPIRATION_TIME, SITE_HOST} from "./lib/constants";
import {Timestamp} from "firebase-admin/firestore";

type EmailExpiration = {
  email: string;
  expireAt: Timestamp;
}

exports.checkRedeem = functions.region(REGION).https.onCall(async (data, context) => {
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
  const redeemEmails = (await getRedeemEmails(context.auth.uid)) ?? {};
  const emails = [email, ...Object.keys(redeemEmails).filter((key) => redeemEmails[key])];
  const redeem = data.redeem;
  if (!redeem) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with redeem.");
  }
  const orders = await firestore().collection("orders").where("email", "in", emails).get();
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
      await firestore().collection("users").doc(context.auth.uid).collection("nft").doc(nft.type).set({
        updated_at: new Date(),
      });
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

exports.getPayments = functions.region(REGION).https.onCall(async (data, context) => {
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

exports.validateRedeemEmailLink = functions.region(REGION).https.onCall(async (data: {linkCode: string}, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const linkCode = data.linkCode;
  if (!linkCode) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with link code.");
  }
  const uid = context.auth.uid;
  const linkCodes = await getRedeemLinkCodes(uid);
  if (!linkCodes) {
    throw new functions.https.HttpsError("not-found", "Link code data doesn't exist.");
  }
  const redeemEmailData = linkCodes[linkCode];
  if (!redeemEmailData) {
    throw new functions.https.HttpsError("not-found", "The redeem email data doesn't exist.");
  }
  const redeemEmail = redeemEmailData.email;
  if (!redeemEmail) {
    throw new functions.https.HttpsError("not-found", "The redeem email doesn't exist.");
  }
  const expireAt = redeemEmailData.expireAt;
  if (!expireAt) {
    throw new functions.https.HttpsError("not-found", "expireAt doesn't exist.");
  }
  if (expireAt.toDate() < new Date()) {
    throw new functions.https.HttpsError("out-of-range", "The redeem email link is expired.");
  }

  // Because the link code is valid, we will enable email address.
  const redeemEmails = await getRedeemEmails(uid);
  if (!redeemEmails) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have redeem emails.");
  }
  if (!(redeemEmail in redeemEmails)) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have redeem email.");
  }
  if (redeemEmails[redeemEmail]) {
    throw new functions.https.HttpsError("already-exists", "The redeem email is already validated.");
  }
  redeemEmails[redeemEmail] = true;
  await getRedeemEmailsCollection().doc(uid).set({redeemEmails});
  return true;
});

exports.sendConfirmationRedeemEmail = functions.region(REGION).https.onCall(async (data: {email: string}, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with email.");
  }
  const uid = context.auth.uid;
  await addRedeemEmail(uid, email);
  const linkCode = await addRedeemLinkCode(uid, email);
  const sgAPIKey = process.env.SENDGRID_API_KEY || "SG.xxx";
  sendgrid.setApiKey(sgAPIKey);
  const link = `${SITE_HOST}?redeemLinkCode=${linkCode}`;
  const mailOptions = {
    from: process.env.SENDGRID_SENDER_EMAIL || "",
    to: email,
    bcc: process.env.SENDGRID_SENDER_EMAIL || "",
    subject: "メールアドレスの確認",
    text: `このメールアドレスでTOBIRA NEKOを受け取る場合は、こちらのリンクをクリックしてください。
${link}`,
  };
  const response = await sendgrid.send(mailOptions)
      .catch((error) => {
        throw new functions.https.HttpsError("unknown", "Email Sending Error: ", error);
      });
  return response[0].statusCode;
});

exports.removeRedeemEmail = functions.region(REGION).https.onCall(async (data: {email: string}, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with email.");
  }
  const uid = context.auth.uid;
  const redeemEmails = await getRedeemEmails(uid);
  if (!redeemEmails) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have redeem emails.");
  }
  if (!(email in redeemEmails)) {
    throw new functions.https.HttpsError("not-found", "The user doesn't have redeem email.");
  }
  delete redeemEmails[email];
  await getRedeemEmailsCollection().doc(uid).set({redeemEmails});
  return true;
});

exports.getRedeemEmails = functions.region(REGION).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const uid = context.auth.uid;
  return await getRedeemEmails(uid);
});

/*
 * structure of redeemLinkCodes collection
 * redeemLinkCodes > uid > {linkCodes: {hash1: {email: "foo@bar.com", expireAt: timestamp-value}, hash2: ...}}
 */
const getRedeemLinkCodes = async (uid: string): Promise<Record<string, EmailExpiration> | null> => {
  const redeemLinkCodesDoc = await getRedeemLinkCodesCollection().doc(uid).get();
  if (!redeemLinkCodesDoc.exists) {
    return null;
  }
  const redeemLinkCodes = redeemLinkCodesDoc.data();
  if (!redeemLinkCodes || !redeemLinkCodes.linkCodes) {
    return null;
  }
  return redeemLinkCodes.linkCodes;
};

/*
 * structure of redeemEmails field
 * redeemEmails > uid > {redeemEmails: {"foo@bar.com": true, "foo2@bar.com": false, ...}}
 */
const getRedeemEmails = async (uid: string):Promise<Record<string, boolean> | null> => {
  const redeemEmailsDoc = await getRedeemEmailsCollection().doc(uid).get();
  if (!redeemEmailsDoc.exists) {
    return null;
  }
  const redeemEmails = redeemEmailsDoc.data();
  if (!redeemEmails || !redeemEmails.redeemEmails) {
    return null;
  }
  return redeemEmails.redeemEmails;
};

const addRedeemEmail = async (uid: string, email: string) => {
  let redeemEmails = await getRedeemEmails(uid);
  if (redeemEmails === null) {
    redeemEmails = {};
  }
  // Since there might be cases where a confirmation email is resent,
  // trigger an error only if it has already been validated.
  if (redeemEmails[email]) {
    throw new functions.https.HttpsError("already-exists", "The redeem email is already added.");
  }
  redeemEmails[email] = false;
  await getRedeemEmailsCollection().doc(uid).set({redeemEmails});
  return;
};

const addRedeemLinkCode = async (uid: string, email: string) => {
  const linkCode = uuidv4();
  let linkCodes = await getRedeemLinkCodes(uid);
  if (linkCodes === null) {
    linkCodes = {};
  }
  linkCodes[linkCode] = {email, expireAt: Timestamp.fromDate(new Date(Date.now() + REDEEM_LINK_CODE_EXPIRATION_TIME))};
  await getRedeemLinkCodesCollection().doc(uid).set({linkCodes});
  return linkCode;
};

const getRedeemLinkCodesCollection = () => {
  return firestore().collection("redeemLinkCodes");
};

const getRedeemEmailsCollection = () => {
  return firestore().collection("redeemEmails");
};
