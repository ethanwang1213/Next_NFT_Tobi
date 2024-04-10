import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
import {prisma} from "../prisma";

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
          userId: saidan.owner_uuid,
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
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const saidanData = await prisma.tobiratory_saidans.findUnique({
        where: {
          id: parseInt(saidanId),
        },
      });

      if (!saidanData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const userData = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: saidanData.owner_uuid,
        },
      });

      if (!userData) {
        res.status(404).send({
          status: "error",
          data: "not-exist-owner",
        });
        return;
      }

      const digitalNFT = await prisma.tobiratory_digital_items.findMany({
        where: {
          saidan_id: saidanData.id,
        },
      });

      const items = digitalNFT.map((nft)=>nft.thumb_url);

      const resData = {
        id: saidanData.id,
        title: saidanData.title,
        description: saidanData.description,
        items: items,
        owner: {
          avatar: userData.icon_url,
          username: userData.username,
        },
      };
      res.status(200).send({
        status: "success",
        data: resData,
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

export const getSaidanTemplates = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (/* decodedToken: DecodedIdToken*/)=>{
    try {
      const saidanTemplate = await prisma.tobiratory_saidans_template.findMany();
      const returnData = saidanTemplate.map((template)=>{
        return {
          templateId: template.id,
          image: template.cover_image,
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
      data: error.code,
    });
  });
};

export const createSaidan = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, templateId}:{title: string, templateId: number} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const saidanTemplate = await prisma.tobiratory_saidans_template.findUnique({
        where: {
          id: templateId,
        },
      });
      if (!saidanTemplate) {
        res.status(401).send({
          status: "error",
          data: "template-not-exist",
        });
        return;
      }
      const saveData = await prisma.tobiratory_saidans.create({
        data: {
          title: title,
          template_id: templateId,
          owner_uuid: uid,
          thumbnail_image: saidanTemplate.cover_image,
        },
      });
      const favorite = await prisma.tobiratory_saidans_favorite.findMany({
        where: {
          saidan_id: saveData.id,
          favorite_user_id: uid,
        },
      });
      const returnData = {
        saidanId: saveData.id,
        title: saveData.title,
        showcase: saveData.showcase,
        modelUrl: saidanTemplate.model_url,
        imageUrl: saveData.thumbnail_image,
        modelType: saidanTemplate.type,
        isPublic: saveData.is_public,
        favorite: favorite.length!=0,
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
      data: error.code,
    });
    return;
  });
};

