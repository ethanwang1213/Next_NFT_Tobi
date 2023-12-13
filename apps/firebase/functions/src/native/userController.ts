import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

type Request = {
  body: { email: any; username: any; password: any; };
}

type MyProfile = {
  body: {
    account: any,
    flow: any,
  };
}

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
  const { email, username } = req.body;
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
  const { email, password } = req.body;
  const auth = getAuth();
  try {
    const loginFirebase = await signInWithEmailAndPassword(auth, email, password);

    const accountData = await prisma.tobiratory_accounts.findMany({
      where: {
        sns: email,
      }
    });
    if (accountData.length == 0) {
      res.status(200).send({
        status: "error",
        data: "Account data does not exist."
      })
    }

    const flowData = await prisma.tobiratory_flow_accounts.findUnique({
      where: {
        uuid: accountData[0].uuid,
      }
    })
    if (flowData == null) {
      res.status(200).send({
        status: "error",
        data: "Flow data does not exist."
      })
    }
    const resData = {
      userId: accountData[0].uuid,
      username: accountData[0].username,
      icon: accountData[0].icon_url,
      sns: accountData[0].sns,
      flow: {
        flowAddress: "xxx",
      },
      loginToken: loginFirebase.user.refreshToken,
      createdAt: "xxx",
    };
    res.status(200).send({
      status: "success",
      data: resData,
    });
  } catch (error) {
    res.status(200).send({
      status: "error",
      data: error,
    });
  }


};

export const getMyProfile = async (req: Request, res: Response) => {
  // const { id } = req.params;
  // const accountData = await prisma.tobiratory_accounts.findUnique({
  //   where: {
  //     uuid: id,
  //   }
  // });

  // if (accountData == null) {
  //   res.status(200).send({
  //     status: "error",
  //     data: 'Account does not exist!',
  //   });
  //   return;
  // }

  // const flowAccountData = await prisma.tobiratory_flow_accounts.findUniqueOrThrow({
  //   where: {
  //     uuid: id,
  //   }
  // })

  // if (flowAccountData == null) {
  //   res.status(200).send({
  //     status: "error",
  //     data: 'Flow account does not exist!',
  //   });
  //   return;
  // }

  // const resData = {
  //   userId: id,
  //   username: accountData.username,
  //   icon: accountData.icon_url,
  //   sns: accountData.sns,
  //   flow: {
  //     flowAddress: flowAccountData.flow_address,
  //     publicKey: flowAccountData.public_key,
  //     txId: flowAccountData.tx_id,
  //   },
  //   createdAt: accountData.created_date_time,
  // };
  // res.status(200).send({
  //   status: "success",
  //   data: resData,
  // });
}

export const postMyProfile = async (req: MyProfile, res: Response) => {
  const { account, flow } = req.body;
  const accountData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: account.id,
    }
  });
  const flowData = await prisma.tobiratory_flow_accounts.findUnique({
    where: {
      uuid: flow.uuid,
    }
  });
  res.status(200).send({
    status: "success",
    data: {
      account: accountData,
      flow: flowData,
    },
  });
}