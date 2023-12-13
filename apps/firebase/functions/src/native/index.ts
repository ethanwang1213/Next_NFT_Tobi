import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import {REGION} from "../lib/constants";

import {getAccounts, getAccountById} from "./accountController";
import {signUp, signIn, getMyProfile, postMyProfile} from "./userController";
import { getContentById, getContents } from "./contentController";
import { getItems, getItemsById } from "./itemController";
import { getSaidans, getSaidansById } from "./saidanController";

const app = express();
app.use(cors({origin: true}));

const dummyResponse = (_: express.Request, res: express.Response) => {
  res.status(200).send("under construction");
};

// TODO: connect to Cloud SQL
// docs:
// https://cloud.google.com/sql/docs/postgres/connect-functions?hl=ja

// TODO: define data models

// API Reference:
// https://docs.google.com/spreadsheets/d/1XocLkxnpYL2Mfi-e7LuJOlmf_Njdgaz-0RfgqRxqtiE/edit#gid=0
app.post("/signup", signUp);
app.post("/signin", signIn);

app.get("/accounts", getAccounts);
app.get("/accounts/:id", getAccountById);

app.get("/contents", getContents);
app.get("/contents/:id", getContentById);

app.get("/items", getItems);
app.get("/items/:id", getItemsById);
app.get("/nfts/:id", dummyResponse);

app.get("/saidans", getSaidans);
app.get("/saidans/:id", getSaidansById);
app.post("/saidans/:id", dummyResponse);
app.get("/posts", dummyResponse);
app.get("/posts/:id", dummyResponse);

app.get("/my/profile", getMyProfile);
app.post("/my/profile", postMyProfile);
app.post("/my/business/submission", dummyResponse);
app.get("/my/business", dummyResponse);
app.post("/my/business", dummyResponse);

app.get("/my/inventory", dummyResponse);
app.post("/my/inventory", dummyResponse);
app.post("/my/inventory/folders", dummyResponse);
app.get("/my/inventory/folders/:id", dummyResponse);
app.delete("/my/inventory/folders/:id", dummyResponse);

app.get("/my/nfts/:id", dummyResponse);
app.post("/my/contents", dummyResponse);
app.get("/my/contents/:id", dummyResponse);
app.post("/my/contents/:id", dummyResponse);
app.get("/my/items", dummyResponse);
app.post("/my/items", dummyResponse);
app.get("/my/items/:id", dummyResponse);

app.get("/my/saidans", dummyResponse);
app.get("/my/saidans/:saidanId", dummyResponse);
app.post("/my/saidans/:saidanId/posts", dummyResponse);
app.get("/my/saidans/:saidanId/posts/:postId", dummyResponse);

app.post("/accounts/:userId/report", dummyResponse);
app.post("/items/:id/report", dummyResponse);
app.post("/posts/:id/report", dummyResponse);

app.post("/contents/:id/favorite", dummyResponse);
app.post("/saidans/:id/like", dummyResponse);
app.post("/saidans/:id/save", dummyResponse);
app.post("/saidans/:id/share", dummyResponse);
app.post("/saidans/:id/notinterested", dummyResponse);

app.post("/posts/:id/like", dummyResponse);
app.post("/posts/:id/save", dummyResponse);
app.post("/posts/:id/share", dummyResponse);
app.post("/posts/:id/notinterested", dummyResponse);

app.post("/my/items/:id/sale", dummyResponse);
app.post("/my/nfts/:id/listing", dummyResponse);
app.post("/items/:id/mint", dummyResponse);
app.post("/nfts/:id/purchase", dummyResponse);
app.post("/my/nfts/:id/gift", dummyResponse);

export const native = functions.region(REGION).https.onRequest(app);
