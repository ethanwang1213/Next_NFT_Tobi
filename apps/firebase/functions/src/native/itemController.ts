import axios from "axios";
import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";
import {statusOfSample} from "./utils";

interface ModelApiResponse {
  url: string;
}

export const ModelRequestType = {
  AcrylicStand: "acrylic_stand",
  MessageCard: "message_card",
  RemoveBg: "remove_bg",
} as const;

export type ModelRequestType = (typeof ModelRequestType)[keyof typeof ModelRequestType];

export const modelApiHandler = (type: ModelRequestType) => {
  return async (req: Request, res: Response) => {
    const modelApiUrl = process.env.MODEL_API_URL;
    const token = process.env.MODEL_API_TOKEN;
    if (!modelApiUrl || !token) {
      res.status(500).send({
        status: "error",
        data: "invalid-system-settings",
      });
      return;
    }
    const {authorization} = req.headers;
    await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
      const uid = decodedToken.uid;
      switch (type) {
        case ModelRequestType.AcrylicStand:
          createAcrylicStand(req, res, uid, modelApiUrl, token);
          break;
        case ModelRequestType.MessageCard:
          createMessageCard(req, res, uid, modelApiUrl, token);
          break;
        case ModelRequestType.RemoveBg:
          removeBackground(req, res, uid, modelApiUrl, token);
          break;
      }
    }).catch((error: FirebaseError) => {
      res.status(401).send({
        status: "error",
        data: error.code,
      });
      return;
    });
  };
};

