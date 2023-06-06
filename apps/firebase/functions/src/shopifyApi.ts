import * as functions from "firebase-functions";
import * as cors from "cors";

export const background = functions.https.onRequest((request, response) => {
  // functions.logger.info("Hello logs!", {structuredData: true});
  const corsHandler = cors({origin: true});
  corsHandler(request, response, () => {
    const resData = {
      data: {
        v1: "111,000",
        v2: "367872",
        v3: "306",
      },
    };
    response.status(200).json(resData);
  });
});