export const getMySaidans = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const mySaidans = await prisma.tobiratory_saidans.findMany({
      where: {
        owner_uuid: uid,
      },
    });
    const saidanTemplates = await prisma.tobiratory_saidans_template.findMany();
    const returnData = await Promise.all(
        mySaidans.map(async (saidan)=>{
          const template = saidanTemplates.filter((template)=>template.id==saidan.template_id)[0];
          const favorite = await prisma.tobiratory_saidans_favorite.findMany({
            where: {
              saidan_id: saidan.id,
              favorite_user_id: uid,
            },
          });
          return {
            saidanId: saidan.id,
            title: saidan.title,
            modelUrl: template.model_url,
            imageUrl: saidan.thumbnail_image,
            modelType: template.type,
            description: saidan.description,
            isPublic: saidan.is_public,
            favorite: favorite.length!=0,
          };
        })
    );

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

    if (saidanData.owner_uuid != uid) {
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
        userId: saidanData.owner_uuid,
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

export const updateMySaidan = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  const {isPublic, title, description, thumbnailImage, favorite}: {isPublic?: boolean, title?: string, description?: string, thumbnailImage?: string, favorite?: boolean} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const saidanData = await prisma.tobiratory_saidans.findUnique({
      where: {
        id: parseInt(saidanId),
      },
    });
    if (!saidanData) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (saidanData.owner_uuid != uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    await prisma.tobiratory_saidans.update({
      where: {
        id: parseInt(saidanId),
      },
      data: {
        is_public: isPublic,
        title: title,
        description: description,
        thumbnail_image: thumbnailImage,
      },
    });
    if (favorite != undefined) {
      const nowFavor = await prisma.tobiratory_saidans_favorite.findMany({
        where: {
          favorite_user_id: uid,
          saidan_id: parseInt(saidanId),
        },
      });
      if (favorite&&!nowFavor.length) {
        await prisma.tobiratory_saidans_favorite.create({
          data: {
            favorite_user_id: uid,
            saidan_id: parseInt(saidanId),
          },
        });
      } else if (!favorite&&nowFavor.length) {
        await prisma.tobiratory_saidans_favorite.delete({
          where: {
            id: nowFavor[0].id,
          },
        });
      }
    }
    const updatedSaidan = await prisma.tobiratory_saidans.findUnique({
      where: {
        id: parseInt(saidanId),
      },
    });
    const template = await prisma.tobiratory_saidans_template.findUnique({
      where: {
        id: updatedSaidan?.template_id,
      },
    });
    const resData = {
      saidanId: updatedSaidan?.id,
      title: updatedSaidan?.title,
      modelUrl: template?.model_url,
      imageUrl: updatedSaidan?.thumbnail_image,
      modelType: template?.type,
      description: updatedSaidan?.description,
      isPublic: updatedSaidan?.is_public,
      favorite: favorite,
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

export const favoriteSaidan = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {favorite}: {favorite: boolean} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const saidanData = await prisma.tobiratory_saidans.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const nowFavor = await prisma.tobiratory_saidans_favorite.findMany({
        where: {
          favorite_user_id: uid,
          saidan_id: parseInt(id),
        },
      });
      if (favorite&&!nowFavor.length) {
        await prisma.tobiratory_saidans_favorite.create({
          data: {
            favorite_user_id: uid,
            saidan_id: parseInt(id),
          },
        });
      } else if (!favorite&&nowFavor.length) {
        await prisma.tobiratory_saidans_favorite.delete({
          where: {
            id: nowFavor[0].id,
          },
        });
      }
      res.status(200).send({
        status: "success",
        data: {
          favorite: favorite,
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
      data: error.code,
    });
    return;
  });
};

export const decorationSaidan = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  const {itemList, cameraData, thumbImage}: {itemList: ItemType[], cameraData: CameraData, thumbImage: string} = req.body;

  interface ItemType {
    itemId: number;
    stageType: number;
    position: {
      x: number;
      y: number;
      z: number;
    },
    rotation: {
      x: number;
      y: number;
      z: number;
    },
    canScale: boolean;
    itemMeterHeight: number;
    scale: number;
  }
  interface CameraData {
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    }
  }
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const saidanData = await prisma.tobiratory_saidans.findUnique({
        where: {
          id: parseInt(saidanId),
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (saidanData.owner_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      const saidanTemplate = await prisma.tobiratory_saidans_template.findUnique({
        where: {
          id: saidanData.template_id,
        },
      });
      if (!saidanTemplate) {
        res.status(401).send({
          status: "error",
          data: "missing-template",
        });
        return;
      }
      await prisma.tobiratory_saidans.update({
        where: {
          id: parseInt(saidanId),
        },
        data: {
          thumbnail_image: thumbImage,
        },
      });
      const cameraUpdate = await prisma.tobiratory_saidan_camera.upsert({
        where: {
          saidan_id: parseInt(saidanId),
        },
        update: {
          position: [
            cameraData.position.x,
            cameraData.position.y,
            cameraData.position.z,
          ],
          rotation: [
            cameraData.rotation.x,
            cameraData.rotation.y,
            cameraData.rotation.z,
          ],
        },
        create: {
          saidan_id: parseInt(saidanId),
          position: [
            cameraData.position.x,
            cameraData.position.y,
            cameraData.position.z,
          ],
          rotation: [
            cameraData.rotation.x,
            cameraData.rotation.y,
            cameraData.rotation.z,
          ],
        },
      });
      const items = await Promise.all(
          itemList.map(async (item)=>{
            const updateItem = await prisma.tobiratory_digital_items.update({
              where: {
                id: item.itemId,
              },
              data: {
                saidan_id: parseInt(saidanId),
                state_type: item.stageType,
                position: [
                  item.position.x,
                  item.position.y,
                  item.position.z,
                ],
                rotation: [
                  item.rotation.x,
                  item.rotation.y,
                  item.rotation.z,
                ],
                can_scale: item.canScale,
                meter_height: item.itemMeterHeight,
                scale: item.scale,
              },
            });
            return updateItem;
          })
      );
      const saidanItemList = items.map((saidanItem)=>{
        return {
          itemId: saidanItem.id,
          modelType: saidanItem.type,
          modelUrl: saidanItem.nft_model,
          imageUrl: saidanItem.thumb_url,
          stageType: saidanItem.state_type,
          position: {
            x: saidanItem.position[0],
            y: saidanItem.position[1],
            z: saidanItem.position[2],
          },
          rotation: {
            x: saidanItem.rotation[0],
            y: saidanItem.rotation[1],
            z: saidanItem.rotation[2],
          },
          canScale: saidanItem.can_scale,
          itemMeterHeight: saidanItem.meter_height,
          scale: saidanItem.scale,
        };
      });
      const returnData = {
        saidanId: saidanData.id,
        saidanType: saidanTemplate.type,
        saidanUrl: saidanTemplate.model_url,
        saidanItemList: saidanItemList,
        saidanCameraData: {
          position: {
            x: cameraUpdate.position[0],
            y: cameraUpdate.position[1],
            z: cameraUpdate.position[2],
          },
          rotation: {
            x: cameraUpdate.rotation[0],
            y: cameraUpdate.rotation[1],
            z: cameraUpdate.rotation[2],
          },
        },
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
      data: error.code,
    });
    return;
  });
};

