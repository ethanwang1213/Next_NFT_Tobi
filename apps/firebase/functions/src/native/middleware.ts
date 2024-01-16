// middleware

import {NextFunction} from "express";
import {Auth} from "firebase-admin/auth";

type RequireAuth = {
    headers: {
        authToken: string
        uuid?: string
    }
}

// recognize login
export const requireLogin = async (req: RequireAuth, res: Response, next: NextFunction) => {
  const {authToken} = req.headers;
  const firebaseAuth = new Auth();
  firebaseAuth.verifyIdToken(authToken).then((decodedToken) => {
    req.headers.uuid = decodedToken.uid;
    next();
  }).catch((error) => {
    error.status = 400;
    next(error);
  });
};
