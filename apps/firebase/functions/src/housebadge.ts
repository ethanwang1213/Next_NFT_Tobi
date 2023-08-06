import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import * as cors from "cors";
import {REGION} from "./lib/constants";

export const metadata = functions.region(REGION).https.onRequest(async (request, response) => {
  const corsHandler = cors({origin: true});
  const id = request.path.match(/\/metadata\/(\d{1,5})/);
  if (id && id.length > 0) {
    const housebadge = await firestore().collection("housebadge").doc(`${id[1]}`).get();
    if (housebadge.exists) {
      corsHandler(request, response, () => {
        const resData = {
          data: housebadge.data(),
        };
        response.status(200).json(resData);
      });
      return;
    }
  }
  corsHandler(request, response, () => {
    response.status(404).send("Not Found");
  });
});
