import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {REGION} from "./lib/constants";

export const discordUserNfts = functions.region(REGION).https.onRequest(async (request, response) => {
  const discordId = request.query.discordId;
  if (discordId == null || !discordId || typeof discordId !== "string") {
    const errorResponse = {
      status: 400,
      content: "query parameter 'discordId' does not exist",
    };
    response.status(400).json(JSON.stringify(errorResponse));
    return;
  }
  const encodeDiscordId = encodeURIComponent(discordId);
  const indexUser = await firestore().collection("index").doc("users").collection("discord").doc(encodeDiscordId).get();
  if (indexUser.exists) {
    const user = indexUser.data();
    if (!user) {
      const errorResponse = {
        status: 404,
        content: "Unable to see the Tobiratory account associated with your Discord account1",
      };
      response.status(404).json(JSON.stringify(errorResponse));
      return;
    }
    const tobiratoryUserId = user.userId;
    const userData = await firestore().collection("users").doc(tobiratoryUserId).get();
    if (userData.exists) {
      const nftData = userData.data()?.nft;
      const successResponse = {
        status: 200,
        nft: nftData,
      };
      const nftJson = JSON.stringify(successResponse);
      response.status(200).json(nftJson);
    } else {
      const errorResponse = {
        status: 404,
        content: "Unable to see the Tobiratory account associated with your Discord account2",
      };
      response.status(404).json(JSON.stringify(errorResponse));
    }
  } else {
    const errorResponse = {
      status: 404,
      content: "Unable to see the Tobiratory account associated with your Discord account3",
    };
    response.status(404).json(JSON.stringify(errorResponse));
  }
});