const createAcrylicStand = async (req: Request, res: Response, uid: string, modelApiUrl: string, token: string) => {
  const {bodyUrl, baseUrl, coords}: { bodyUrl: string, baseUrl?: string, coords?: string } = req.body;

  if (!bodyUrl) {
    res.status(400).send({
      status: "error",
      data: "invalid-params",
    });
    return;
  }
  const params: Record<string, string | undefined> = {
    uid,
    token,
    process_type: ModelRequestType.AcrylicStand,
    image1: bodyUrl,
    image2: baseUrl,
    coords1: coords,
  };
  const urlParams = new URLSearchParams();
  Object.keys(params).forEach((key)=>{
    if (params[key]) {
      urlParams.append(key, params[key] as string);
    }
  });
  const requestUrl = `${modelApiUrl}?${urlParams.toString()}`;
  try {
    const apiResponse = await axios.post<ModelApiResponse>(requestUrl);
    res.status(200).send({
      status: "success",
      data: {
        url: apiResponse.data.url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      data: "api-error",
    });
  }
};

const createMessageCard = async (req: Request, res: Response, uid: string, modelApiUrl: string, token: string) => {
  const {url}: { url: string} = req.body;

  if (!url) {
    res.status(400).send({
      status: "error",
      data: "invalid-params",
    });
    return;
  }

  const params: Record<string, string> = {
    uid,
    token,
    process_type: ModelRequestType.MessageCard,
    image1: url,
  };
  const urlParams = new URLSearchParams();
  Object.keys(params).forEach((key)=>{
    if (params[key]) {
      urlParams.append(key, params[key] as string);
    }
  });
  const requestUrl = `${modelApiUrl}?${urlParams.toString()}`;
  try {
    const apiResponse = await axios.post<ModelApiResponse>(requestUrl);
    res.status(200).send({
      status: "success",
      data: {
        url: apiResponse.data.url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      data: "api-error",
    });
  }
};

export const removeBackground = async (req: Request, res: Response, uid: string, modelApiUrl: string, token: string) => {
  const {url}: { url: string } = req.body;

  if (!url) {
    res.status(400).send({
      status: "error",
      data: "invalid-params",
    });
    return;
  }
  const params: Record<string, string> = {
    uid,
    token,
    process_type: ModelRequestType.RemoveBg,
    image1: url,
  };
  const urlParams = new URLSearchParams();
  Object.keys(params).forEach((key)=>{
    if (params[key]) {
      urlParams.append(key, params[key] as string);
    }
  });
  const requestUrl = `${modelApiUrl}?${urlParams.toString()}`;
  try {
    const apiResponse = await axios.post<ModelApiResponse>(requestUrl);
    res.status(200).send({
      status: "success",
      data: {
        url: apiResponse.data.url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      data: "api-error",
    });
  }
};

export const createDigitalItem = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {
    thumbUrl,
    modelUrl,
    materialId,
    type,
  }: { thumbUrl: string, modelUrl: string, materialId: number, type: number } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          owner_uuid: uid,
        },
      });
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
          content_id: content ? content.id : 0,
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          id: sample.id,
          thumbUrl: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const getMyDigitalItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const samples = await prisma.tobiratory_sample_items.findMany({
        where: {
          owner_uuid: uid,
          is_deleted: false,
        },
        include: {
          digital_item: true,
        },
      });
      const returnData = samples.map((sample) => {
        return {
          id: sample.id,
          name: sample.digital_item.name,
          description: sample.digital_item.description,
          thumbUrl: sample.digital_item.is_default_thumb ? sample.digital_item.default_thumb_url : sample.digital_item.custom_thumb_url,
          modelUrl: sample?.model_url,
          materialId: sample.digital_item.material_id,
          type: sample.digital_item.type,
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
  }).catch((error: FirebaseError) => {
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
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const item = await prisma.tobiratory_sample_items.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (item == null) {
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
  }).catch((error: FirebaseError) => {
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
  const {digitalStatus}: { digitalStatus: number } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      if (digitalStatus < 5) {
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
  }).catch((error: FirebaseError) => {
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
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.tobiratory_businesses.findUnique({
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
        include: {
          digital_item: true,
        },
      });
      const returnData = allSamples.map((sample) => {
        return {
          id: sample.id,
          name: sample.digital_item.name,
          thumbnail: sample.digital_item.is_default_thumb ? sample.digital_item.default_thumb_url : sample.digital_item.custom_thumb_url,
          price: sample.price,
          status: sample.digital_item.status,
          saleStartDate: sample.start_date,
          saleEndDate: sample.end_date,
          saleQuantity: sample.sale_quantity,
          quantityLimit: sample.digital_item.limit,
          createDate: sample.created_date_time,
        };
      });
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
  }).catch((error: FirebaseError) => {
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
  const {sampleIds}: { sampleIds: number[] } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
        if (sample == null) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-exist",
            },
          });
          return;
        }
        if (sample.content_id != content?.id) {
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
  }).catch((error: FirebaseError) => {
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
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
        include: {
          digital_item: {
            include: {
              copyright: {
                include: {
                  copyright: true,
                },
              },
            },
          },
        },
      });
      if (!sample) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const copyrights = sample.digital_item.copyright.map((relate) => {
        return {
          id: relate.copyright.id,
          name: relate.copyright.copyright_name,
        };
      });
      const returnData = {
        id: sample.id,
        name: sample.digital_item.name,
        content: {
          id: content?.id,
          name: content?.name,
          description: content?.description,
        },
        description: sample.digital_item.description,
        modelUrl: sample.model_url,
        defaultThumbnailUrl: sample.digital_item.default_thumb_url,
        customThumbnailUrl: sample.digital_item.custom_thumb_url,
        isCustomThumbnailSelected: !sample.digital_item.is_default_thumb,
        price: sample.price,
        status: sample.digital_item.status,
        startDate: sample.start_date,
        endDate: sample.end_date,
        quantityLimit: sample.digital_item.limit,
        license: sample.digital_item.license,
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
  }).catch((error: FirebaseError) => {
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
  }: {
    name?: string,
    description?: string,
    customThumbnailUrl?: string,
    isCustomThumbnailSelected?: boolean,
    price?: number,
    status?: number,
    startDate?: string,
    endDate?: string,
    quantityLimit?: number,
    license?: string,
    copyrights?: { id: number | null, name: string }[],
  } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
      const sample = await prisma.tobiratory_sample_items.findUnique({
        where: {
          id: parseInt(sampleId),
        },
        include: {
          digital_item: true,
        },
      });
      if (!sample) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (sample.owner_uuid != uid) {
        res.status(404).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }
      if (price || startDate || endDate) {
        await prisma.tobiratory_sample_items.update({
          where: {
            id: parseInt(sampleId),
            content_id: content?.id,
            is_deleted: false,
          },
          data: {
            price: price,
            start_date: startDate == undefined ? undefined : new Date(startDate),
            end_date: endDate == undefined ? undefined : new Date(endDate),
          },
        });
      }
      if (name || description || customThumbnailUrl || isCustomThumbnailSelected || status || license || quantityLimit) {
        await prisma.tobiratory_digital_items.update({
          where: {
            id: sample?.digital_item_id,
          },
          data: {
            name: name,
            description: description,
            custom_thumb_url: customThumbnailUrl,
            is_default_thumb: !isCustomThumbnailSelected,
            status: status,
            license: license,
            limit: quantityLimit,
          },
        });
      }
      if (copyrights) {
        await prisma.tobiratory_digital_items_copyright.deleteMany({
          where: {
            digital_item_id: sample.digital_item_id,
          },
        });
        await Promise.all(
            copyrights.map(async (copyright) => {
              const selectedCopyright = await prisma.tobiratory_copyright.upsert({
                where: {
                  id: copyright.id ?? 0,
                },
                update: {},
                create: {
                  copyright_name: copyright.name,
                  content_id: content.id,
                },
              });
              await prisma.tobiratory_digital_items_copyright.create({
                data: {
                  digital_item_id: sample.digital_item_id,
                  copyright_id: selectedCopyright.id,
                },
              });
            })
        );
      }
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: {
        result: error.code,
      },
    });
    return;
  });
};

