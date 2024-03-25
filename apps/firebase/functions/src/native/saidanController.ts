import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {PrismaClient} from "@prisma/client";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";

const prisma = new PrismaClient();

export const getSaidans = async (req: Request, res: Response) => {
  const {q, showcase, sortBy, sortOrder} = req.params;
  const orderValue = {};
  Object.defineProperty(orderValue, sortBy, {
    value: sortOrder,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  const saidans = await prisma.tobiratory_saidans.findMany({
    where: {
      title: {
        in: [q],
      },
      showcase: {
        equals: showcase=="true",
      },
    },
    orderBy: orderValue,
  });
  const resData = {
    saidans: saidans.map(async (saidan) => {
      return {
        id: saidan.id,
        title: saidan.title,
        description: saidan.description,
        owner: {
          userId: saidan.owner_id,
        },
        showcase: saidan.showcase,
      };
    }),
  };

  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const getSaidansById = async (req: Request, res: Response) => {
  const {id} = req.params;
  const saidanData = await prisma.tobiratory_saidans.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (saidanData == null) {
    res.status(404).send({
      status: "error",
      data: "Item does not exist!",
    });
    return;
  }

  const resData = {
    id: id,
    title: saidanData.title,
    description: saidanData.description,
    owner: {
      userId: saidanData.owner_id,
    },
    showcase: saidanData.showcase,
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const createSaidan = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, description, templateId, maxItemCount} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const saveData = await prisma.tobiratory_saidans.create({
      data: {
        title: title,
        description: description,
        template_id: templateId,
        max_item_count: maxItemCount,
        owner_id: uid,
      },
    });
    const returnData = {
      id: saveData.id,
      title: title,
      description: description,
      owner: {
        userId: uid,
      },
      showcase: saveData.showcase,
    };
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const getMySaidan = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {q, showcase, sortBy, sortOrder} = req.params;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const orderValue = {};
    Object.defineProperty(orderValue, sortBy, {
      value: sortOrder,
      writable: false,
      enumerable: true,
      configurable: true,
    });
    const saidans = await prisma.tobiratory_saidans.findMany({
      where: {
        owner_id: uid,
        title: {
          in: [q],
        },
        showcase: {
          equals: showcase=="true",
        },
      },
      orderBy: orderValue,
    });
    const resData = {
      saidans: saidans.map(async (saidan) => {
        return {
          id: saidan.id,
          title: saidan.title,
          description: saidan.description,
          owner: {
            userId: saidan.owner_id,
          },
          showcase: saidan.showcase,
        };
      }),
    };

    res.status(200).send({
      status: "success",
      data: resData,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const getMySaidansById = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const saidanData = await prisma.tobiratory_saidans.findUnique({
      where: {
        id: parseInt(saidanId),
      },
    });

    if (saidanData == null) {
      res.status(404).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }

    if (saidanData.owner_id != uid) {
      res.status(404).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }

    const resData = {
      id: saidanId,
      title: saidanData.title,
      description: saidanData.description,
      owner: {
        userId: saidanData.owner_id,
      },
      showcase: saidanData.showcase,
    };
    res.status(200).send({
      status: "success",
      data: resData,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};
