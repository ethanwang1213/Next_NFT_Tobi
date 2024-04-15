import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {createFlowAccount} from "../createFlowAccount";
import {UserRecord} from "firebase-functions/v1/auth";
import {isEmptyObject} from "./utils";
import {prisma} from "../prisma";

export const checkPasswordSet = async (req: Request, res: Response) => {
  const {email}: {email: string} = req.body;
  await auth().getUserByEmail(email).then((userRecord: UserRecord)=>{
    const providers = userRecord.providerData;

    const hasPasswordProvider = providers.some((provider) => provider.providerId === "password");

    if (hasPasswordProvider) {
      res.status(200).send({
        status: "success",
        data: true,
      });
    } else {
      res.status(200).send({
        status: "success",
        data: false,
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
  });
};

export const signUp = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken((authorization ?? "")).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    if (email==undefined) {
      res.status(401).send({
        status: "error",
        data: "anonymous-user",
      });
      return;
    }
    const username = email.split("@")[0];
    const userData = {
      uuid: uid,
      email: email,
      username: username,
    };
    try {
      const savedUser = await prisma.tobiratory_accounts.upsert({
        where: {
          uuid: uid,
        },
        update: {},
        create: userData,
      });
      const flowAcc = await prisma.tobiratory_flow_accounts.findUnique({
        where: {
          uuid: uid,
        },
      });
      if (decodedToken.email_verified && !flowAcc) {
        await createFlowAccount(uid);
      }
      res.status(200).send({
        status: "success",
        data: {
          userId: uid,
          username: savedUser.username,
          email: savedUser.email,
          icon: savedUser.icon_url,
          sns: savedUser.sns,
          aboutMe: savedUser.about_me,
          socialLinks: savedUser.social_link,
          gender: savedUser.gender,
          birth: savedUser.birth,
          flow: flowAcc==null ? null : {
            flowAddress: flowAcc.flow_address,
            publicKey: flowAcc.public_key,
            txId: flowAcc.tx_id,
          },
          createdAt: savedUser.created_date_time,
        },
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

export const createFlowAcc = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const flowAcc = await prisma.tobiratory_flow_accounts.findUnique({
        where: {
          uuid: uid,
        },
      });
      if (flowAcc != null) {
        res.status(200).send({
          status: "success",
          data: {
            flowAddress: flowAcc.flow_address,
            publicKey: flowAcc.public_key,
            txId: flowAcc.tx_id,
          },
        });
      }
      const flowInfo = await createFlowAccount(uid);
      const flowAccInfo = {
        uuid: uid,
        flow_job_id: flowInfo.flowJobId,
      };
      const flowData = await prisma.tobiratory_flow_accounts.create({
        data: flowAccInfo,
      });

      res.status(200).send({
        status: "success",
        data: {
          flowAddress: flowData.flow_address,
          publicKey: flowData.public_key,
          txId: flowData.tx_id,
        },
      });
    } catch (error) {
      res.status(401).send({
        status: "success",
        data: error,
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const getMyProfile = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const accountData = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: uid,
        },
      });

      if (accountData === null) {
        res.status(401).send({
          status: "error",
          data: "Account does not exist!",
        });
        return;
      }

      const flowAccountData = await prisma.tobiratory_flow_accounts.findUnique({
        where: {
          uuid: uid,
        },
      });

      if (flowAccountData === null) {
        res.status(401).send({
          status: "error",
          data: "Flow Account does not exist!",
        });
        return;
      }

      const resData = {
        userId: uid,
        username: accountData.username,
        email: accountData.email,
        icon: accountData.icon_url,
        sns: accountData.sns,
        aboutMe: accountData.about_me,
        socialLinks: accountData.social_link,
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
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error.code,
    });
  });
};

export const postMyProfile = async (req: Request, res: Response) => {
  type AccountType = {
    username?: string,
    email?: string,
    icon?: string,
    sns?: string,
    aboutMe?: string,
    socialLinks?: Array<string>,
    gender?: string,
    birth?: string,
    giftPermission?: boolean
  }
  type FlowType = {
    flowAddress?: string,
    publicKey?: string,
    txId?: string,
  }
  const {authorization} = req.headers;
  const {account, flow}: { account?: AccountType; flow?: FlowType } = req.body;
  const accountUpdated = {
    username: account?.username,
    email: account?.email,
    icon_url: account?.icon,
    sns: account?.sns,
    about_me: account?.aboutMe,
    social_link: account?.socialLinks,
    gender: account?.gender,
    birth: account?.birth,
    gift_permission: account?.giftPermission,
  };
  const flowUpdated = {
    flow_address: flow?.flowAddress,
    public_key: flow?.publicKey,
    tx_id: flow?.txId,
  };
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    let accountData; let flowData;
    const userExist = await prisma.tobiratory_accounts.findUnique({
      where: {
        uuid: uid,
      },
    });
    if (!userExist) {
      res.status(401).send({
        status: "error",
        data: "not-exist-user",
      });
    }
    try {
      if (account&&isEmptyObject(account)) {
        await prisma.tobiratory_accounts.update({
          where: {
            uuid: uid,
          },
          data: accountUpdated,
        });
        accountData = await prisma.tobiratory_accounts.findUnique({
          where: {
            uuid: uid,
          },
        });
      }
      if (flow&&isEmptyObject(flow)) {
        flowData = await prisma.tobiratory_flow_accounts.update({
          where: {
            uuid: uid,
          },
          data: flowUpdated,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        status: "error",
        data: error,
      });
      return;
    }

    res.status(200).send({
      status: "success",
      data: {
        account: {
          userId: accountData?.uuid,
          username: accountData?.username,
          email: accountData?.email,
          icon: accountData?.icon_url,
          sns: accountData?.sns,
          aboutMe: accountData?.about_me,
          socialLinks: accountData?.social_link,
          gender: accountData?.gender,
          birth: accountData?.birth,
          createdAt: accountData?.created_date_time,
        },
        flow: flowData==null ? undefined : {
          flowAddress: flowData.flow_address,
          publicKey: flowData.public_key,
          txId: flowData.tx_id,
        },
      },
    });
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error.code,
    });
  });
};

