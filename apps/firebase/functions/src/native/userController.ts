import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {createFlowAccount} from "../createFlowAccount";

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
    const regExp = new RegExp(
        "^" +
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])" +
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_\\-+=:;])" +
        "(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_\\-+=:;])" +
        "(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*_\\-+=:;])" +
        "([a-zA-Z0-9!@#$%^&*_\\-+=:;]){8,}$"
    );
    if (!password) {
      res.status(401).send({
        status: "error",
        data: error.code,
      });
      return;
    }
    if (!regExp.test(password)) {
      res.status(401).send({
        status: "error",
        data: "password-incorrect",
      });
      return;
    }
    await auth().createUser({
      email: email,
      password: password,
      emailVerified: false,
    }).then(async () => {
      await auth().generateEmailVerificationLink(email).then(() => {
        res.status(200).send({
          status: "success",
          data: "email-verify",
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
  const {authorization} = req.headers;
  await getAuth().verifyIdToken((authorization ?? "")).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const email = decodedToken.email ?? "";
    const savedUser = await prisma.tobiratory_accounts.findMany({
      where: {
        email: email,
      },
    });
    if (!savedUser.length) {
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
      data: error,
    });
    return;
  });
};

export const createFlowAcc = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
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
  await auth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
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

    const flowAccountData = await prisma.tobiratory_flow_accounts.findUniqueOrThrow({
      where: {
        uuid: uid,
      },
    });

    const resData = {
      userId: uid,
      username: accountData.username,
      email: accountData.email,
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
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "success",
      data: error.code,
    });
  });
};

export const postMyProfile = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {account, flow} = req.body;
  await auth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const accountData = await prisma.tobiratory_accounts.update({
      where: {
        uuid: uid,
      },
      data: account,
    });
    const flowData = await prisma.tobiratory_flow_accounts.update({
      where: {
        uuid: uid,
      },
      data: flow,
    });
    res.status(200).send({
      status: "success",
      data: {
        account: accountData,
        flow: flowData,
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
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
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
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    await prisma.tobiratory_businesses.create({
      data: {
        uuid: uid,
        name: "",
        address: "",
        phone: "",
        kyc: "",
        bank_account: "",
        balance: "0",
      },
    });
    res.status(200).send({
      status: "success",
      data: "resData",
    });
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
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
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

export const myInventory = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    // const businesses =
    const items = await prisma.tobiratory_items.findMany({
      where: {
        uuid: uid,
      },
    });
    const resData = {
      item: items,
      boxes: [],
    };
    res.status(200).send({
      status: "success",
      data: resData,
    });
  });
};

// export const updateMyInventory = async (req: Request, res: Response) => {
//   const {authorization} = req.headers;
//   const userData = await prisma.tobiratory_accounts.findUnique({
//     where: {
//       uuid: uuid,
//     },
//   });
//   if (userData == null) {
//     res.status(200).send({
//       status: "error",
//       data: "Userdata does not exist.",
//     });
//   }
//   // const businesses =
//   await prisma.tobiratory_items.findMany({
//     where: {
//       id: parseInt(uuid),
//     },
//   });
//   const resData = {
//     item: [],
//     boxes: [],
//   };
//   res.status(200).send({
//     status: "success",
//     data: resData,
//   });
// };


export const makeFolder = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {parentFolder, name} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    await prisma.tobiratory_boxes.create({
      data: {
        uuid: uid,
        parent_id: parentFolder,
        name: name,
      },
    });
    res.status(200).send({
      status: "success",
      data: "created",
    });
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "success",
      data: error.code,
    });
  });
};

export const getFolderData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const folder = await prisma.tobiratory_boxes.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (folder == null) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (folder.uuid == uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    const parentFolder = await prisma.tobiratory_boxes.findUnique({
      where: {
        id: folder.parent_id,
      },
    });
    const childrenFolders = await prisma.tobiratory_boxes.findMany({
      where: {
        parent_id: parseInt(id),
      },
    });
    const items = await prisma.tobiratory_items.findMany({
      where: {
        folder_id: parseInt(id),
      },
    });
    res.status(200).send({
      status: "success",
      data: {
        parentFolder: parentFolder,
        items: items,
        folders: childrenFolders,
      },
    });
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "success",
      data: error.code,
    });
  });
};

export const deleteFolderData = async (req:Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const folder = await prisma.tobiratory_boxes.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (folder == null) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (folder.uuid == uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    await prisma.tobiratory_boxes.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).send({
      status: "success",
      data: "deleted",
    });
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "success",
      data: error.code,
    });
  });
};

export const getNFTInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id, serialNo} = req.params;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const nftData = await prisma.tobiratory_nfts.findUnique({
      where: {
        id: parseInt(id),
        serial_no: parseInt(serialNo),
      },
    });
    if (nftData == null) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (nftData.owner == uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    const creator = await prisma.tobiratory_accounts.findUnique({
      where: {
        uuid: uid,
      },
    });
    res.status(200).send({
      status: "success",
      data: {
        serialNo: nftData.serial_no,
        owner: nftData.owner,
        id: nftData.id,
        title: nftData.title,
        image: nftData.image,
        creator: creator,
      },
    });
    return;
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};
