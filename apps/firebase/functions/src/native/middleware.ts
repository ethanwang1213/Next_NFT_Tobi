// middleware

import {NextFunction, Request} from "express";
import {Auth} from "firebase-admin/auth";

// recognize login
export const requireLogin = async (req: Request, _res: Response, next: NextFunction) => {
  const {authorization} = req.headers;
  const firebaseAuth = new Auth();
  firebaseAuth.verifyIdToken(authorization??"").then((decodedToken) => {
    return next(decodedToken);
  }).catch((error) => {
    error.status = 400;
    return next(error);
  });
};
