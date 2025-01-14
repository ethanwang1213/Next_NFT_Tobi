import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
import {prisma} from "../prisma";
import {limitSaidanCount} from "../lib/constants";

export const getSaidansById = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const saidanData = await prisma.saidans.findUnique({
        where: {
          id: parseInt(saidanId),
          is_deleted: false,
        },
        include: {
          account: true,
        },
      });

      if (!saidanData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const digitalNFT = await prisma.nft_owners.findMany({
        where: {
          saidan_id: saidanData.id,
        },
        include: {
          nft: {
            include: {
              digital_item: true,
            },
          },
        },
      });

      const items = digitalNFT.map((nft)=> {
        return nft.nft.digital_item.is_default_thumb?nft.nft.digital_item.default_thumb_url:nft.nft.digital_item.custom_thumb_url;
      });

      const resData = {
        id: saidanData.id,
        title: saidanData.title,
        description: saidanData.description,
        thumbImage: saidanData.thumbnail_image,
        items: items,
        owner: {
          avatar: saidanData.account?.icon_url,
          username: saidanData.account?.username,
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
      data: error,
    });
    return;
  });
};

export const getOthersSaidanDecorationData = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const saidanData = await prisma.saidans.findUnique({
        where: {
          id: parseInt(saidanId),
          is_deleted: false,
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const saidanTemplate = await prisma.saidans_template.findUnique({
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
      const saidanCamera = await prisma.saidan_camera.findUnique({
        where: {
          saidan_id: saidanData.id,
        },
      });
      const saidanItems = await prisma.nft_owners.findMany({
        where: {
          saidan_id: saidanData.id,
        },
        include: {
          nft: {
            include: {
              nft_camera: true,
              digital_item: true,
            },
          },
        },
      });
      const saidanItemList = saidanItems.map((item)=>{
        return {
          itemId: item.id,
          name: item.nft.digital_item.name??"",
          modelType: item.nft.digital_item.type,
          modelUrl: item.nft.digital_item.meta_model_url,
          thumbUrl: item.nft.digital_item.is_default_thumb?item.nft.digital_item.default_thumb_url:item.nft.digital_item.custom_thumb_url,
          stageType: item.nft.nft_camera?.stage_type,
          shelfSectionIndex: item.nft.nft_camera?.shelf_section_index,
          position: {
            x: item.nft.nft_camera?.position[0],
            y: item.nft.nft_camera?.position[1],
            z: item.nft.nft_camera?.position[2],
          },
          rotation: {
            x: item.nft.nft_camera?.rotation[0],
            y: item.nft.nft_camera?.rotation[1],
            z: item.nft.nft_camera?.rotation[2],
          },
          itemMeterHeight: item.nft.nft_camera?.meter_height,
          scale: item.nft.nft_camera?.scale,
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
      data: error,
    });
    return;
  });
};

export const getSaidanTemplates = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const saidanTemplate = await prisma.saidans_template.findMany();
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
      data: error,
    });
  });
};

