import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";

export const getAccountById = async (req: Request, res: Response) => {
  const {uid} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      const accountData = await prisma.accounts.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });

      if (!accountData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const flowAccountData = await prisma.flow_accounts.findUnique({
        where: {
          account_uuid: uid,
          is_deleted: false,
        },
      });

      if (!flowAccountData) {
        res.status(401).send({
          status: "error",
          data: "Flow Account does not exist!",
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
        socialLinks: accountData.social_links,
        gender: accountData.gender,
        birth: accountData.birth,
        flow: {
          flowAddress: flowAccountData.flow_address,
          publicKey: flowAccountData.public_key,
          txId: flowAccountData.tx_id,
        },
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
      data: error,
    });
  });
};

export const getOthersSaidans = async (req: Request, res: Response) => {
  const {uid} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      const accountData = await prisma.accounts.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          saidans: {
            where: {
              is_deleted: false,
            },
            include: {
              favorite_users: true,
            },
          },
        },
      });

      if (!accountData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const resData = accountData.saidans.map((saidan)=>{
        return {
          id: saidan.id,
          title: saidan.title,
          thumbImage: saidan.thumbnail_image,
          favorite: saidan.favorite_users.filter((user)=>user.account_uuid == uid).length!=0,
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
      data: error,
    });
  });
};

export const reportAccount = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {uid} = req.params;
  const {title, description} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const reporterUid = decodedToken.uid;
      const account = await prisma.accounts.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!account) {
        res.status(404).send({
          status: "error",
          data: "not-exits",
        });
        return;
      }
      const createReport = await prisma.reported_accounts.create({
        data: {
          title: title,
          description: description,
          reporter_uuid: reporterUid,
          account_uuid: uid,
        },
      });
      res.status(200).send({
        status: "success",
        data: createReport.id,
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
      data: error,
    });
    return;
  });
};
