import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";

export const createAcrylicStand = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {bodyUrl, baseUrl, coords}: { bodyUrl: string, baseUrl?: string, coords?: string } = req.body;
  const predefinedModel = "https://storage.googleapis.com/tobiratory-f6ae1.appspot.com/debug/sample.glb";
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    console.log(uid, bodyUrl, baseUrl, coords);

    // const modelData = await createModelCloud(materialId, type);
    res.status(200).send({
      status: "success",
      data: {
        url: predefinedModel, // modelData.modelUrl,
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

export const removeBackground = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {url}: { url: string } = req.body;
  const predefinedUrl = "https://storage.googleapis.com/tobiratory-f6ae1.appspot.com/debug/sample-trans-neko.png";
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    console.log(uid, url);

    // const modelData = await createModelCloud(materialId, type);
    res.status(200).send({
      status: "success",
      data: {
        url: predefinedUrl, // modelData.modelUrl,
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

export const removeBackgroundOfMessageCard = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {url}: { url: string } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    console.log(uid, url);

    // const modelData = await createModelCloud(materialId, type);
    res.status(200).send({
      status: "success",
      data: {
        url: url,
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
          quantityLimit: sample.quantity_limit,
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
        quantityLimit: sample.quantity_limit,
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
      if (price || startDate || endDate || quantityLimit) {
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
            quantity_limit: quantityLimit,
          },
        });
      }
      if (name || description || customThumbnailUrl || isCustomThumbnailSelected || status || license) {
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
          quantityLimit: sample.quantity_limit,
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

export const adminDeleteDigitalItems = async (req: Request, res: Response) => {
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
      const sample = await prisma.tobiratory_sample_items.findUnique({
        where: {
          id: parseInt(digitalId),
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
        defaultThumbnailUrl: sample.digital_item.default_thumb_url,
        customThumbnailUrl: sample.digital_item.custom_thumb_url,
        isCustomThumbnailSelected: !sample.digital_item.is_default_thumb,
        price: sample.price,
        status: sample.digital_item.status,
        startDate: sample.start_date,
        endDate: sample.end_date,
        quantityLimit: sample.quantity_limit,
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
      const digitalItem = await prisma.tobiratory_digital_items.findUnique({
        where: {
          id: parseInt(digitalId),
        },
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
      if (price || startDate || endDate || quantityLimit) {
        await prisma.tobiratory_sample_items.update({
          where: {
            id: parseInt(digitalId),
            content_id: content?.id,
            is_deleted: false,
          },
          data: {
            price: price,
            start_date: startDate == undefined ? undefined : new Date(startDate),
            end_date: endDate == undefined ? undefined : new Date(endDate),
            quantity_limit: quantityLimit,
          },
        });
      }
      if (name || description || customThumbnailUrl || isCustomThumbnailSelected || status || license) {
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
            license: license,
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
