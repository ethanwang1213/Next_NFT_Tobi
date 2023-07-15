import * as functions from "firebase-functions";
import fetch from "node-fetch";
import {REGION} from "./lib/constants";
import {auth} from "firebase-admin";

export const discordOAuth = functions.region(REGION).https.onRequest(async (request, response) => {
  // check authorization
  if (!request.headers.authorization) {
    response.status(401).send("Unauthorized request").end();
    return;
  }
  const decodedToken = await auth().verifyIdToken(request.headers.authorization);
  if (!decodedToken) {
    response.status(401).send("Unauthorized request").end();
    return;
  }

  const code = request.query.code;
  if (!code || typeof code !== "string") {
    response.status(500).send("Invalid parameter of code").end();
    return;
  }
  const params = new URLSearchParams();
  params.append("client_id", process.env.DISCORD_OAUTH_CLIENT_ID || "discord_oauth_client_id");
  params.append("client_secret", process.env.DISCORD_OAUTH_CLIENT_SECRET || "discord_oauth_client_secret");
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.DISCORD_OAUTH_CLIENT_REDIRECT_URI || "http://localhost:3000/authed");
  params.append("scope", "identify");
  const tokenResponse: any = await (await fetch("https://discordapp.com/api/oauth2/token", {
    method: "POST",
    body: params,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
  })).json();
  if (tokenResponse.error) {
    response.status(500).send("An error occurred while retrieving the token.").end();
    return;
  }
  const accessToken = tokenResponse.access_token;
  const userdata: any = await (await fetch("https://discordapp.com/api/users/@me", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  })).json();
  if (userdata.code == 0) {
    response.status(500).send("An error occurred while retrieving user data.").end();
    return;
  }
  response.status(200).send(userdata).end();
});
