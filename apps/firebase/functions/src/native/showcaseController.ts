import {Request, Response} from "express";
import {prisma} from "../prisma";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {statusOfShowcase} from "./utils";

export const getShowcaseTemplate = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
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
      const showcaseTemplate = await prisma.showcase_template.findMany();
      const returnData = showcaseTemplate.map((template) => {
        return {
          id: template.id,
          thumbImage: template.cover_image,
          model: template.model_url,
          title: template.title,
          description: template.description,
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
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const createMyShocase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, description, templateId}: { title: string, description: string, templateId: number } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.businesses.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: true,
        },
      });
      if (!admin) {
        res.status(404).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      if (!admin.content) {
        res.status(404).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const showcaseTemplate = await prisma.showcase_template.findUnique({
        where: {
          id: templateId,
        },
      });
      if (!showcaseTemplate) {
        res.status(401).send({
          status: "error",
          data: "not-template",
        });
        return;
      }
      const showcase = await prisma.showcases.create({
        data: {
          title: title,
          description: description,
          account_uuid: admin.uuid,
          content_id: admin.content.id,
          template_id: templateId,
          thumb_url: showcaseTemplate.cover_image,
        },
      });
      const returnData = {
        id: showcase.id,
        title: showcase.title,
        description: showcase.description,
        model: showcaseTemplate.model_url,
        thumbImage: showcase.thumb_url,
        createTime: showcase.updated_date_time,
        updateTime: showcase.updated_date_time,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const updateMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {title, description, thumbUrl, status, scheduleTime}: { title?: string, description?: string, thumbUrl?: string, status?: number, scheduleTime: string } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
        },
      });
      if (!admin) {
        res.status(404).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const showcase = await prisma.showcases.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-showcase",
        });
        return;
      }
      if (status && status != statusOfShowcase.public && status != statusOfShowcase.publicSchedule) {
        res.status(401).send({
          status: "error",
          data: "invalid-status",
        });
        return;
      }
      if (status == statusOfShowcase.public) {
        await prisma.showcases.updateMany({
          where: {
            status: statusOfShowcase.public,
            content_id: showcase.content_id,
          },
          data: {
            status: statusOfShowcase.private,
          },
        });
      }
      const updateShowcase = await prisma.showcases.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: title,
          description: description,
          thumb_url: thumbUrl,
          schedule_time: scheduleTime == undefined ? undefined : new Date(scheduleTime),
          status: status,
          updated_date_time: new Date(),
        },
      });
      const returnData = {
        id: updateShowcase.id,
        title: updateShowcase.title,
        status: updateShowcase.status,
        scheduleTime: updateShowcase.schedule_time,
        description: updateShowcase.description,
        createTime: updateShowcase.created_date_time,
        updateTime: updateShowcase.updated_date_time,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getMyShowcases = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
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
        res.status(404).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const allShowcases = await prisma.showcases.findMany({
        where: {
          account_uuid: admin.uuid,
          is_deleted: false,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      const returnData = allShowcases.map((showcase) => {
        return {
          id: showcase.id,
          thumbImage: showcase.thumb_url,
          title: showcase.title,
          description: showcase.description,
          status: showcase.status,
          scheduleTime: showcase.schedule_time,
          createTime: showcase.created_date_time,
          updateTime: showcase.updated_date_time,
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
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const deleteMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
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
      if (!admin.content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const showcase = await prisma.showcases.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      if (showcase.account_uuid != admin.uuid) {
        res.status(404).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }
      if (showcase.status == statusOfShowcase.public) {
        res.status(401).send({
          status: "error",
          data: "public-showcase",
        });
        return;
      }
      const deleteShowcase = await prisma.showcases.update({
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
          id: deleteShowcase.id,
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

export const loadMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
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
      const showcase = await prisma.showcases.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
        include: {
          showcase_sample_items: {
            include: {
              sample_item: {
                include: {
                  digital_item: {
                    include: {
                      material_image: true,
                    }
                  },
                },
              },
            },
          },
          showcase_nft_items: {
            include: {
              digital_item_nft: {
                include: {
                  digital_item: {
                    include: {
                      material_image: true,
                    }
                  },
                },
              },
            },
          },
          showcase_template: true,
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      if (showcase.account_uuid != uid) {
        res.status(404).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      const sampleItemList = showcase.showcase_sample_items.map((relationSample) => {
        const sampleData = relationSample.sample_item;
        const digitalData = relationSample.sample_item.digital_item;
        return {
          id: relationSample.id,
          itemId: sampleData.id,
          modelType: digitalData.type,
          modelUrl: digitalData.model_url,
          thumbUrl: digitalData.is_default_thumb ? digitalData.default_thumb_url : digitalData.custom_thumb_url,
          materialUrl: digitalData.material_image.image,
          stageType: relationSample.stage_type,
          scale: relationSample.scale,
          position: {
            x: relationSample.position[0] ?? 0,
            y: relationSample.position[1] ?? 0,
            z: relationSample.position[2] ?? 0,
          },
          rotation: {
            x: relationSample.rotation[0] ?? 0,
            y: relationSample.rotation[1] ?? 0,
            z: relationSample.rotation[2] ?? 0,
          },
        };
      });
      const nftItemList = showcase.showcase_nft_items.map((relationNft) => {
        const nftData = relationNft.digital_item_nft;
        const digitalData = relationNft.digital_item_nft.digital_item;
        return {
          id: relationNft.id,
          itemId: nftData.id,
          modelType: digitalData.type,
          modelUrl: digitalData.model_url,
          thumbUrl: digitalData.is_default_thumb?digitalData.default_thumb_url:digitalData.custom_thumb_url,
          materialUrl: digitalData.material_image.image,
          stageType: relationNft.stage_type,
          scale: relationNft.scale,
          itemMeterHeight: relationNft.meter_height,
          position: {
            x: relationNft.position[0] ?? 0,
            y: relationNft.position[1] ?? 0,
            z: relationNft.position[2] ?? 0,
          },
          rotation: {
            x: relationNft.rotation[0] ?? 0,
            y: relationNft.rotation[1] ?? 0,
            z: relationNft.rotation[2] ?? 0,
          },
        };
      });
      const settings = {
        wallpaper: {
          tint: showcase.wallpaper_tint,
        },
        floor: {
          tint: showcase.floor_tint,
        },
        lighting: {
          sceneLight: {
            tint: showcase.lighting_scene_tint,
            brightness: showcase.lighting_scene_brightness,
          },
          pointLight: {
            tint: showcase.lighting_point_tint,
            brightness: showcase.lighting_point_bright,
          },
        },
      };
      const returnData = {
        showcaseId: showcase.id,
        thumbImage: showcase.thumb_url,
        title: showcase.title,
        description: showcase.description,
        status: showcase.status,
        scheduleTime: showcase.schedule_time,
        showcaseType: showcase.showcase_template?.type,
        showcaseUrl: showcase.showcase_template?.model_url,
        sampleItemList: sampleItemList,
        nftItemList: nftItemList,
        settings: settings,
        createTime: showcase.created_date_time,
        updateTime: showcase.updated_date_time,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const saveMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {sampleItemList, nftItemList, thumbnailImage, settings}: { sampleItemList: ItemType[], nftItemList: ItemType[], thumbnailImage: string, settings: SettingsType } = req.body;
  type ItemType = {
    id: number,
    itemId: number,
    stageType: number,
    position: {
      x: number,
      y: number,
      z: number,
    },
    rotation: {
      x: number,
      y: number,
      z: number,
    },
    scale: number,
  };
  type SettingsType = {
    wallpaper: {
      tint?: string;
    };
    floor: {
      tint?: string;
    };
    lighting: {
      sceneLight: {
        tint?: string;
        brightness?: number;
      };
      pointLight: {
        tint?: string;
        brightness?: number;
      };
    };
  }
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
      const content = await prisma.contents.findFirst({
        where: {
          businesses_uuid: uid,
          is_deleted: false,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const isShowcase = await prisma.showcases.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
      });
      if (!isShowcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      if (isShowcase.account_uuid != uid) {
        res.status(403).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      const idPair: { previous: number, next: number }[] = [];
      for (const sample of sampleItemList) {
        const sampledata = await prisma.showcase_sample_items.upsert({
          where: {
            id: sample.id,
            showcase_id: isShowcase.id,
            sample_item_id: sample.itemId,
          },
          update: {
            stage_type: sample.stageType,
            position: [sample.position.x, sample.position.y, sample.position.z],
            rotation: [sample.rotation.x, sample.rotation.y, sample.rotation.z],
          },
          create: {
            id: sample.id>0?sample.id:undefined,
            showcase_id: isShowcase.id,
            sample_item_id: sample.itemId,
            stage_type: sample.stageType,
            position: [sample.position.x, sample.position.y, sample.position.z],
            rotation: [sample.rotation.x, sample.rotation.y, sample.rotation.z],
          },
        });
        if (sample.id < 0) {
          idPair.push({
            previous: sample.id,
            next: sampledata.id,
          });
        }
      }
      for (const nft of nftItemList) {
        const nftData = await prisma.showcase_nft_items.upsert({
          where: {
            id: nft.id,
            showcase_id: isShowcase.id,
            nft_id: nft.itemId,
          },
          update: {
            stage_type: nft.stageType,
            position: [nft.position.x, nft.position.y, nft.position.z],
            rotation: [nft.rotation.x, nft.rotation.y, nft.rotation.z],
          },
          create: {
            showcase_id: isShowcase.id,
            nft_id: nft.itemId,
            stage_type: nft.stageType,
            position: [nft.position.x, nft.position.y, nft.position.z],
            rotation: [nft.rotation.x, nft.rotation.y, nft.rotation.z],
          },
        });
        if (nft.id < 0) {
          idPair.push({
            previous: nft.id,
            next: nftData.id,
          });
        }
      }
      await prisma.showcases.update({
        where: {
          id: isShowcase.id,
        },
        data: {
          thumb_url: thumbnailImage,
          wallpaper_tint: settings.wallpaper.tint,
          floor_tint: settings.floor.tint,
          lighting_scene_tint: settings.lighting.sceneLight.tint,
          lighting_scene_brightness: settings.lighting.sceneLight.brightness,
          lighting_point_tint: settings.lighting.pointLight.tint,
          lighting_point_bright: settings.lighting.pointLight.brightness,
        },
      });
      res.status(200).send({
        status: "success",
        data: idPair,
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

export const throwItemShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {sampleRelationId, nftRelationId}: { sampleRelationId?: number, nftRelationId?: number } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
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
      const content = await prisma.contents.findFirst({
        where: {
          businesses_uuid: uid,
          is_deleted: false,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const showcase = await prisma.showcases.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      if (showcase.account_uuid != uid) {
        res.status(404).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      if (sampleRelationId) {
        await prisma.showcase_sample_items.delete({
          where: {
            id: sampleRelationId,
          },
        });
      } else if (nftRelationId) {
        await prisma.showcase_nft_items.delete({
          where: {
            id: nftRelationId,
          },
        });
      }
      res.status(200).send({
        status: "success",
        data: "thrown",
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