export const createSaidan = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, templateId, favorite}:{title: string, templateId: number, favorite?: boolean | null} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const saidanTemplate = await prisma.saidans_template.findUnique({
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
      const ownSaidans = await prisma.saidans.findMany({
        where: {
          account_uuid: uid,
        },
      });
      if (ownSaidans.length>=limitSaidanCount) {
        res.status(401).send({
          status: "error",
          data: "limited",
        });
        return;
      }
      const saveData = await prisma.saidans.create({
        data: {
          title: title,
          template_id: templateId,
          account_uuid: uid,
          thumbnail_image: saidanTemplate.cover_image,
        },
      });
      if (favorite) {
        await prisma.saidans_favorite.create({
          data: {
            saidan_id: saveData.id,
            account_uuid: uid,
          },
        });
      }
      const favoriteValue = await prisma.saidans_favorite.findMany({
        where: {
          saidan_id: saveData.id,
          account_uuid: uid,
        },
      });
      const returnData = {
        saidanId: saveData.id,
        title: saveData.title,
        description: saveData.description,
        modelUrl: saidanTemplate.model_url,
        thumbUrl: saveData.thumbnail_image,
        lastThumb: saveData.last_point_thumb ?? saveData.thumbnail_image,
        modelType: saidanTemplate.type,
        isPublic: saveData.is_public,
        favorite: favoriteValue.length!=0,
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

export const getMySaidans = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const mySaidans = await prisma.saidans.findMany({
      where: {
        account_uuid: uid,
        is_deleted: false,
      },
      include: {
        favorite_users: true,
        saidans_template: true,
      },
    });
    const returnData = mySaidans.map((saidan)=>{
      return {
        saidanId: saidan.id,
        title: saidan.title,
        modelUrl: saidan.saidans_template.model_url,
        thumbUrl: saidan.thumbnail_image,
        lastThumb: saidan.last_point_thumb ?? saidan.thumbnail_image,
        modelType: saidan.saidans_template.type,
        description: saidan.description,
        isPublic: saidan.is_public,
        favorite: saidan.favorite_users.length!=0,
      };
    });

    res.status(200).send({
      status: "success",
      data: returnData,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getMySaidansById = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const saidanData = await prisma.saidans.findUnique({
      where: {
        id: parseInt(saidanId),
        is_deleted: false,
      },
      include: {
        account: true,
      },
    });

    if (!saidanData) {
      res.status(404).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }

    if (saidanData.account_uuid != uid) {
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
        uuid: saidanData.account_uuid,
      },
    };
    res.status(200).send({
      status: "success",
      data: resData,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
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
    const saidanData = await prisma.saidans.findUnique({
      where: {
        id: parseInt(saidanId),
        is_deleted: false,
      },
    });
    if (!saidanData) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (saidanData.account_uuid != uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    await prisma.saidans.update({
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
      const nowFavor = await prisma.saidans_favorite.findMany({
        where: {
          account_uuid: uid,
          saidan_id: parseInt(saidanId),
        },
      });
      if (favorite&&!nowFavor.length) {
        await prisma.saidans_favorite.create({
          data: {
            account_uuid: uid,
            saidan_id: parseInt(saidanId),
          },
        });
      } else if (!favorite&&nowFavor.length) {
        await prisma.saidans_favorite.delete({
          where: {
            id: nowFavor[0].id,
          },
        });
      }
    }
    const updatedSaidan = await prisma.saidans.findUnique({
      where: {
        id: parseInt(saidanId),
        is_deleted: false,
      },
    });
    const template = await prisma.saidans_template.findUnique({
      where: {
        id: updatedSaidan?.template_id,
      },
    });
    const resData = {
      saidanId: updatedSaidan?.id,
      title: updatedSaidan?.title,
      modelUrl: template?.model_url,
      thumbUrl: updatedSaidan?.thumbnail_image,
      lastThumb: updatedSaidan?.last_point_thumb ?? updatedSaidan?.thumbnail_image,
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
      data: error,
    });
    return;
  });
};

export const deleteMySaidan = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const saidanData = await prisma.saidans.findUnique({
      where: {
        id: parseInt(saidanId),
        is_deleted: false,
      },
    });
    if (!saidanData) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (saidanData.account_uuid != uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    await prisma.saidans.update({
      where: {
        id: parseInt(saidanId),
      },
      data: {
        is_deleted: true,
      },
    });
    res.status(200).send({
      status: "success",
      data: saidanData.id,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
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
      const saidanData = await prisma.saidans.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const nowFavor = await prisma.saidans_favorite.findMany({
        where: {
          account_uuid: uid,
          saidan_id: parseInt(id),
        },
      });
      if (favorite&&!nowFavor.length) {
        await prisma.saidans_favorite.create({
          data: {
            account_uuid: uid,
            saidan_id: parseInt(id),
          },
        });
      } else if (!favorite&&nowFavor.length) {
        await prisma.saidans_favorite.delete({
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
      data: error,
    });
    return;
  });
};

export const decorationSaidan = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  const {itemList, cameraData, thumbImage, lastPointThumb}
    :{itemList: ItemType[], cameraData: CameraData, thumbImage: string, lastPointThumb: string} = req.body;

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
    shelfSectionIndex: number;
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
      const saidanData = await prisma.saidans.findUnique({
        where: {
          id: parseInt(saidanId),
          is_deleted: false,
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (saidanData.account_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      const saidanTemplate = await prisma.saidans_template.findUnique({
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
      await prisma.saidans.update({
        where: {
          id: parseInt(saidanId),
        },
        data: {
          thumbnail_image: thumbImage,
          last_point_thumb: lastPointThumb,
        },
      });
      const cameraUpdate = await prisma.saidan_camera.upsert({
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
            const updateItem = await prisma.digital_item_nfts.findUnique({
              where: {
                id: item.itemId,
              },
              include: {
                digital_item: {
                  include: {
                    material_image: true,
                  },
                },
              },
            });
            await prisma.nft_owners.update({
              where: {
                nft_id: item.itemId,
              },
              data: {
                saidan_id: parseInt(saidanId),
              },
            });
            const updateCamera = await prisma.nft_cameras.update({
              where: {
                nft_id: item.itemId,
              },
              data: {
                stage_type: item.stageType,
                shelf_section_index: item.shelfSectionIndex,
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
                meter_height: item.itemMeterHeight,
                scale: item.scale,
              },
            });
            return {...updateItem, ...updateItem?.digital_item, ...updateCamera};
          })
      );
      const saidanItemList = items.map((saidanItem)=>{
        return {
          itemId: saidanItem.id,
          name: saidanItem.name??"",
          modelType: saidanItem.type,
          modelUrl: saidanItem.meta_model_url,
          thumbUrl: saidanItem.is_default_thumb?saidanItem.default_thumb_url:saidanItem.custom_thumb_url,
          materialUrl: saidanItem.digital_item?.material_image?.image,
          stageType: saidanItem.stage_type,
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
      data: error,
    });
    return;
  });
};

export const getSaidanDecorationData = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    // const uid = decodedToken.uid;
    try {
      const saidanData = await prisma.saidans.findUnique({
        where: {
          id: parseInt(saidanId),
          is_deleted: false,
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      // if (saidanData.account_uuid != uid) {
      //   res.status(401).send({
      //     status: "error",
      //     data: "not-yours",
      //   });
      //   return;
      // }
      const saidanTemplate = await prisma.saidans_template.findUnique({
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
      const saidanCamera = await prisma.saidan_camera.findUnique({
        where: {
          saidan_id: saidanData.id,
        },
      });
      const saidanItems = await prisma.nft_owners.findMany({
        where: {
          saidan_id: saidanData.id,
        },
        include: {
          nft: {
            include: {
              nft_camera: true,
              digital_item: true,
            },
          },
        },
      });
      const saidanItemList = saidanItems.map((item)=>{
        return {
          itemId: item.id,
          name: item.nft.digital_item.name??"",
          modelType: item.nft.digital_item.type,
          modelUrl: item.nft.digital_item.meta_model_url,
          thumbUrl: item.nft.digital_item.is_default_thumb?item.nft.digital_item.default_thumb_url:item.nft.digital_item.custom_thumb_url,
          stageType: item.nft.nft_camera?.stage_type,
          shelfSectionIndex: item.nft.nft_camera?.shelf_section_index,
          position: {
            x: item.nft.nft_camera?.position[0],
            y: item.nft.nft_camera?.position[1],
            z: item.nft.nft_camera?.position[2],
          },
          rotation: {
            x: item.nft.nft_camera?.rotation[0],
            y: item.nft.nft_camera?.rotation[1],
            z: item.nft.nft_camera?.rotation[2],
          },
          itemMeterHeight: item.nft.nft_camera?.meter_height,
          scale: item.nft.nft_camera?.scale,
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
      data: error,
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
      const saidanData = await prisma.saidans.findUnique({
        where: {
          id: parseInt(saidanId),
          is_deleted: false,
        },
      });
      if (!saidanData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (saidanData.account_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      await prisma.nft_owners.update({
        where: {
          nft_id: itemId,
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
      data: error,
    });
    return;
  });
};

export const getDefaultItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const defaultItems = await prisma.default_items.findMany();
      const returnValue = defaultItems.map((item)=>{
        return {
          id: item.id,
          name: item.name,
          modelUrl: item.model_url,
          description: item.description,
        };
      });
      res.status(200).send({
        status: "success",
        data: returnValue,
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

export const removeDefaultItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const defaultItem = await prisma.default_items.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!defaultItem) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      await prisma.accounts.update({
        where: {
          uuid: uid,
        },
        data: {
          removed_default_items: {
            push: defaultItem.id,
          },
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
      data: error,
    });
    return;
  });
};
