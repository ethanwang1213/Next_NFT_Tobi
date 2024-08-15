/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import {REGION} from "./constants";
import {authRouter} from "./lib/authRoute";
import {userRouter} from "./lib/userRoute";
import {contentRouter} from "./lib/contentRoute";
import { middlewareAuth } from "./middleware";

const app = express();
app.use(cors({origin: true}));

app.use("/auth", authRouter);
app.use("/users", middlewareAuth, userRouter);
app.use("/contents", middlewareAuth, contentRouter);

export const tobiratoryCms = functions.region(REGION).https.onRequest(app);
