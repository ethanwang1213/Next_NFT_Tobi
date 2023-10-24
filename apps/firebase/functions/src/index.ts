import {initializeApp, applicationDefault} from "firebase-admin/app";
import {firestore} from "firebase-admin";
import {background} from "./shopifyApi";
import {discordOAuth} from "./discord";
import {discordUserNfts} from "./discordUserNfts";
import {metadata} from "./tobiraneko";
import {metadata as houseBadgeMetadata} from "./housebadge";
import {mintFes23NftTask} from "./mintFes23NftTask";

// initializeApp() is not needed in Cloud Functions for Firebase
initializeApp({
  credential: applicationDefault(),
});
firestore().settings({ignoreUndefinedProperties: true});

exports.shopifyOrders = require("./shopifyOrders");
exports.journalNfts = require("./journalNfts");
exports.background = background;
exports.discordOAuth = discordOAuth;
exports.discordUserNfts = discordUserNfts;
exports.tobiraneko = metadata;
exports.housebadge = houseBadgeMetadata;
exports.stampRallyBadge = require("./journalStampRallyBadge");
// debug stamprally
exports.stampRallyBadgeForDebug = require("./journalStampRallyBadgeForDebug");
// end debug stamprally
exports.mintFes23NftTask = mintFes23NftTask;

if (process.env.PUBSUB_EMULATOR_HOST) {
  exports.devtool = require("./devtool");
}
