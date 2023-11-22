import {Response} from "express";
// import {firestore} from "firebase-admin";

type Request = {
  params: { id: string }
}

export const getAccounts = async (req: Request, res: Response) => {
  const resData = {
    accounts: [
      {
        userId: "xxx",
        username: "xxx",
        icon: "xxx",
        sns: "xxx",
        createdAt: "xxx",
      },
      {
        userId: "xxx",
        username: "xxx",
        icon: "xxx",
        sns: "xxx",
        createdAt: "xxx",
      },
    ],
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
