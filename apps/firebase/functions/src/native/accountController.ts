import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";

export const getAccounts = async (req: Request, res: Response) => {
  const {q, sortBy, sortOrder} = req.params;
  const orderValue = {};
  Object.defineProperty(orderValue, sortBy, {
    value: sortOrder,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  const accounts = await prisma.tobiratory_accounts.findMany({
    where: {
      username: {
        in: [q],
      },
    },
    orderBy: orderValue,
  });
  const resData = {
    accounts: accounts.map(async (account) => {
      const flowAccountData = await prisma.tobiratory_flow_accounts.findUnique({
        where: {
          uuid: account.uuid,
        },
      });
      return {
        username: account.username,
        icon: account.icon_url,
        sns: account.sns,
        flow: {
          flowAddress: flowAccountData?.flow_address ?? "",
        },
        createdAt: account.created_date_time,
      };
    }),
  };

  res.status(200).send({
    status: "success",
    data: resData,
  });
};

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
        userId: accountData.uuid,
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
      });

      if (accountData == null) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const saidans = await prisma.tobiratory_saidans.findMany({
        where: {
          owner_uuid: uid,
        }
      })

      const resData = saidans.map((saidan)=>{
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
}