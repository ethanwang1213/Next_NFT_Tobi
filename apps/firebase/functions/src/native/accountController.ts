import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";

export const getAccountById = async (req: Request, res: Response) => {
  const {uid} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (/* decodedToken: DecodedIdToken*/) => {
    // const uid = decodedToken.uid;
    try {
      const accountData = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: uid,
        },
      });

      if (accountData == null) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const resData = {
        uuid: accountData.uuid,
        userId: accountData.user_id,
        username: accountData.username,
        email: accountData.email,
        icon: accountData.icon_url,
        sns: accountData.sns,
        aboutMe: accountData.about_me,
        socialLinks: accountData.social_link,
        gender: accountData.gender,
        birth: accountData.birth,
        createdAt: accountData.created_date_time,
      };
      res.status(200).send({
        status: "success",
        data: resData,
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
  });
};

export const getOthersSaidans = async (req: Request, res: Response) => {
  const {uid} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      const accountData = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: uid,
        },
        include: {
          saidans: true,
        },
      });

      if (accountData == null) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const resData = accountData.saidans.map((saidan)=>{
        return {
          id: saidan.id,
          thumbImage: saidan.thumbnail_image,
        };
      });
      res.status(200).send({
        status: "success",
        data: resData,
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
  });
};
