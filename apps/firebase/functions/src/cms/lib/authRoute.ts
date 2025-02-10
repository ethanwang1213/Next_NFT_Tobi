import {Request, Response, Router} from "express";
import {jwtSecretKey} from "../constants";
import * as JWT from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {firestore} from "firebase-admin";
// import { prisma } from '../prisma';

const router: Router = Router();
router.post("/login", async (req: Request, res: Response) => {
  const {email, password} = req.body;

  const cmsAccountDoc = await firestore().collection("cmsAccount").doc(email).get();
  if (!cmsAccountDoc.exists) {
    res.status(401).send({
      status: "error",
      data: "not-found",
    });
    return;
  }
  const cmsAccount = cmsAccountDoc.data();

  if (!cmsAccount) {
    res.status(401).send({
      status: "error",
      data: "not-found",
    });
    return;
  }
  const user = {
    id: cmsAccount.id,
    name: cmsAccount.name,
    email: cmsAccount.email,
  };
  const hashedPassword = cmsAccount.hashedPassword;

  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    res.status(401).send({
      status: "error",
      data: "incorrect-password",
    });
    return;
  }

  const token = JWT.sign(user, jwtSecretKey);
  res.status(200).send({
    status: "success",
    data: {
      ...user,
      jwt: token,
    },
  });
});

export const authRouter = router;
