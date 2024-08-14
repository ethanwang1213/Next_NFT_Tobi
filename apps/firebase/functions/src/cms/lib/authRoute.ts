import {Request, Response, Router} from "express";
import {userCredentials} from "../constants";
import * as JWT from "jsonwebtoken";
// import { prisma } from '../prisma';

const router: Router = Router();
router.post("/login", (req: Request, res: Response) => {
  const {email, password} = req.body;
  const user = userCredentials.find((user)=> user.email == email);
  const jwtSecretKey = process.env.JWT_SECRET_KEY??"Tobiratory";
  if (user) {
    if (password == user.password) {
      const token = JWT.sign(user, jwtSecretKey, {
        expiresIn: "4h",
      });
      res.status(200).send({
        status: "success",
        data: {
          ...user,
          jwt: token,
        },
      });
    } else {
      res.status(401).send({
        status: "error",
        data: "incorrect-password",
      });
    }
  } else {
    res.status(401).send({
      status: "error",
      data: "not-found",
    });
  }
});

export const authRouter = router;