export const getSaidanDecorationData = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const saidanData = await prisma.tobiratory_saidans.findUnique({
        where: {
          id: parseInt(saidanId),
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (saidanData.owner_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      const saidanTemplate = await prisma.tobiratory_saidans_template.findUnique({
        where: {
          id: saidanData.template_id,
        },
      });
      if (!saidanTemplate) {
        res.status(401).send({
          status: "error",
          data: "missing-template",
        });
        return;
      }
      const saidanCamera = await prisma.tobiratory_saidan_camera.findUnique({
        where: {
          saidan_id: saidanData.id,
        },
      });
      const saidanItems = await prisma.tobiratory_digital_items.findMany({
        where: {
          saidan_id: saidanData.id,
        },
      });
      const saidanItemList = saidanItems.map((saidanItem)=>{
        return {
          itemId: saidanItem.id,
          modelType: saidanItem.type,
          modelUrl: saidanItem.nft_model,
          imageUrl: saidanItem.thumb_url,
          stageType: saidanItem.state_type,
          position: {
            x: saidanItem.position[0],
            y: saidanItem.position[1],
            z: saidanItem.position[2],
          },
          rotation: {
            x: saidanItem.rotation[0],
            y: saidanItem.rotation[1],
            z: saidanItem.rotation[2],
          },
          canScale: saidanItem.can_scale,
          itemMeterHeight: saidanItem.meter_height,
          scale: saidanItem.scale,
        };
      });
      const returnData = {
        saidanId: saidanData.id,
        saidanType: saidanTemplate.type,
        saidanUrl: saidanTemplate.model_url,
        saidanItemList: saidanItemList,
        saidanCameraData: {
          position: {
            x: saidanCamera? saidanCamera.position[0]:0,
            y: saidanCamera? saidanCamera.position[1]:0,
            z: saidanCamera? saidanCamera.position[2]:0,
          },
          rotation: {
            x: saidanCamera? saidanCamera.rotation[0]:0,
            y: saidanCamera? saidanCamera.rotation[1]:0,
            z: saidanCamera? saidanCamera.rotation[2]:0,
          },
        },
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
      data: error.code,
    });
    return;
  });
};

export const putAwayItemInSaidan = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  const {itemId} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const saidanData = await prisma.tobiratory_saidans.findUnique({
        where: {
          id: parseInt(saidanId),
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (saidanData.owner_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      await prisma.tobiratory_digital_items.update({
        where: {
          id: itemId,
        },
        data: {
          saidan_id: 0,
        },
      });
      res.status(200).send({
        status: "success",
        data: "removed",
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
      data: error.code,
    });
    return;
  });
};
