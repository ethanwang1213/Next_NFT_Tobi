import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

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
  const {id} = req.params;
  const accountData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: id,
    },
  });

  if (accountData == null) {
    res.status(404).send({
      status: "error",
      data: "Account does not exist!",
    });
    return;
  }

  const flowAccountData = await prisma.tobiratory_flow_accounts.findUnique({
    where: {
      uuid: id,
    },
  });

  const resData = {
    userId: id,
    username: accountData.username,
    icon: accountData.icon_url,
    sns: accountData.sns,
    flow: {
      flowAddress: flowAccountData == null? "":flowAccountData.flow_address,
    },
    createdAt: accountData.created_date_time,
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};
