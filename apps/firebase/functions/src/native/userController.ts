import { PrismaClient } from "@prisma/client";
import {Response} from "express";

type Request = {
  body: { email: any; username: any; password: any; };
  params: { id: string }
}

export const signUp = async (req: Request, res: Response) => {
  const {email, username} = req.body;
  const prisma = new PrismaClient();
  await prisma.tobiratory_accounts.create({
    data: {
      uuid: "123",
      user_id: "0",
      username: username,
      sns: email,
      icon_url: "",
    },
  });
  res.status(200).send({
    status: "success",
    data: {
      uuid: "123",
      user_id: "0",
      username: username,
      email: email,
      icon_url: "",
    },
  })
};

export const signIn = async (req: Request, res: Response) => {
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
