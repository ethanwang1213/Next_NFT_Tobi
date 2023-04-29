import * as functions from "firebase-functions";
import {initializeApp, applicationDefault} from "firebase-admin/app";

// initializeApp() is not needed in Cloud Functions for Firebase
initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});

export const background = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  const resData = {
    data: {
      v1: "111,000",
      v2: "367872",
      v3: "306",
    },
  };
  response.status(200).json(resData);
});
