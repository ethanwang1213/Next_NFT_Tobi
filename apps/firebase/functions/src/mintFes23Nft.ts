import * as functions from "firebase-functions";
import {REGION} from "./lib/constants";
import {getFunctions} from "firebase-admin/functions";
import {GoogleAuth} from "google-auth-library";

export const mintFes23Nft = functions.region(REGION).https.onRequest(async (request, response) => {
  const queue = getFunctions().taskQueue("testTaskFunction");
  const targetUri = await getFunctionUrl("testTaskFunction");

  await queue.enqueue({value: "test"}, {
    dispatchDeadlineSeconds: 60 * 5,
    uri: targetUri,
  });
  response.sendStatus(200);
});

let auth: GoogleAuth<any>;

const getFunctionUrl = async (name: string, location="us-central1") => {
  if (!auth) {
    auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
  }
  const projectId = await auth.getProjectId();
  const url = "https://cloudfunctions.googleapis.com/v2beta/" +
    `projects/${projectId}/locations/${location}/functions/${name}`;

  const client = await auth.getClient();
  const res = await client.request({url});
  const uri = res.data?.serviceConfig?.uri;
  if (!uri) {
    throw new Error(`Unable to retreive uri for function at ${url}`);
  }
  return uri as string;
};
