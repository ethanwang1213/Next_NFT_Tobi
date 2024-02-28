import {initializeApp, applicationDefault} from "firebase-admin/app";
import {firestore} from "firebase-admin";
import {background} from "./shopifyApi";
import {discordOAuth} from "./discord";
import {discordUserNfts} from "./discordUserNfts";
import {metadata} from "./tobiraneko";
import {metadata as houseBadgeMetadata} from "./housebadge";
import {mintFes23NftTaskv1} from "./mintFes23NftTask";
import {createFlowAccountDemo} from "./createFlowAccount";
import {native} from "./native";
import {pushDemo} from "./appSendPushMessage";
import {flowTxSend} from "./flowTxSend";
import {flowTxMonitor} from "./flowTxMonitor";
import {taskWrapperLink} from "./taskWrapperLink";

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
exports.mintFes23NftTaskv1 = mintFes23NftTaskv1;
exports.flowTxSend = flowTxSend;
exports.flowTxMonitor = flowTxMonitor;
exports.native = native;
exports.taskWrapperLink = taskWrapperLink;

if (process.env.PUBSUB_EMULATOR_HOST) {
  exports.devtool = require("./devtool");
  exports.kmsSample = require("./kmsSample");
  exports.pushDemo = pushDemo;
  exports.createFlowAccountDemo = createFlowAccountDemo;
}
