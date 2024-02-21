import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {PrismaClient} from "@prisma/client";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";

const prisma = new PrismaClient();

export const getItems = async (req: Request, res: Response) => {
  const {q, type, creator, sortBy, sortOrder} = req.params;
  const orderValue = {};
  Object.defineProperty(orderValue, sortBy, {
    value: sortOrder,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  const items = await prisma.tobiratory_items.findMany({
    where: {
      title: {
        in: [q],
      },
      type: {
        equals: type,
      },
    },
    orderBy: orderValue,
  });
  const resData = {
    items: items.map(async (item) => {
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          id: item.content_id,
          creator_user_id: creator,
        },
      });

      return {
        id: item.id,
        title: item.title,
        image: item.image,
        type: item.type,
        content: {
          id: content?.id ?? -1,
          creator: {
            userId: content?.creator_user_id,
          },
        },
      };
    }),
  };

  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const getItemsById = async (req: Request, res: Response) => {
  const {id} = req.params;
  const itemData = await prisma.tobiratory_items.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (itemData == null) {
    res.status(404).send({
      status: "error",
      data: "Item does not exist!",
    });
    return;
  }

  const contentData = await prisma.tobiratory_contents.findUnique({
    where: {
      id: itemData.content_id,
    },
  });

  if (contentData == null) {
    res.status(404).send({
      status: "error",
      data: "Content for this item does not exist!",
    });
    return;
  }

  const resData = {
    id: id,
    title: itemData.title,
    image: itemData.image,
    type: itemData.type,
    content: {
      id: contentData.id,
      creator: {
        userId: contentData.creator_user_id,
      },
    },
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const getMyItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {q, type, creator, sortBy, sortOrder} = req.params;
  const orderValue = {};
  Object.defineProperty(orderValue, sortBy, {
    value: sortOrder,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const items = await prisma.tobiratory_items.findMany({
      where: {
        creator_uid: {
          equals: uid
        },
        title: {
          in: [q],
        },
        type: {
          equals: type,
        },
      },
      orderBy: orderValue,
    });
    const resData = {
      items: items.map(async (item) => {
        const content = await prisma.tobiratory_contents.findUnique({
          where: {
            id: item.content_id,
            creator_user_id: creator,
          },
        });
  
        return {
          id: item.id,
          title: item.title,
          image: item.image,
          type: item.type,
          content: {
            id: content?.id ?? -1,
            creator: {
              userId: content?.creator_user_id,
            },
          },
        };
      }),
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

export const getMyItemsById = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const itemData = await prisma.tobiratory_items.findUnique({
      where: {
        id: parseInt(id),
        creator_uid: uid,
      },
    });
  
    if (itemData == null) {
      res.status(404).send({
        status: "error",
        data: "Item does not exist!",
      });
      return;
    }
  
    const contentData = await prisma.tobiratory_contents.findUnique({
      where: {
        id: itemData.content_id,
      },
    });
  
    if (contentData == null) {
      res.status(404).send({
        status: "error",
        data: "Content for this item does not exist!",
      });
      return;
    }
  
    const resData = {
      id: id,
      title: itemData.title,
      image: itemData.image,
      type: itemData.type,
      content: {
        id: contentData.id,
        creator: {
          userId: contentData.creator_user_id,
        },
      },
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

export const createItem = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, image, type} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const item = await prisma.tobiratory_items.create({
      data: {
        creator_uid: uid,
        title: title,
        image: parseInt(image),
        type: type,
        content_id: 0,
        folder_id: 0,
      },
    });
    await prisma.tobiratory_sample_items.create({
      data: {
        digital_item_id: item.id,
      },
    });
    res.status(200).send({
      status: "success",
      data: "saved-success",
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

export const updateItem = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {itemData} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const item = await prisma.tobiratory_items.update({
      where: {
        id: itemData.id,
        creator_uid: uid,
      },
      data: {
        // itemData,
      },
    });
    await prisma.tobiratory_sample_items.create({
      data: {
        digital_item_id: item.id,
      },
    });
    res.status(200).send({
      status: "success",
      data: "saved-success",
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