export const adminGetAllDigitalItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.tobiratory_businesses.findUnique({
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
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-exist-content",
        });
        return;
      }
      const allDigitalItems = await prisma.tobiratory_digital_items.findMany({
        where: {
          creator_uuid: uid,
        },
        include: {
          sample_item: true,
        },
      });
      const returnData = allDigitalItems.map((digitalItem) => {
        return {
          id: digitalItem.id,
          name: digitalItem.name,
          thumbnail: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
          price: digitalItem.sample_item?.price,
          status: digitalItem.status,
          saleStartDate: digitalItem.sample_item?.start_date,
          saleEndDate: digitalItem.sample_item?.end_date,
          saleQuantity: digitalItem.sample_item?.sale_quantity,
          quantityLimit: digitalItem.limit,
          mintedCount: digitalItem.minted_count,
          createDate: digitalItem.created_date_time,
        };
      });
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: {
        result: error.code,
      },
    });
    return;
  });
};

export const adminDeleteDigitalItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {digitalItemIds}: { digitalItemIds: number[] } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-exist-content",
        });
        return;
      }
      for (const item of digitalItemIds) {
        const digitalItem = await prisma.tobiratory_digital_items.findUnique({
          where: {
            id: item,
          },
        });
        if (digitalItem == null) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-exist",
            },
          });
          return;
        }
        if (digitalItem.creator_uuid != uid) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-owner",
            },
          });
          return;
        }
      }
      await prisma.tobiratory_digital_items.updateMany({
        where: {
          id: {
            in: digitalItemIds,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: {
        result: error.code,
      },
    });
    return;
  });
};

export const adminDetailOfDigitalItem = async (req: Request, res: Response) => {
  const {digitalId} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-exist-content",
        });
        return;
      }
      const digitalItem = await prisma.tobiratory_digital_items.findUnique({
        where: {
          id: parseInt(digitalId),
          is_deleted: false,
        },
        include: {
          copyright: {
            include: {
              copyright: true,
            },
          },
          sample_item: true,
        },
      });
      if (!digitalItem) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const copyrights = digitalItem.copyright.map((relate) => {
        return {
          id: relate.copyright.id,
          name: relate.copyright.copyright_name,
        };
      });
      const returnData = {
        id: digitalItem.id,
        name: digitalItem.name,
        content: {
          id: content?.id,
          name: content?.name,
          description: content?.description,
        },
        description: digitalItem.description,
        defaultThumbnailUrl: digitalItem.default_thumb_url,
        customThumbnailUrl: digitalItem.custom_thumb_url,
        isCustomThumbnailSelected: !digitalItem.is_default_thumb,
        price: digitalItem.sample_item?.price,
        status: digitalItem.status,
        startDate: digitalItem.sample_item?.start_date,
        endDate: digitalItem.sample_item?.end_date,
        schedules: digitalItem.schedules.map((schedule)=>{
          return JSON.parse(schedule);
        }),
        quantityLimit: digitalItem.limit,
        license: digitalItem.license,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: {
        result: error.code,
      },
    });
    return;
  });
};

