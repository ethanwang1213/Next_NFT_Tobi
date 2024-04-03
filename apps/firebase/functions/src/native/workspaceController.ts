import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
import {PrismaClient} from "@prisma/client";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";

const prisma = new PrismaClient();

export const decorationWorkspace = async (req: Request, res: Response) => {
  const {saidanId} = req.params;
  const {authorization} = req.headers;
  const {itemList, thumbImage}: {itemList: ItemType[], thumbImage: string} = req.body;

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
    scale: number;
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
          modelUrl: saidanItem.model_url,
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
          scale: saidanItem.scale,
        };
      });
      const returnData = {
        saidanId: saidanData.id,
        saidanType: saidanTemplate.type,
        saidanUrl: saidanTemplate.model_url,
        saidanItemList: saidanItemList,
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

export const getWorkspaceDecorationData = async (req: Request, res: Response) => {
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
      const saidanItems = await prisma.tobiratory_digital_items.findMany({
        where: {
          saidan_id: saidanData.id,
        },
      });
      const saidanItemList = saidanItems.map((saidanItem)=>{
        return {
          itemId: saidanItem.id,
          modelType: saidanItem.type,
          modelUrl: saidanItem.model_url,
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
          scale: saidanItem.scale,
        };
      });
      const returnData = {
        saidanId: saidanData.id,
        saidanType: saidanTemplate.type,
        saidanUrl: saidanTemplate.model_url,
        saidanItemList: saidanItemList,
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
