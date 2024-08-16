import {Request, Response, Router} from "express";
import {jwtSecretKey, userCredentials} from "../constants";
import * as JWT from "jsonwebtoken";
// import { prisma } from '../prisma';

const router: Router = Router();
router.post("/login", (req: Request, res: Response) => {
  const {email, password} = req.body;
  const user = userCredentials.find((user)=> user.email == email);
  if (user) {
    if (password == user.password) {
      const token = JWT.sign(user, jwtSecretKey);
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
