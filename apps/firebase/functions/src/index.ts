import {initializeApp, applicationDefault} from "firebase-admin/app";
import {firestore} from "firebase-admin";
import {background} from "./shopifyApi";
import {discordOAuth} from "./discord";
import {discordUserNfts} from "./discordUserNfts";
import {metadata} from "./tobiraneko";
import {metadata as houseBadgeMetadata} from "./housebadge";
import {metadata as journalStampRallyMetadata} from "./journalStampRally/metadata";
import {mintJournalStampRallyNftTask} from "./journalStampRally/mintNftTask";
import {createFlowAccountDemo} from "./createFlowAccount";
import {native} from "./native";
import {pushDemo} from "./appSendPushMessage";
import {flowTxSend} from "./flowTxSend";
import {flowTxMonitor} from "./flowTxMonitor";
import {taskWrapperLink} from "./taskWrapperLink";
import {tobiratoryCms} from "./cms";
import {cronForNative} from "./native/nativeCron";
import {fetchNFTOwnershipHistory} from "./fetchNFTOwnershipHistory";

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
exports.journalStampRally = require("./journalStampRally/tpfw2024");
exports.journalStampRallyMetadata = journalStampRallyMetadata;
exports.mintJournalStampRallyNftTask = mintJournalStampRallyNftTask;
exports.flowTxSend = flowTxSend;
exports.flowTxMonitor = flowTxMonitor;
exports.native = native;
exports.taskWrapperLink = taskWrapperLink;
exports.tobiratoryCms = tobiratoryCms;
exports.cronForNative = cronForNative;
exports.fetchNFTOwnershipHistory = fetchNFTOwnershipHistory;

if (process.env.PUBSUB_EMULATOR_HOST) {
  exports.devtool = require("./devtool");
  exports.kmsSample = require("./kmsSample");
  exports.pushDemo = pushDemo;
  exports.createFlowAccountDemo = createFlowAccountDemo;
}
