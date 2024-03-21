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
  const items = await prisma.tobiratory_digital_items.findMany({
    where: {
      name: {
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
        name: item.name,
        image: item.image,
        type: item.type,
        content: content == null ? null : {
          id: content.id,
          creator: {
            userId: content.creator_user_id,
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
  const itemData = await prisma.tobiratory_digital_items.findUnique({
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

  const resData = {
    id: id,
    name: itemData.name,
    image: itemData.image,
    type: itemData.type,
    content: contentData == null ? null : {
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
    const items = await prisma.tobiratory_digital_items.findMany({
      where: {
        creator_uuid: {
          equals: uid,
        },
        name: {
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
          name: item.name,
          image: item.image,
          type: item.type,
          content: content == null ? null : {
            id: content.id,
            creator: {
              userId: content.creator_user_id,
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
    const itemData = await prisma.tobiratory_digital_items.findUnique({
      where: {
        id: parseInt(id),
        creator_uuid: uid,
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
    const resData = {
      id: id,
      name: itemData.name,
      image: itemData.image,
      type: itemData.type,
      content: contentData==null ? null : {
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
  const {name, image, type} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const item = await prisma.tobiratory_digital_items.create({
      data: {
        creator_uuid: uid,
        name: name,
        image: image,
        type: type,
        content_id: 0,
        saidan_id: 0,
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
  const {id} = req.params;
  const {authorization} = req.headers;
  const {itemData} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const item = await prisma.tobiratory_digital_items.update({
      where: {
        id: parseInt(id),
        creator_uuid: uid,
      },
      data: {
        name: itemData.name,
        image: itemData.image,
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

export const createModel = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {materialId, type}:{materialId: number, type: "poster"|"acrylic"|"badge"} = req.body;
  const predefinedModel = "https://storage.googleapis.com/tobiratory-dev_media/item-models/poster/poster.glb";
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    if (type == "poster") {
      res.status(200).send({
        status: "success",
        data: {
          modelUrl: predefinedModel,
        },
      });
      return;
    }
    console.log(uid, materialId);

    // const modelData = await createModelCloud(materialId, type);
    res.status(200).send({
      status: "success",
      data: {
        modelUrl: predefinedModel, // modelData.modelUrl,
      },
    });
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};


export const createSample = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {
    thumbUrl,
    modelUrl,
    materialId,
    type,
  }: {thumbUrl: string, modelUrl: string, materialId: number, type: "poster"|"acrylic"|"badge"} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const sample = await prisma.tobiratory_samples.create({
        data: {
          creator_uuid: uid,
          thumb_url: thumbUrl,
          model_url: modelUrl,
          material_id: materialId,
          type: type,
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          id: sample.id,
          thumbUrl: sample.thumb_url,
          modelUrl: sample.model_url,
          materialId: sample.material_id,
          type: sample.type,
        },
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
    return;
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const getMySamples = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const samples = await prisma.tobiratory_samples.findMany({
        where: {
          creator_uuid: uid,
        },
      });
      const returnData = samples.map((sample)=>{
        return {
          id: sample.id,
          thumbUrl: sample.thumb_url,
          modelUrl: sample.model_url,
          materialId: sample.material_id,
          type: sample.type,
        };
      });
      res.status(200).send({
        status: "success",
        data: returnData,
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
      return;
    }
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const deleteSample = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const item = await prisma.tobiratory_samples.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (item==null) {
        res.status(401).send({
          status: "error",
          data: {
            result: "not-exist",
          },
        });
        return;
      }
      if (item.creator_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: {
            result: "not-yours",
          },
        });
        return;
      }
      await prisma.tobiratory_samples.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          result: "deleted",
        },
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: {
          result: error,
        },
      });
    }
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: {
        result: error.code,
      },
    });
    return;
  });
};