export const myBusiness = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const businesses = await prisma.tobiratory_businesses.findMany({
      where: {
        uuid: uid,
      },
    });
    const resData = {
      first_name: businesses[0].first_name,
      phone: businesses[0].phone,
      bankAccount: businesses[0].bank_account,
      balance: businesses[0].balance,
    };
    res.status(200).send({
      status: "success",
      data: resData,
    });
  });
};

export const businessSubmission = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {
    content: {
      name: contentName,
      url,
      description,
    },
    user: {
      firstName,
      lastName,
      birthdayYear,
      birthdayMonth,
      birthdayDate,
      email,
      phone,
      building,
      street,
      city,
      province,
      postalCode,
      country,
    },
    copyright: {
      copyrightHolder,
      license,
      file1,
      file2,
      file3,
      file4,
    },
  } = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const exist = await prisma.tobiratory_businesses.findFirst({
      where: {
        uuid: uid,
      },
    });
    if (exist) {
      res.status(400).send({
        status: "error",
        data: "already-exist",
      });
      return;
    }

    const birth = new Date(birthdayYear, birthdayMonth - 1, birthdayDate);
    const businessData = {
      uuid: uid,
      first_name: firstName,
      last_name: lastName,
      birth,
      email,
      country,
      postal_code: postalCode,
      province,
      city,
      street,
      building,
      phone,
      bank_account: "",
      balance: 0,
    };
    const contentData = {
      owner_uuid: uid,
      name: contentName,
      image: "",
      url,
      description,
      copyright_holders: [copyrightHolder],
      license,
      license_data: [file1, file2, file3, file4].filter((file) => file !== ""),
    };
    try {
      const [savedBusinessData, savedContentData] = await prisma.$transaction([
        prisma.tobiratory_businesses.create({
          data: businessData,
        }),
        prisma.tobiratory_contents.create({
          data: contentData,
        })]
      );
      res.status(200).send({
        status: "success",
        data: {...savedBusinessData, content: {...savedContentData}},
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        data: error,
      });
    }
  }).catch((error: FirebaseError)=>{
    res.status(500).send({
      status: "error",
      data: error.code,
    });
  });
};

export const checkExistBusinessAcc = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const exist = await prisma.tobiratory_businesses.findFirst({
      where: {
        uuid: uid,
      },
    });
    if (exist) {
      res.status(200).send({
        status: "success",
        data: {
          exist: true,
        },
      });
      return;
    } else {
      res.status(200).send({
        status: "success",
        data: {
          exist: false,
        },
      });
      return;
    }
  }).catch((error: FirebaseError)=>{
    res.status(500).send({
      status: "error",
      data: error.code,
    });
  });
};

export const updateMyBusiness = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {fistName, lastName, phone} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const myBusiness = await prisma.tobiratory_businesses.updateMany({
      where: {
        uuid: uid,
      },
      data: {
        first_name: fistName,
        last_name: lastName,
        phone: phone,
      },
    });
    res.status(200).send({
      status: "success",
      data: myBusiness,
    });
  });
};
