import * as functions from "firebase-functions";
import * as cors from "cors";
import {REGION} from "../lib/constants";

// TODO: connect to Cloud SQL
// docs:
// https://cloud.google.com/sql/docs/postgres/connect-functions?hl=ja

// TODO: define data models

// API Reference:
// https://docs.google.com/spreadsheets/d/1XocLkxnpYL2Mfi-e7LuJOlmf_Njdgaz-0RfgqRxqtiE/edit#gid=0
export const accounts = functions.region(REGION).https.onRequest((request, response) => {
  const corsHandler = cors({origin: true});
  corsHandler(request, response, () => {
    // This is a dummy response.
    const resData = {
      accounts: [
        {
          userId: "xxx",
          username: "xxx",
          icon: "xxx",
          sns: "xxx",
          createdAt: "xxx",
        },
        {
          userId: "xxx",
          username: "xxx",
          icon: "xxx",
          sns: "xxx",
          createdAt: "xxx",
        },
      ],
    };
    response.status(200).json(resData);
  });
});
