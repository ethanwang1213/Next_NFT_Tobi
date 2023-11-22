import {Response} from "express";
// import {firestore} from "firebase-admin";
import {PrismaClient} from "@prisma/client";

type Request = {
  params: { id: string }
}

export const getAccounts = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  const accounts = await prisma.tobiratory_account.findMany();
  const resData = {
    accounts: accounts.map((account) => {
      return {
        userId: account.user_id,
        username: account.username,
        icon: account.icon_url,
        sns: "xxx",
        flow: {
          flowAddress: "xxx",
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
  const {id} = req.params;
  const resData = {
    userId: id,
    username: "xxx",
    icon: "xxx",
    sns: "xxx",
    flow: {
      flowAddress: "xxx",
    },
    createdAt: "xxx",
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};