export const adminUpdateDigitalItem = async (req: Request, res: Response) => {
  const {digitalId} = req.params;
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
    schedules,
  }: {
    name?: string,
    description?: string,
    customThumbnailUrl?: string,
    isCustomThumbnailSelected?: boolean,
    price?: number,
    status?: number,
    startDate?: string,
    endDate?: string,
    quantityLimit?: number,
    license?: string,
    copyrights?: { id: number | null, name: string }[],
    schedules?: {
      status: number,
      datetime: string,
    }[],
  } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
          data: "not-exist-content",
        });
        return;
      }
      const digitalItem = await prisma.tobiratory_digital_items.findUnique({
        where: {
          id: parseInt(digitalId),
        },
        include: {
          sample_item: true,
        }
      });
      if (!digitalItem) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (digitalItem.creator_uuid != uid) {
        res.status(404).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }
      if (status) {
        if (status<=1||status>=7) {
          res.status(401).send({
            status: "error",
            data: "wrong-status",
          });
          return;
        }
        if ([statusOfSample.private, statusOfSample.draft].includes(digitalItem.status) && status ==statusOfSample.unListed) {
          res.status(401).send({
            status: "error",
            data: "wrong-status",
          });
          return;
        }
      }
      if (schedules&&schedules.length>2) {
        for (let i = 0; i < schedules.length; i++) {
          const element1 = schedules[i];
          for (let j = i + 1; j < schedules.length; j++) {
            const element2 = schedules[j];
            if (element1.datetime==element2.datetime) {
              res.status(401).send({
                status: "error",
                data: "wrong-schedule",
              });
              return;
            }
          }
        }
      }
      if (price || startDate || endDate) {
        await prisma.tobiratory_sample_items.update({
          where: {
            id: digitalItem.sample_item?.id??0,
            content_id: content?.id,
            is_deleted: false,
          },
          data: {
            price: price,
            start_date: startDate == undefined ? undefined : new Date(startDate),
            end_date: endDate == undefined ? undefined : new Date(endDate),
          },
        });
      }
      if (name || description || customThumbnailUrl || isCustomThumbnailSelected || status || license || schedules || quantityLimit) {
        await prisma.tobiratory_digital_items.update({
          where: {
            id: parseInt(digitalId),
          },
          data: {
            name: name,
            description: description,
            custom_thumb_url: customThumbnailUrl,
            is_default_thumb: !isCustomThumbnailSelected,
            status: status,
            limit: quantityLimit,
            license: license,
            schedules: schedules?.map((schedule) => {
              return JSON.stringify(schedule);
            }),
          },
        });
      }
      if (copyrights) {
        await prisma.tobiratory_digital_items_copyright.deleteMany({
          where: {
            digital_item_id: parseInt(digitalId),
          },
        });
        await Promise.all(
            copyrights.map(async (copyright) => {
              const selectedCopyright = await prisma.tobiratory_copyright.upsert({
                where: {
                  id: copyright.id ?? 0,
                },
                update: {},
                create: {
                  copyright_name: copyright.name,
                  content_id: content.id,
                },
              });
              await prisma.tobiratory_digital_items_copyright.create({
                data: {
                  digital_item_id: parseInt(digitalId),
                  copyright_id: selectedCopyright.id,
                },
              });
            })
        );
      }
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: {
        result: error.code,
      },
    });
    return;
  });
};

export const getSampleInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      const sampleData = await prisma.tobiratory_sample_items.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          digital_item: {
            include: {
              copyright: {
                include: {
                  copyright: true,
                },
              },
            },
          },
          user: true,
        },
      });
      if (!sampleData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const returnData = {
        id: sampleData.id,
        title: sampleData.digital_item.name,
        description: sampleData.digital_item.description,
        modelType: sampleData.digital_item.type,
        modelUrl: sampleData.model_url,
        thumbUrl: sampleData.digital_item.is_default_thumb?sampleData.digital_item.default_thumb_url:sampleData.digital_item.custom_thumb_url,
        creator: {
          uuid: sampleData.user.uuid,
          username: sampleData.user.username,
        },
        copyrights: sampleData.digital_item.copyright.map((copy) => {
          return {
            id: copy.copyright_id,
            name: copy.copyright.copyright_name,
          };
        }),
        license: sampleData.digital_item.license,
        price: sampleData.price,
        dateAcquired: sampleData.created_date_time,
      };
      res.status(200).send({
        status: "success",
        data: returnData,
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
    return;
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};
