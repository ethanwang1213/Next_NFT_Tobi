import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
import {prisma} from "../prisma";

export const decorationWorkspace = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {itemList}: {itemList: ItemType[]} = req.body;
  interface ItemType {
    id: number;
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
      const idPair: {previous: number, next: number}[] = [];
      await Promise.all(
          itemList.map(async (item)=>{
            const workspaceSample = await prisma.workspace_sample_items.upsert({
              where: {
                id: item.id,
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
                id: item.id>0?item.id:undefined,
                account_uuid: uid,
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
            if (item.id<0) {
              idPair.push({
                previous: item.id,
                next: workspaceSample.id,
              });
            }
          })
      );
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

export const getWorkspaceDecorationData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const workspaceSamples = await prisma.workspace_sample_items.findMany({
        where: {
          account_uuid: uid,
        },
        include: {
          sample_item: {
            include: {
              digital_item: {
                include: {
                  material_images: true,
                }
              },
            },
          },
        },
      });
      const itemList = workspaceSamples.map((workspaceSample)=>{
        return {
          id: workspaceSample.id,
          itemId: workspaceSample.sample_item.id,
          modelType: workspaceSample.sample_item.digital_item.type,
          modelUrl: workspaceSample.sample_item.digital_item.model_url,
          imageUrl: workspaceSample.sample_item.digital_item.material_images.image,
          thumbImage: workspaceSample.sample_item.digital_item.is_default_thumb?workspaceSample.sample_item.digital_item.default_thumb_url:workspaceSample.sample_item.digital_item.custom_thumb_url,
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
      data: error,
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
      const workspaceItem = await prisma.workspace_sample_items.findUnique({
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
      if (workspaceItem.account_uuid != uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      await prisma.workspace_sample_items.delete({
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
      data: error,
    });
    return;
  });
};
