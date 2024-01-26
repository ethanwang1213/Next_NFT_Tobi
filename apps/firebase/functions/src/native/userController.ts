import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {createFlowAccount} from "../createFlowAccount";

type SignInRequest = {
  body: {
    userId: any;
    password: any;
  }
}

type MyProfile = {
  body: {
    account: any,
    flow: any,
  };
}

type GetMyProfile = {
  body: {
    uuid: string;
  }
}

type MyBusiness = {
  headers: {
    uuid: string;
  }
}

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response) => {
  const {email, password} = req.body;
  try {
    const firebaseAuthUser = await auth().getUserByEmail(email);
    if (!firebaseAuthUser.passwordHash) {
      // sent password reset email
      await getAuth().generatePasswordResetLink(email);
      res.status(200).send({
        status: "success",
        data: "reset-password",
      });
      return;
    } else if (!firebaseAuthUser.emailVerified) {
      // sent email verify
      await auth().generateEmailVerificationLink(email).then(() => {
        res.status(200).send({
          status: "success",
          data: "email-verify",
        });
      });
    } else {
      res.status(200).send({
        status: "success",
        data: "next",
      });
    }
  } catch (error: any) {
    if (!password) {
      res.status(401).send({
        status: "error",
        data: error.code,
      });
      return
    }
    await auth().createUser({
      email: email,
      password: password,
      emailVerified: false,
    }).then(async () => {
      await auth().generateEmailVerificationLink(email).then(() => {
        res.status(200).send({
          status: "success",
          data: "sent-mail",
        });
      });
    }).catch(async (errorMail: FirebaseError) => {
      res.status(401).send({
        status: "error",
        data: errorMail.code,
      });
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  const {Authorization} = req.headers;
  await auth().verifyIdToken((Authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const email = decodedToken.email ?? "";
    const savedUser = await prisma.tobiratory_accounts.findMany({
      where: {
        email: email,
      },
    });
    if (savedUser.length) {
      const username = email.split("@")[0];
      const userData = {
        uuid: uid,
        email: email,
        username: username,
        sns: "",
        icon_url: "",
      };
      await prisma.tobiratory_accounts.create({
        data: userData,
      });
      res.status(200).send({
        status: "success",
        data: {...userData, flow: null},
      });
      return;
    } else {
      const flowAcc = await prisma.tobiratory_flow_accounts.findUnique({
        where: {
          uuid: savedUser[0].uuid,
        },
      });
      if (decodedToken.email_verified && !flowAcc) {
        await createFlowAccount(uid);
      }
      res.status(200).send({
        status: "success",
        data: {...savedUser[0], flow: flowAcc},
      });
      return;
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.message,
    });
    return;
  });
};

export const createFlowAcc = async (req: Request, res: Response) => {
  const {uid} = req.body;
  const flowAcc = await prisma.tobiratory_flow_accounts.findUnique({
    where: {
      uuid: uid,
    },
  });
  if (flowAcc != null) {
    res.status(401).send({
      status: "error",
      data: "Flow account already exist",
    });
  }
  const flowInfo = await createFlowAccount(uid);
  res.status(200).send({
    status: "success",
    data: flowInfo.flowJobId,
  });
};

export const signIn = async (req: SignInRequest, res: Response) => {
  const {userId} = req.body;
  const validateEmail = String(userId)
      .toLowerCase()
      .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  if (!validateEmail) {
    const usernameData = await prisma.tobiratory_accounts.findMany({
      where: {
        username: userId,
      },
    });
    if (usernameData.length == 0) {
      res.status(401).send({
        status: "error",
        data: "Username does not exist.",
      });
      return;
    }
    // userId = usernameData[0].email;
  }
  // auth().generateSignInWithEmailLink
  // await signInWithEmailAndPassword(auth, userId, password)
  //   .then(async (userCredential) => {
  //     const uid = userCredential.user.uid;
  //     const userData = await prisma.tobiratory_accounts.findUnique({
  //       where: {
  //         uuid: uid,
  //       }
  //     })
  //     res.status(200).send({
  //       status: "success",
  //       data: userData,
  //     });
  //     return;
  //   })
  //   .catch((error) => {
  //     res.status(401).send({
  //       status: "error",
  //       data: error.message
  //     });
  //     return;
  //   });
};

export const getMyProfile = async (req: GetMyProfile, res: Response) => {
  const {uuid} = req.body;
  const accountData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: uuid,
    },
  });

  if (accountData === null) {
    res.status(200).send({
      status: "error",
      data: "Account does not exist!",
    });
    return;
  }

  const flowAccountData = await prisma.tobiratory_flow_accounts.findUniqueOrThrow({
    where: {
      uuid: uuid,
    },
  });

  if (flowAccountData === null) {
    res.status(200).send({
      status: "error",
      data: "Flow account does not exist!",
    });
    return;
  }

  const resData = {
    userId: uuid,
    username: accountData.username,
    icon: accountData.icon_url,
    sns: accountData.sns,
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
};

export const postMyProfile = async (req: MyProfile, res: Response) => {
  const {account, flow} = req.body;
  const accountData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: account.id,
    },
  });
  const flowData = await prisma.tobiratory_flow_accounts.findUnique({
    where: {
      uuid: flow.uuid,
    },
  });
  res.status(200).send({
    status: "success",
    data: {
      account: accountData,
      flow: flowData,
    },
  });
};

export const myBusiness = async (req: MyBusiness, res: Response) => {
  const {uuid} = req.headers;
  const userData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: uuid,
    },
  });
  if (userData == null) {
    res.status(200).send({
      status: "error",
      data: "Userdata does not exist.",
    });
  }
  const businesses = await prisma.tobiratory_businesses.findMany({
    where: {
      uuid: userData?.uuid,
    },
  });
  const resData = {
    name: businesses[0].name,
    address: businesses[0].address,
    phone: businesses[0].phone,
    kyc: businesses[0].kyc,
    bankAccount: businesses[0].bank_account,
    balance: businesses[0].balance,
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const myInventory = async (req: MyBusiness, res: Response) => {
  const {uuid} = req.headers;
  const userData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: uuid,
    },
  });
  if (userData == null) {
    res.status(200).send({
      status: "error",
      data: "Userdata does not exist.",
    });
  }
  // const businesses =
  await prisma.tobiratory_items.findMany({
    where: {
      id: parseInt(uuid),
    },
  });
  const resData = {
    item: [],
    folders: [],
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const updateMyInventory = async (req: MyBusiness, res: Response) => {
  const {uuid} = req.headers;
  const userData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: uuid,
    },
  });
  if (userData == null) {
    res.status(200).send({
      status: "error",
      data: "Userdata does not exist.",
    });
  }
  // const businesses =
  await prisma.tobiratory_items.findMany({
    where: {
      id: parseInt(uuid),
    },
  });
  const resData = {
    item: [],
    folders: [],
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};
