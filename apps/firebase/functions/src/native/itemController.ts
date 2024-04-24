import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";

export const createModel = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {materialId, type}:{materialId: number, type: number} = req.body;
  const predefinedModel = "https://storage.googleapis.com/tobiratory-dev_media/item-models/poster/poster.glb";
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    console.log(uid, materialId, type);

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

export const createDigitalItem = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {
    thumbUrl,
    modelUrl,
    materialId,
    type,
  }: {thumbUrl: string, modelUrl: string, materialId: number, type: number} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const digitalItem = await prisma.tobiratory_digital_items.create({
        data: {
          creator_uuid: uid,
          default_thumb_url: thumbUrl,
          custom_thumb_url: thumbUrl,
          material_id: materialId,
          type: type,
          status: 1,
        },
      });
      const sample = await prisma.tobiratory_sample_items.create({
        data: {
          digital_item_id: digitalItem.id,
          model_url: modelUrl,
          owner_uuid: uid,
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          id: sample.id,
          thumbUrl: digitalItem.is_default_thumb?digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
          modelUrl: sample.model_url,
          materialId: digitalItem.material_id,
          type: digitalItem.type,
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

export const getMyDigitalItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const samples = await prisma.tobiratory_sample_items.findMany({
        where: {
          owner_uuid: uid,
          is_deleted: false,
        },
      });
      const returnData = await Promise.all(
          samples.map(async (sample)=>{
            const digitalItem = await prisma.tobiratory_digital_items.findUnique({
              where: {
                id: sample.digital_item_id,
              },
            });
            return {
              id: sample.id,
              thumbUrl: digitalItem?.is_default_thumb?digitalItem?.default_thumb_url : digitalItem?.custom_thumb_url,
              modelUrl: sample?.model_url,
              materialId: digitalItem?.material_id,
              type: digitalItem?.type,
            };
          })
      );
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

export const deleteDigitalItem = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const item = await prisma.tobiratory_sample_items.findUnique({
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
      if (item.owner_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: {
            result: "not-yours",
          },
        });
        return;
      }
      await prisma.tobiratory_sample_items.update({
        where: {
          id: parseInt(id),
        },
        data: {
          is_deleted: true,
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

export const adminChangeDigitalStatus = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {digitalStatus}:{digitalStatus: number} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      if (digitalStatus<5) {
        res.status(401).send({
          status: "error",
          data: "invalid-statusCode",
        });
      }
      await prisma.tobiratory_digital_items.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: digitalStatus,
        },
      });
      res.status(200).send({
        status: "success",
        data: digitalStatus,
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

export const adminGetAllSamples = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.tobiratory_businesses.findFirst({
        where: {
          uuid: uid,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const content = await prisma.tobiratory_contents.findFirst({
        where: {
          owner_uuid: uid,
        },
      });
      const allSamples = await prisma.tobiratory_sample_items.findMany({
        where: {
          content_id: content?.id,
          is_deleted: false,
        },
      });
      const returnData = await Promise.all(
          allSamples.map(async (sample) => {
            const digitalItem = await prisma.tobiratory_digital_items.findFirst({
              where: {
                id: sample.digital_item_id,
              },
            });
            return {
              id: sample.id,
              name: digitalItem?.name,
              thumbnail: digitalItem?.is_default_thumb?digitalItem?.default_thumb_url : digitalItem?.custom_thumb_url,
              price: sample.price,
              status: digitalItem?.status,
              saleStartDate: sample.start_date,
              saleEndDate: sample.end_date,
              saleQuantity: sample.sale_quantity,
              quantityLimit: sample.quantity_limit,
              createDate: sample.created_date_time,
            };
          })
      );
      res.status(200).send({
        status: "success",
        data: returnData,
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

export const adminDeleteSamples = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {sampleIds}: {sampleIds: number[]} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.tobiratory_businesses.findFirst({
        where: {
          uuid: uid,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const content = await prisma.tobiratory_contents.findFirst({
        where: {
          owner_uuid: uid,
        },
      });
      for (const item of sampleIds) {
        const sample = await prisma.tobiratory_sample_items.findUnique({
          where: {
            id: item,
          },
        });
        if (sample==null) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-exist",
            },
          });
          return;
        }
        if (sample.content_id!=content?.id) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-content",
            },
          });
          return;
        }
      }
      await prisma.tobiratory_sample_items.updateMany({
        where: {
          id: {
            in: sampleIds,
          },
        },
        data: {
          is_deleted: true,
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

export const adminDetailOfSample = async (req: Request, res: Response) => {
  const {sampleId} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.tobiratory_businesses.findFirst({
        where: {
          uuid: uid,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const content = await prisma.tobiratory_contents.findFirst({
        where: {
          owner_uuid: uid,
        },
      });
      const sample = await prisma.tobiratory_sample_items.findUnique({
        where: {
          id: parseInt(sampleId),
          content_id: content?.id,
          is_deleted: false,
        },
      });
      if (!sample) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const digitalItemData = await prisma.tobiratory_digital_items.findUnique({
        where: {
          id: sample.digital_item_id,
        },
      });
      if (!digitalItemData) {
        res.status(401).send({
          status: "error",
          data: "not-exist-digital-item",
        });
        return;
      }
      const copyrightRelate = await prisma.tobiratory_digital_items_copyright.findMany({
        where: {
          digital_item_id: digitalItemData.id,
        },
      });
      const copyrights = await Promise.all(
          copyrightRelate.map(async (relate)=>{
            const copyrightData = await prisma.tobiratory_copyright.findUnique({
              where: {
                id: relate.copyright_id,
              },
            });
            return copyrightData?.copyright_name;
          })
      );
      const returnData = {
        id: sample.id,
        name: digitalItemData.name,
        description: digitalItemData.description,
        defaultThumbnailUrl: digitalItemData.default_thumb_url,
        customThumbnailUrl: digitalItemData.custom_thumb_url,
        isCustomThumbnailSelected: digitalItemData.is_default_thumb,
        price: sample.price,
        status: digitalItemData.status,
        startDate: sample.start_date,
        endDate: sample.end_date,
        quantityLimit: sample.quantity_limit,
        license: digitalItemData.license,
        copyrights: copyrights,
      };
      res.status(200).send({
        status: "success",
        data: returnData,
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

export const adminUpdateSample = async (req: Request, res: Response) => {
  const {sampleId} = req.params;
  const {authorization} = req.headers;
  const {
    name,
    description,
    customThumbnailUrl,
    isCustomThumbnailSelected,
    price,
    status,
    startDate,
    endDate,
    quantityLimit,
    license,
    copyrights,
  }:{
    name: string,
    description: string,
    customThumbnailUrl: string,
    isCustomThumbnailSelected: boolean,
    price: number,
    status: number,
    startDate: string | undefined,
    endDate: string | undefined,
    quantityLimit: number,
    license: string,
    copyrights: string[],
  }=req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.tobiratory_businesses.findFirst({
        where: {
          uuid: uid,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          owner_uuid: uid,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const sample = await prisma.tobiratory_sample_items.update({
        where: {
          id: parseInt(sampleId),
          content_id: content?.id,
          is_deleted: false,
        },
        data: {
          price: price,
          start_date: startDate==undefined?undefined:new Date(startDate),
          end_date: endDate==undefined?undefined:new Date(endDate),
          quantity_limit: quantityLimit,
        },
      });
      if (!sample) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const digitalItemData = await prisma.tobiratory_digital_items.update({
        where: {
          id: sample.digital_item_id,
        },
        data: {
          name: name,
          description: description,
          custom_thumb_url: customThumbnailUrl,
          is_default_thumb: !isCustomThumbnailSelected,
          status: status,
          license: license,
        },
      });
      if (!digitalItemData) {
        res.status(401).send({
          status: "error",
          data: "not-exist-digital-item",
        });
        return;
      }
      await prisma.tobiratory_digital_items_copyright.deleteMany({
        where: {
          digital_item_id: digitalItemData.id,
        },
      });
      await Promise.all(
          copyrights.map(async (copyrightName)=>{
            const selectedCopyright = await prisma.tobiratory_copyright.upsert({
              where: {
                copyright_name: copyrightName,
              },
              update: {},
              create: {
                copyright_name: copyrightName,
                content_id: content.id,
              },
            });
            await prisma.tobiratory_digital_items_copyright.create({
              data: {
                digital_item_id: digitalItemData.id,
                copyright_id: selectedCopyright.id,
              },
            });
          })
      );
      res.status(200).send({
        status: "success",
        data: "updated",
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
