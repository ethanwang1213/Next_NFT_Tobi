import axios from "axios";
import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";
import {allowedExtension, checkUri, digitalItemStatus} from "./utils";
import * as AdmZip from "adm-zip";
import * as admin from "firebase-admin";
import {limitModelSize} from "../lib/constants";

interface ModelApiResponse {
  url: string;
}

export const ModelRequestType = {
  AcrylicStand: "acrylic_stand",
  AcrylicKeychain: "acrylic_keychain",
  MessageCard: "message_card",
  RemoveBg: "remove_bg",
  UserUploaded: "uploaded",
} as const;

export type ModelRequestType = (typeof ModelRequestType)[keyof typeof ModelRequestType];

export const modelApiHandler = (type: ModelRequestType) => {
  return async (req: Request, res: Response) => {
    const modelApiUrl = process.env.MODEL_API_URL;
    const token = process.env.MODEL_API_TOKEN;
    if (!modelApiUrl || !token) {
      console.error("invalid-system-settings: modelApiUrl and token are required");
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
        case ModelRequestType.AcrylicKeychain:
          createAcrylicKeyChain(req, res, uid, modelApiUrl, token);
          break;
        case ModelRequestType.MessageCard:
          createMessageCard(req, res, uid, modelApiUrl, token);
          break;
        case ModelRequestType.RemoveBg:
          removeBackground(req, res, uid, modelApiUrl, token);
          break;
      }
    }).catch((error: FirebaseError) => {
      console.error(error);
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
    console.error("invalid-params: bodyUrl is required");
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
  Object.keys(params).forEach((key) => {
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

const createAcrylicKeyChain = async (req: Request, res: Response, uid: string, modelApiUrl: string, token: string) => {
  const {bodyUrl, coords}: { bodyUrl: string, coords: string } = req.body;

  if (!bodyUrl || !coords) {
    console.error(`invalid-params: coords and bodyUrl are required: coords: ${coords}, bodyUrl: ${bodyUrl}`);
    res.status(400).send({
      status: "error",
      data: "invalid-params",
    });
    return;
  }
  const params: Record<string, string | undefined> = {
    uid,
    token,
    process_type: ModelRequestType.AcrylicKeychain,
    image1: bodyUrl,
    coords1: coords,
  };
  const urlParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
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
  const {url}: { url: string } = req.body;

  if (!url) {
    console.error("invalid-params: url is required");
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
  Object.keys(params).forEach((key) => {
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
    console.error("invalid-params: url is required");
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
  Object.keys(params).forEach((key) => {
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
    croppedUrl,
    materialId,
    type,
  }: { thumbUrl: string, modelUrl: string, croppedUrl?: string, materialId?: number, type: number } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const content = await prisma.contents.findUnique({
        where: {
          businesses_uuid: uid,
          is_approved: true,
          is_deleted: false,
        },
        include: {
          copyrights: true,
          license: true,
        },
      });
      const digitalItem = await prisma.digital_items.create({
        data: {
          account_uuid: uid,
          default_thumb_url: thumbUrl,
          custom_thumb_url: thumbUrl,
          model_url: modelUrl,
          cropped_url: croppedUrl,
          material_id: materialId,
          metadata_status: digitalItemStatus.draft,
          type: type,
          sample_item: {
            create: {},
          },
          copyrights: content?{
            createMany: {
              data: content?.copyrights.map((copyright)=>{
                return {copyright_id: copyright.id};
              }),
            },
          }:undefined,
          license: (content&&content.license)?{
            create: {
              com: content.license?.com,
              adp: content.license?.adp,
              der: content.license?.der,
              dst: content.license?.dst,
              mer: content.license?.mer,
              ncr: content.license?.ncr,
            },
          }:undefined,
        },
        include: {
          material_image: true,
          sample_item: true,
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          digitalItemId: digitalItem.id,
          sampleItemId: digitalItem.sample_item?.id,
          thumbUrl: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
          materialUrl: digitalItem.material_image?.image,
          croppedUrl: digitalItem.cropped_url,
          modelUrl: digitalItem.model_url,
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
      const digitalItems = await prisma.digital_items.findMany({
        where: {
          account_uuid: uid,
          is_deleted: false,
          sample_item: {
            is_deleted: false,
          },
        },
        include: {
          material_image: true,
          sample_item: true,
          sales: {
            where: {
              schedule_start_time: {
                lt: new Date(),
              },
            },
            orderBy: {
              schedule_start_time: "desc",
            },
            take: 1,
          },
        },
      });
      const returnData = digitalItems.map((digitalItem) => {
        return {
          digitalItemId: digitalItem.id,
          sampleItemId: digitalItem.sample_item?.id,
          name: digitalItem.name,
          description: digitalItem.description,
          thumbUrl: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
          materialUrl: digitalItem.material_image?.image,
          modelUrl: digitalItem.model_url,
          croppedUrl: digitalItem.cropped_url,
          materialId: digitalItem.material_id,
          saleQuantity: digitalItem.sale_quantity,
          quantityLimit: digitalItem.limit,
          status: digitalItem.sales.length > 0 ? digitalItem.sales[0].status : digitalItem.metadata_status,
          type: digitalItem.type,
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
      const digitalItem = await prisma.digital_items.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
      });
      if (!digitalItem) {
        res.status(404).send({
          status: "error",
          data: {
            result: "not-exist",
          },
        });
        return;
      }
      if (digitalItem.account_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: {
            result: "not-yours",
          },
        });
        return;
      }
      await prisma.digital_items.update({
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
  const {status}: { status: number } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      if (status > digitalItemStatus.onSale || status < digitalItemStatus.hidden) {
        res.status(401).send({
          status: "error",
          data: "invalid-status-code",
        });
      }
      await prisma.digital_items.update({
        where: {
          id: parseInt(id),
          is_deleted: false,
          sample_item: {
            is_deleted: false,
          },
        },
        data: {
          sales: {
            create: {
              status: status,
              schedule_start_time: new Date(),
            },
          },
        },
      });
      res.status(200).send({
        status: "success",
        data: "changed",
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
      const admin = await prisma.businesses.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const allDigitalItems = await prisma.digital_items.findMany({
        where: {
          account_uuid: uid,
          is_deleted: false,
          sample_item: {
            is_deleted: false,
          },
        },
        include: {
          sales: {
            where: {
              schedule_start_time: {
                lt: new Date(),
              },
            },
            orderBy: {
              schedule_start_time: "desc",
            },
            take: 1,
          },
          material_image: true,
        },
      });
      const returnData = allDigitalItems.map((digitalItem) => {
        return {
          id: digitalItem.id,
          name: digitalItem.name,
          thumbUrl: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
          materialUrl: digitalItem.material_image?.image,
          price: digitalItem.sales.length > 0 ? digitalItem.sales[0].price : null,
          status: digitalItem.sales.length > 0 ? digitalItem.sales[0].status : digitalItem.metadata_status,
          saleQuantity: digitalItem.sale_quantity,
          quantityLimit: digitalItem.limit,
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

export const adminDeleteSamples = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {sampleIds}: { sampleIds: number[] } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      for (const item of sampleIds) {
        const sample = await prisma.sample_items.findUnique({
          where: {
            id: item,
          },
          include: {
            digital_item: true,
          },
        });
        if (!sample) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-exist",
            },
          });
          return;
        }
        if (sample.digital_item.account_uuid != uid) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-content",
            },
          });
          return;
        }
      }
      await prisma.sample_items.updateMany({
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
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: true,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const sample = await prisma.sample_items.findUnique({
        where: {
          id: parseInt(sampleId),
          is_deleted: false,
        },
        include: {
          digital_item: {
            include: {
              material_image: true,
              sales: {
                where: {
                  schedule_start_time: {
                    lt: new Date(),
                  },
                },
                orderBy: {
                  schedule_start_time: "desc",
                },
                take: 1,
              },
              copyrights: {
                include: {
                  copyright: true,
                },
              },
              license: true,
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
      const copyrights = sample.digital_item.copyrights.map((relate) => {
        return {
          id: relate.copyright.id,
          name: relate.copyright.name,
        };
      });
      const returnData = {
        id: sample.id,
        name: sample.digital_item.name,
        content: {
          id: admin.content?.id,
          name: admin.content?.name,
          description: admin.content?.description,
        },
        description: sample.digital_item.description,
        modelUrl: sample.digital_item.model_url,
        defaultThumbnailUrl: sample.digital_item.default_thumb_url,
        customThumbnailUrl: sample.digital_item.custom_thumb_url,
        isCustomThumbnailSelected: !sample.digital_item.is_default_thumb,
        materialUrl: sample.digital_item.material_image?.image,
        price: sample.digital_item.sales.length > 0 ? sample.digital_item.sales[0].price : null,
        status: sample.digital_item.sales.length > 0 ? sample.digital_item.sales[0].status : sample.digital_item.metadata_status,
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

export const adminGetAllDigitalItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.businesses.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const allDigitalItems = await prisma.digital_items.findMany({
        where: {
          account_uuid: uid,
          is_deleted: false,
          sample_item: {
            is_deleted: false,
          },
        },
        orderBy: {
          created_date_time: "desc",
        },
        include: {
          sample_item: true,
          material_image: true,
          sales: {
            where: {
              schedule_start_time: {
                lt: new Date(),
              },
            },
            orderBy: {
              schedule_start_time: "desc",
            },
            take: 1,
          },
        },
      });
      const returnData = allDigitalItems.map((digitalItem) => {
        return {
          id: digitalItem.id,
          name: digitalItem.name,
          thumbUrl: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
          modelUrl: digitalItem.model_url,
          croppedUrl: digitalItem.cropped_url,
          modelType: digitalItem.type,
          materialUrl: digitalItem.material_image?.image,
          price: digitalItem.sales.length > 0 ? digitalItem.sales[0].price : null,
          status: digitalItem.sales.length > 0 ? digitalItem.sales[0].status : digitalItem.metadata_status,
          saleQuantity: digitalItem.sale_quantity,
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
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      for (const item of digitalItemIds) {
        const digitalItem = await prisma.digital_items.findUnique({
          where: {
            id: item,
            is_deleted: false,
          },
        });
        if (!digitalItem) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-exist",
            },
          });
          return;
        }
        if (digitalItem.account_uuid != uid) {
          res.status(401).send({
            status: "error",
            data: {
              result: "not-owner",
            },
          });
          return;
        }
      }
      await prisma.digital_items.updateMany({
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
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: true,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const digitalItem = await prisma.digital_items.findUnique({
        where: {
          id: parseInt(digitalId),
          is_deleted: false,
          sample_item: {
            is_deleted: false,
          },
        },
        include: {
          copyrights: {
            include: {
              copyright: true,
            },
          },
          sales: {
            where: {
              schedule_start_time: {
                lt: new Date(),
              },
            },
            orderBy: {
              schedule_start_time: "desc",
            },
            take: 1,
          },
          sample_item: true,
          material_image: true,
          license: true,
        },
      });
      if (!digitalItem || digitalItem.is_deleted) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const copyrights = digitalItem.copyrights.map((relate) => {
        return {
          id: relate.copyright.id,
          name: relate.copyright.name,
        };
      });
      const returnData = {
        id: digitalItem.id,
        name: digitalItem.name,
        content: {
          id: admin.content?.id,
          name: admin.content?.name,
          description: admin.content?.description,
        },
        description: digitalItem.description,
        defaultThumbnailUrl: digitalItem.default_thumb_url,
        customThumbnailUrl: digitalItem.custom_thumb_url,
        croppedUrl: digitalItem.cropped_url,
        isCustomThumbnailSelected: !digitalItem.is_default_thumb,
        modelUrl: digitalItem.model_url,
        meta_model_url: digitalItem.meta_model_url,
        type: digitalItem.type,
        materialUrl: digitalItem.material_image?.image,
        price: digitalItem.sales.length>0?digitalItem.sales[0].price:null,
        status: digitalItem.sales.length>0?digitalItem.sales[0].status:digitalItem.metadata_status,
        schedules: digitalItem.sales.map((schedule) => {
          return {
            id: schedule.id,
            status: schedule.status,
            datetime: schedule.schedule_start_time,
          };
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
    quantityLimit?: number,
    license?: {
      com: boolean,
      adp: boolean,
      der: boolean,
      dst: boolean,
      mer: boolean,
      ncr: boolean,
    },
    copyrights?: { id: number | null, name: string }[],
    schedules?: {
      id: number | null | undefined,
      status: number,
      datetime: string,
    }[],
  } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      // validate if requester is admin
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: true,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      // digital item exist checking
      const digitalItem = await prisma.digital_items.findUnique({
        where: {
          id: parseInt(digitalId),
          is_deleted: false,
          sample_item: {
            is_deleted: false,
          },
        },
        include: {
          sample_item: true,
          sales: {
            where: {
              schedule_start_time: {
                lt: new Date(),
              },
            },
            orderBy: {
              schedule_start_time: "desc",
            },
            take: 1,
          },
        },
      });
      if (!digitalItem || digitalItem.is_deleted) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (digitalItem.account_uuid != uid) {
        res.status(404).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }

      // status validate
      if (status) {
        if (status < digitalItemStatus.hidden || status > digitalItemStatus.onSale) {
          res.status(401).send({
            status: "error",
            data: "wrong-status",
          });
          return;
        }
      }
      if (schedules && schedules.length > 2) {
        for (let i = 0; i < schedules.length; i++) {
          const element1 = schedules[i];
          if (element1.status < digitalItemStatus.hidden || element1.status > digitalItemStatus.onSale) {
            res.status(401).send({
              status: "error",
              data: "wrong-status",
            });
            return;
          }
          for (let j = i + 1; j < schedules.length; j++) {
            const element2 = schedules[j];
            if (element1.datetime == element2.datetime) {
              res.status(401).send({
                status: "error",
                data: "wrong-schedule",
              });
              return;
            }
          }
        }
      }
      if (name || description || customThumbnailUrl || isCustomThumbnailSelected || license || quantityLimit) {
        await prisma.digital_items.update({
          where: {
            id: parseInt(digitalId),
          },
          data: {
            name: name,
            description: description,
            custom_thumb_url: customThumbnailUrl,
            is_default_thumb: !isCustomThumbnailSelected,
            limit: quantityLimit,
            license: {
              upsert: {
                where: {
                  digital_items_id: parseInt(digitalId),
                },
                update: license??{},
                create: license??{
                  com: true,
                  adp: true,
                  der: true,
                  dst: true,
                  mer: true,
                  ncr: true,
                },
              },
            },
          },
        });
      }

      if (schedules) {
        const scheduleIds = schedules.map((schedule)=>{
          return schedule.id??0;
        });
        await prisma.sales.deleteMany({
          where: {
            id: {
              notIn: scheduleIds,
            },
            digital_item_id: parseInt(digitalId),
          },
        });
        await Promise.all(
            schedules.map(async (schedule)=>{
              await prisma.sales.upsert({
                where: {
                  id: schedule.id??0,
                  digital_item_id: digitalItem.id,
                },
                create: {
                  price: price,
                  status: schedule.status,
                  schedule_start_time: new Date(schedule.datetime),
                  digital_item_id: digitalItem.id,
                },
                update: {
                  status: schedule.status,
                  schedule_start_time: new Date(schedule.datetime),
                },
              });
            })
        );
      }

      const currentStatus = digitalItem.sales.length>0?digitalItem.sales[0].status:digitalItem.metadata_status;
      console.log("currentStatus ======>", currentStatus, status);

      if (currentStatus != status && status) {
        const sale = await prisma.sales.create({
          data: {
            digital_item_id: digitalItem.id,
            price: price,
            status: status,
            schedule_start_time: new Date(),
          },
        });
        console.log("created sale ======>", sale);
      }

      if (copyrights) {
        await prisma.digital_items_copyright.deleteMany({
          where: {
            digital_item_id: parseInt(digitalId),
          },
        });
        await Promise.all(
            copyrights.map(async (copyright) => {
              const selectedCopyright = await prisma.copyrights.upsert({
                where: {
                  id: copyright.id ?? 0,
                },
                update: {},
                create: {
                  name: copyright.name,
                  content_id: admin.content?.id ?? 0,
                },
              });
              await prisma.digital_items_copyright.create({
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

export const getDigitalItemInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      const digitalItemData = await prisma.digital_items.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
          sample_item: {
            is_deleted: false,
          },
        },
        include: {
          copyrights: {
            include: {
              copyright: true,
            },
          },
          account: true,
          material_image: true,
          sales: {
            where: {
              schedule_start_time: {
                lt: new Date(),
              },
            },
            orderBy: {
              schedule_start_time: "desc",
            },
            take: 1,
          },
          license: true,
        },
      });
      if (!digitalItemData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const returnData = {
        id: digitalItemData.id,
        name: digitalItemData.name,
        description: digitalItemData.description,
        modelType: digitalItemData.type,
        modelUrl: digitalItemData.model_url,
        thumbUrl: digitalItemData.is_default_thumb ? digitalItemData.default_thumb_url : digitalItemData.custom_thumb_url,
        creator: {
          uuid: digitalItemData.account.uuid,
          username: digitalItemData.account.username,
        },
        copyrights: digitalItemData.copyrights.map((copy) => {
          return {
            id: copy.copyright_id,
            name: copy.copyright.name,
          };
        }),
        license: digitalItemData.license,
        mintCount: digitalItemData.minted_count,
        limit: digitalItemData.limit,
        saleQuantity: digitalItemData.sale_quantity,
        price: digitalItemData.sales.length>0?digitalItemData.sales[0].price: null,
        status: digitalItemData.sales.length>0?digitalItemData.sales[0].status: digitalItemData.metadata_status,
        dateAcquired: digitalItemData.created_date_time,
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

export const handleZipModel = async (req: Request, res: Response) => {
  const {fileUrl} = req.body;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      // Download the zip file
      const response = await axios.get(fileUrl, {responseType: "arraybuffer"});
      console.log("Response code for file URL >>>>>>>>>>>", response.status);

      // Unzip the downloaded file
      const zip = new AdmZip(response.data);
      const entries = zip.getEntries(); // Get all entries in the zip file
      console.log("Entries length >>>>>>>>>>>>>>", entries.length);
      let totalSize = 0;
      entries.forEach((entry) => {
        totalSize += entry.getData().length; // Get the size of each file
      });
      if (totalSize > limitModelSize * 1024 * 1024) {
        res.status(401).send({
          status: "error",
          data: "too-large",
        });
        return;
      }
      let jsonData;
      // Relation with uri and entry
      const relationUri:{
        uri: string,
        beforeUri: string,
        entryName: string,
      }[] = [];
      // Check all exception, update uri
      for (const entry of entries) {
        const buffer = entry.getData(); // Get the data of the entry
        const entryName = entry.entryName;
        console.log("Entry Name >>>>>>>>>>>>", entryName);

        // MacOS and folder exception.
        if (entryName.startsWith("__MACOSX")||buffer.length==0) {
          continue;
        }
        // Check if zip file includes only valid file.
        let flag = false;
        allowedExtension.forEach((extension) => {
          if (entryName.endsWith(extension)) {
            flag = true;
          }
        });
        if (!flag) {
          res.status(401).send({
            status: "error",
            data: "invalid-file",
          });
          return;
        }
        // Check if the entry is a .gltf file and get assets, buffers, images.
        if (entryName.endsWith(".gltf")) {
          // Change buffer to JSON.
          const bufferString = buffer.toString("utf8");

          jsonData = JSON.parse(bufferString); // Convert buffer to JSON
          const version = jsonData.asset.version; // Access assets.version
          if (version != "2.0") {
            res.status(401).send({
              status: "error",
              data: "invalid-version",
            });
            return;
          }

          // Check uri and update uri
          for (let i = 0; i < jsonData.buffers.length; i++) {
            console.log("Buffers before >>>>>>>", jsonData.buffers[i].uri);
            const check = checkUri(jsonData.buffers[i].uri, entries, entryName);
            if (!check) {
              res.status(401).send({
                status: "error",
                data: "invalid-uri",
              });
              return;
            }
            const beforeName = jsonData.buffers[i].uri;
            jsonData.buffers[i].uri = jsonData.buffers[i].uri.split("/").pop();

            // Check if there is file that has same name and update that
            for (let i = 0; i < relationUri.length-1; i++) {
              if (relationUri[i].uri==jsonData.buffers[i].uri) {
                jsonData.buffers[i].uri = jsonData.buffers[i].uri + Date.now();
              }
            }
            relationUri.push({
              uri: jsonData.buffers[i].uri,
              beforeUri: beforeName,
              entryName: check,
            });
            console.log("Buffers after >>>>>>>", jsonData.buffers[i].uri);
          }

          for (let i = 0; i < jsonData.images.length; i++) {
            console.log("Buffers before >>>>>>>", jsonData.images[i].uri);
            const check = checkUri(jsonData.images[i].uri, entries, entryName);
            if (!check) {
              res.status(401).send({
                status: "error",
                data: "invalid-uri",
              });
              return;
            }
            const beforeName = jsonData.images[i].uri;
            jsonData.images[i].uri = jsonData.images[i].uri.split("/").pop();

            // Check if there is file that has same name and update that
            for (let i = 0; i < relationUri.length-1; i++) {
              if (relationUri[i].uri==jsonData.images[i].uri) {
                jsonData.images[i].uri = jsonData.images[i].uri + Date.now();
              }
            }
            relationUri.push({
              uri: jsonData.images[i].uri,
              beforeUri: beforeName,
              entryName: check,
            });
            console.log("Buffers after >>>>>>>", jsonData.images[i].uri);
          }

          console.log(`GLTF File: ${entryName}, Version: ${version}`);
        } else {
          console.log(`File: ${entryName}, length (bytes): ${buffer.length}`);
        }
      }

      console.log("relationUri >>>>>>>>>>>>>", relationUri);
      // Upload to firebase
      let modelUrl = "";
      const bucket = admin.storage().bucket("tobiratory-f6ae1.appspot.com");
      const timestamp = Date.now();
      for (const entry of entries) {
        let buffer = entry.getData(); // Get the data of the entry
        const entryName = entry.entryName;
        console.log(entryName);

        // MacOS and folder exception.
        if (entryName.startsWith("__MACOSX")||entryName.endsWith(".DS_Store")||buffer.length==0) {
          continue;
        }
        let fileName;
        if (entryName.endsWith(".gltf")) {
          fileName = entryName.split("/").pop();
          const jsonString = JSON.stringify(jsonData);
          buffer = Buffer.from(jsonString);
        } else {
          fileName = relationUri.filter((relation)=>relation.entryName==entryName)[0].uri;
        }
        const destination = `users/${uid}/item/${ModelRequestType.UserUploaded}/models/${timestamp}/${fileName}`;
        try {
          const file = bucket.file(destination);
          await file.save(buffer);
          if (fileName?.endsWith(".gltf")) {
            modelUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;
          }
          console.log(`File uploaded to ${destination} successfully.`);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      res.status(200).send({
        status: "success",
        data: modelUrl,
      });
      return;
    } catch (error) {
      console.error("Error downloading or unzipping the file:", error);
      res.status(500).send({
        status: "error",
        data: error,
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
