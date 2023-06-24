import {initializeApp, applicationDefault} from "firebase-admin/app";
import {background} from "./shopifyApi";
import {discordOAuth} from "./discord";
import {discordUserNfts} from "./discordUserNfts";
import {metadata} from "./tobiraneko";

// initializeApp() is not needed in Cloud Functions for Firebase
initializeApp({
  credential: applicationDefault(),
});

exports.shopifyOrders = require("./shopifyOrders");
exports.journalNfts = require("./journalNfts");
exports.background = background;
exports.discordOAuth = discordOAuth;
exports.discordUserNfts = discordUserNfts;
exports.tobiraneko = metadata;

if (process.env.PUBSUB_EMULATOR_HOST) {
  exports.devtool = require("./devtool");
}
