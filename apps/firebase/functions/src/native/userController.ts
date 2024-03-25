import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {createFlowAccount} from "../createFlowAccount";
import {UserRecord} from "firebase-functions/v1/auth";
import {isEmptyObject} from "./utils";

const prisma = new PrismaClient();

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
    const email = decodedToken.email ?? "";
    const savedUser = await prisma.tobiratory_accounts.findMany({
      where: {
        email: email,
      },
    });
    if (savedUser.length==0) {
      const username = email.split("@")[0];
      const userData = {
        uuid: uid,
        email: email,
        username: username,
        sns: "",
        icon_url: "",
      };
      const createdUser = await prisma.tobiratory_accounts.create({
        data: userData,
      });
      const flowAcc = await prisma.tobiratory_flow_accounts.findUnique({
        where: {
          uuid: decodedToken.uid,
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          userId: uid,
          username: createdUser.username,
          email: createdUser.email,
          icon: createdUser.icon_url,
          sns: createdUser.sns,
          aboutMe: createdUser.about_me,
          socialLinks: createdUser.social_link,
          gender: createdUser.gender,
          birth: createdUser.birth,
          flow: flowAcc==null ? null : {
            flowAddress: flowAcc.flow_address,
            publicKey: flowAcc.public_key,
            txId: flowAcc.tx_id,
          },
          createdAt: createdUser.created_date_time,
        },
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
        data: {
          userId: uid,
          username: savedUser[0].username,
          email: savedUser[0].email,
          icon: savedUser[0].icon_url,
          sns: savedUser[0].sns,
          aboutMe: savedUser[0].about_me,
          socialLinks: savedUser[0].social_link,
          gender: savedUser[0].gender,
          birth: savedUser[0].birth,
          flow: flowAcc==null ? null : {
            flowAddress: flowAcc.flow_address,
            publicKey: flowAcc.public_key,
            txId: flowAcc.tx_id,
          },
          createdAt: savedUser[0].created_date_time,
        },
      });
      return;
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
        accountData = await prisma.tobiratory_accounts.update({
          where: {
            uuid: uid,
          },
          data: accountUpdated,
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
  });
};

export const businessSubmission = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {
    contentName,
    contentNameFurigana,
    genre,
    contentDesc,
    homepageUrl,
    name,
    nameFurigana,
    birth,
    address,
    phone,
    email,
  } = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const exist = await prisma.tobiratory_businesses.findMany({
      where: {
        uuid: uid,
      },
    });
    if (!exist.length) {
      res.status(401).send({
        status: "error",
        data: "already-exist",
      });
      return;
    }
    const businessData = await prisma.tobiratory_businesses.create({
      data: {
        uuid: uid,
        email: email,
        name: name,
        name_furi: nameFurigana,
        birth: birth,
        content_name: contentName,
        content_name_furi: contentNameFurigana,
        content_desc: contentDesc,
        homepage_url: homepageUrl,
        genre: genre,
        address: address,
        phone: phone,
        kyc: "",
        bank_account: "",
        balance: "0",
      },
    });
    res.status(200).send({
      status: "success",
      data: businessData,
    });
  }).catch((error: FirebaseError)=>{
    res.status(200).send({
      status: "success",
      data: error.code,
    });
  });
};

export const checkExistBusinessAcc = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const exist = await prisma.tobiratory_businesses.findMany({
      where: {
        uuid: uid,
      },
    });
    if (!exist.length) {
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
    res.status(200).send({
      status: "success",
      data: error.code,
    });
  });
};

export const updateMyBusiness = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {name, address, phone} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const myBusiness = await prisma.tobiratory_businesses.updateMany({
      where: {
        uuid: uid,
      },
      data: {
        name: name,
        address: address,
        phone: phone,
      },
    });
    res.status(200).send({
      status: "success",
      data: myBusiness,
    });
  });
};
