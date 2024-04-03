import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import {REGION} from "../lib/constants";

import {getAccounts, getAccountById} from "./accountController";
import
{
  signUp,
  getMyProfile,
  postMyProfile,
  createFlowAcc,
  myBusiness,
  updateMyBusiness,
  businessSubmission,
  checkExistBusinessAcc,
  checkPasswordSet,
} from "./userController";
import {getContentById, getContents} from "./contentController";
import {createModel, createDigitalItem, deleteDigitalItem, getItems, getItemsById, getMyItems, getMyItemsById, getMyDigitalItems} from "./itemController";
import {
  createSaidan,
  decorationSaidan,
  favoriteSaidan,
  getMySaidans,
  getMySaidansById,
  getSaidanDecorationData,
  getSaidanTemplates,
  getSaidans,
  getSaidansById,
  putAwayItemInSaidan,
  updateMySaidan,
} from "./saidanController";
import {getMaterial, removeMaterials, uploadMaterial} from "./fileController";
import {makeBox, getBoxData, deleteBoxData, getInventoryData, permissionGift, openNFT, userInfoFromAddress, moveNFT, deleteNFT} from "./boxController";
import {mintNFT} from "./nftController";
import { decorationWorkspace, getWorkspaceDecorationData } from "./workspaceController";
// import {fileMulter, uploadMaterial} from "./fileController";

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
app.post("/password-set", checkPasswordSet);
app.post("/create-flow", createFlowAcc);

app.get("/accounts", getAccounts);
app.get("/accounts/:uid", getAccountById);

app.get("/contents", getContents);
app.get("/contents/:id", getContentById);

app.get("/items", getItems);
app.get("/items/:id", getItemsById);
app.get("/nfts/:id", dummyResponse);

app.get("/saidans", getSaidans);
app.get("/saidans/:id", getSaidansById);
app.get("/posts", dummyResponse);
app.get("/posts/:id", dummyResponse);

app.get("/my/profile", getMyProfile);
app.post("/my/profile", postMyProfile);
app.post("/my/business/submission", businessSubmission);
app.post("/my/business/checkexist", checkExistBusinessAcc);
app.get("/my/business", myBusiness);
app.post("/my/business", updateMyBusiness);

app.get("/my/inventory", getInventoryData);
app.post("/my/inventory", dummyResponse);
app.post("/my/inventory/box", makeBox);
app.get("/my/inventory/box/:id", getBoxData);
app.delete("/my/inventory/box/:id", deleteBoxData);
app.post("/my/inventory/gift-permission", permissionGift);

app.get("/my/nfts/:id", dummyResponse);
app.post("/my/contents", dummyResponse);
app.get("/my/contents/:id", dummyResponse);
app.post("/my/contents/:id", dummyResponse);
app.get("/my/items", getMyItems);
app.get("/my/items/:id", getMyItemsById);
app.post("/my/samples", createDigitalItem);
app.get("/my/samples", getMyDigitalItems);
app.get("/my/samples/:id");
app.delete("/my/samples/:id", deleteDigitalItem);

app.post("/model/create", createModel);

app.get("/my/saidans", getMySaidans);
app.post("/my/saidans", createSaidan);
app.post("/my/saidans/:saidanId/update", updateMySaidan);
app.get("/my/saidans/:saidanId/decoration", getSaidanDecorationData);
app.post("/my/saidans/:saidanId/decoration", decorationSaidan);
app.get("/my/saidans/:saidanId/workspace", getWorkspaceDecorationData);
app.post("/my/saidans/:saidanId/workspace", decorationWorkspace);
app.post("/my/saidans/:saidanId/putaway", putAwayItemInSaidan);
app.get("/my/saidans/:saidanId", getMySaidansById);
app.post("/my/saidans/:saidanId/posts", dummyResponse);
app.get("/my/saidans/:saidanId/posts/:postId", dummyResponse);

app.post("/accounts/:userId/report", dummyResponse);
app.post("/items/:id/report", dummyResponse);
app.post("/posts/:id/report", dummyResponse);

app.post("/contents/:id/favorite", dummyResponse);
app.get("/saidan/templates", getSaidanTemplates);
app.post("/saidans/:id/favorite", favoriteSaidan);
app.post("/saidans/:id/like", dummyResponse);
app.post("/saidans/:id/save", dummyResponse);
app.post("/saidans/:id/share", dummyResponse);
app.post("/saidans/:id/notinterested", dummyResponse);

app.post("/posts/:id/like", dummyResponse);
app.post("/posts/:id/save", dummyResponse);
app.post("/posts/:id/share", dummyResponse);
app.post("/posts/:id/notinterested", dummyResponse);

app.post("/my/nfts/open", openNFT);
app.post("/my/items/:id/sale", dummyResponse);
app.post("/my/nfts/:id/listing", dummyResponse);
app.post("/items/:id/mint", mintNFT);
app.post("/nfts/:id/purchase", dummyResponse);
app.post("/my/nfts/:id/gift", dummyResponse);
app.post("/my/nfts/move", moveNFT);
app.post("/my/nfts/delete", deleteNFT);
app.post("/address/decoder", userInfoFromAddress);
app.post("/material/save", uploadMaterial);
app.post("/material/get", getMaterial);
app.post("/material/remove", removeMaterials);
export const native = functions.region(REGION).https.onRequest(app);
