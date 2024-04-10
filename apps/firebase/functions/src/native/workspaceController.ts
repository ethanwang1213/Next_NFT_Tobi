import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
import {prisma} from "../prisma";

export const decorationWorkspace = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {itemList}: {itemList: ItemType[]} = req.body;
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
      await Promise.all(
          itemList.map(async (item)=>{
            await prisma.tobiratory_sample_items.updateMany({
              where: {
                id: item.itemId,
                owner_uuid: uid,
                is_deleted: false,
              },
              data: {
                in_workspace: true,
                stage_type: item.stageType,
                scale: item.scale,
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
              },
            });
          })
      );
      const workspaceSamples = await prisma.tobiratory_sample_items.findMany({
        where: {
          owner_uuid: uid,
          in_workspace: true,
          is_deleted: false,
        },
      });
      const sampleItemList = await Promise.all(
          workspaceSamples.map(async (sample)=>{
            const digitalItem = await prisma.tobiratory_digital_items.findUnique({
              where: {
                id: sample.digital_item_id,
              },
            });
            return {
              itemId: sample.id,
              modelType: digitalItem?.type,
              modelUrl: sample?.model_url,
              imageUrl: digitalItem?.thumb_url,
              stageType: sample.stage_type,
              position: {
                x: sample.position[0]??0,
                y: sample.position[1]??0,
                z: sample.position[2]??0,
              },
              rotation: {
                x: sample.rotation[0]??0,
                y: sample.rotation[1]??0,
                z: sample.rotation[2]??0,
              },
              scale: sample.scale,
            };
          })
      );
      res.status(200).send({
        status: "success",
        data: {
          workspaceItemList: sampleItemList,
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

export const getWorkspaceDecorationData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const workspaceSamples = await prisma.tobiratory_sample_items.findMany({
        where: {
          owner_uuid: uid,
          in_workspace: true,
          is_deleted: false,
        },
      });
      const itemList = await Promise.all(
          workspaceSamples.map(async (sample)=>{
            const digitalItem = await prisma.tobiratory_digital_items.findUnique({
              where: {
                id: sample.digital_item_id,
              },
            });
            return {
              itemId: sample.id,
              modelType: digitalItem?.type,
              modelUrl: sample?.model_url,
              imageUrl: digitalItem?.thumb_url,
              stageType: sample.stage_type,
              position: {
                x: sample.position[0]??0,
                y: sample.position[1]??0,
                z: sample.position[2]??0,
              },
              rotation: {
                x: sample.rotation[0]??0,
                y: sample.rotation[1]??0,
                z: sample.rotation[2]??0,
              },
              scale: sample.scale,
            };
          })
      );
      res.status(200).send({
        status: "success",
        data: {
          workspaceItemList: itemList,
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

export const throwSample = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {sampleId}: {sampleId: number} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const sample = await prisma.tobiratory_sample_items.findUnique({
        where: {
          id: sampleId,
        },
      });
      if (!sample) {
        res.status(401).send({
          status: "error",
          data: "not-exist-sample",
        });
        return;
      }
      if (sample.owner_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      await prisma.tobiratory_sample_items.update({
        where: {
          id: sampleId,
        },
        data: {
          in_workspace: false,
        },
      });
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
      data: error.code,
    });
    return;
  });
};
