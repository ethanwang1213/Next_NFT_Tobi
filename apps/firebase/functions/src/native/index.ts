import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import {REGION} from "../lib/constants";

import {getAccountById, getOthersSaidans} from "./accountController";
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
import {
  getContentById,
  getContentByUuid,
  getFavoriteContents,
  getMyContentInfo,
  setFavoriteContent,
  updateMyContentInfo,
} from "./contentController";
import {
  createModel,
  createDigitalItem,
  deleteDigitalItem,
  getMyDigitalItems,
  adminChangeDigitalStatus,
  adminGetAllSamples,
  adminDeleteSamples,
  adminDetailOfSample,
  adminUpdateSample,
  getSampleInfo,
} from "./itemController";
import {
  createSaidan,
  decorationSaidan,
  favoriteSaidan,
  getMySaidans,
  getMySaidansById,
  getSaidanDecorationData,
  getSaidanTemplates,
  getSaidansById,
  putAwayItemInSaidan,
  updateMySaidan,
} from "./saidanController";
import {getMaterial, removeMaterials, uploadMaterial} from "./fileController";
import {makeBox, getBoxData, deleteBoxData, getInventoryData, permissionGift, openNFT, userInfoFromAddress, moveNFT, deleteNFT} from "./boxController";
import {fetchNftModel, fetchNftThumb, getNftInfo, mintNFT} from "./nftController";
import {decorationWorkspace, getWorkspaceDecorationData, throwSample} from "./workspaceController";
import {deleteCopyrights, getCopyrights, updateCopyrights} from "./copyrightsController";
import {getShowcaseTemplate, createMyShocase, updateMyShowcase, deleteMyShowcase, getMyShowcases, putItemToShowcase} from "./showcaseController";
import {searchAll, searchContents, searchDigitalItems, searchSaidans, searchUsers} from "./searchController";

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

app.get("/search", searchAll);
app.get("/search/users", searchUsers);
app.get("/search/contents", searchContents);
app.get("/search/saidans", searchSaidans);
app.get("/search/samples", searchDigitalItems);

app.get("/accounts/:uid", getAccountById);
app.get("/accounts/:uid/saidans", getOthersSaidans);
app.get("/business/:uid/content", getContentByUuid);

app.get("/contents/favor", getFavoriteContents);
app.get("/contents/:id", getContentById);
app.post("/contents/:id", setFavoriteContent);

app.get("/nfts/:id", dummyResponse);

app.get("/saidans/:saidanId", getSaidansById);
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

app.get("/my/nfts/:id", getNftInfo);
app.post("/my/contents", dummyResponse);
app.get("/my/contents/:id", dummyResponse);
app.post("/my/contents/:id", dummyResponse);
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
app.get("/my/workspace", getWorkspaceDecorationData);
app.post("/my/workspace", decorationWorkspace);
app.post("/my/workspace/throw", throwSample);
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
app.get("/items/:id", getSampleInfo);
app.post("/items/:id/mint", mintNFT);
app.post("/nfts/:id/purchase", dummyResponse);
app.post("/my/nfts/:id/gift", dummyResponse);
app.post("/my/nfts/move", moveNFT);
app.post("/my/nfts/delete", deleteNFT);
app.post("/address/decoder", userInfoFromAddress);
app.post("/material/save", uploadMaterial);
app.post("/material/get", getMaterial);
app.post("/material/remove", removeMaterials);
app.post("/nfts/fetch-thumb", fetchNftThumb);
app.post("/nfts/fetch-model", fetchNftModel);

// admin APIs
app.get("/admin/copyrights", getCopyrights);
app.post("/admin/copyrights/:id", updateCopyrights);
app.delete("/admin/copyrights/:id", deleteCopyrights);
app.post("/admin/digital/status", adminChangeDigitalStatus);

// management samples
app.get("/admin/samples", adminGetAllSamples);
app.delete("/admin/samples", adminDeleteSamples);
app.get("/admin/samples/:sampleId", adminDetailOfSample);
app.post("/admin/samples/:sampleId", adminUpdateSample);

// management showcase
app.get("/admin/showcases/template", getShowcaseTemplate);
app.post("/admin/showcases", createMyShocase);
app.get("/admin/showcases", getMyShowcases);
app.put("/admin/showcases/:id", updateMyShowcase);
app.put("/admin/showcases/:id/put-item", putItemToShowcase);
app.delete("/admin/showcases/:id", deleteMyShowcase);

// management content
app.get("/admin/content", getMyContentInfo);
app.put("/admin/content", updateMyContentInfo);
export const native = functions.region(REGION).https.onRequest(app);
