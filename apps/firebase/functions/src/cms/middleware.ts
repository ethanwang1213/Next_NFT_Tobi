import { Request, Response, NextFunction } from "express";
import * as JWT from "jsonwebtoken";
import { jwtSecretKey } from "./constants";

export const middlewareAuth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    JWT.verify(authorization ?? "", jwtSecretKey, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        console.log(user);
        
        return next(); // Proceed to the next middleware or route handler
    });
};