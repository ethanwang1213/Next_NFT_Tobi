import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
import {prisma} from "../prisma";

export const decorationWorkspace = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {itemList}: {itemList: ItemType[]} = req.body;
  interface ItemType {
    id: number|null;
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
            await prisma.tobiratory_workspace_items.upsert({
              where: {
                id: item.id??0,
              },
              update: {
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
              create: {
                owner_uuid: uid,
                sample_id: item.itemId,
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
      const workspaceSamples = await prisma.tobiratory_workspace_items.findMany({
        where: {
          owner_uuid: uid,
        },
        include: {
          sample: {
            include: {
              digital_item: true,
            },
          },
        },
      });
      const workspaceItemList = workspaceSamples.map(async (workspaceSample)=>{
        return {
          itemId: workspaceSample.id,
          modelType: workspaceSample.sample.digital_item.type,
          modelUrl: workspaceSample.sample.model_url,
          imageUrl: workspaceSample.sample.digital_item.is_default_thumb?workspaceSample.sample.digital_item.default_thumb_url:workspaceSample.sample.digital_item.custom_thumb_url,
          stageType: workspaceSample.stage_type,
          position: {
            x: workspaceSample.position[0]??0,
            y: workspaceSample.position[1]??0,
            z: workspaceSample.position[2]??0,
          },
          rotation: {
            x: workspaceSample.rotation[0]??0,
            y: workspaceSample.rotation[1]??0,
            z: workspaceSample.rotation[2]??0,
          },
          scale: workspaceSample.scale,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          workspaceItemList: workspaceItemList,
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
      const workspaceSamples = await prisma.tobiratory_workspace_items.findMany({
        where: {
          owner_uuid: uid,
        },
        include: {
          sample: {
            include: {
              digital_item: true,
            },
          },
        },
      });
      const itemList = workspaceSamples.map((workspaceSample)=>{
        return {
          itemId: workspaceSample.id,
          modelType: workspaceSample.sample.digital_item.type,
          modelUrl: workspaceSample.sample.model_url,
          imageUrl: workspaceSample.sample.digital_item.is_default_thumb?workspaceSample.sample.digital_item.default_thumb_url:workspaceSample.sample.digital_item.custom_thumb_url,
          stageType: workspaceSample.stage_type,
          position: {
            x: workspaceSample.position[0]??0,
            y: workspaceSample.position[1]??0,
            z: workspaceSample.position[2]??0,
          },
          rotation: {
            x: workspaceSample.rotation[0]??0,
            y: workspaceSample.rotation[1]??0,
            z: workspaceSample.rotation[2]??0,
          },
          scale: workspaceSample.scale,
        };
      });
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
  const {id}: {id: number} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const workspaceItem = await prisma.tobiratory_workspace_items.findUnique({
        where: {
          id: id,
        },
      });
      if (!workspaceItem) {
        res.status(401).send({
          status: "error",
          data: "not-exist-sample",
        });
        return;
      }
      if (workspaceItem.owner_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      await prisma.tobiratory_workspace_items.delete({
        where: {
          id: id,
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
