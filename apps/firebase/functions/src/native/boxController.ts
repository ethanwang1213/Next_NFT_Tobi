import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";

const prisma = new PrismaClient();

export const permissionGift = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {boxId} = req.body;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const boxData = await prisma.tobiratory_boxes.findUnique({
        where: {
          id: boxId,
        },
      });
      if (!boxData) {
        res.status(401).send({
          status: "error",
          data: {
            msg: "not-exist",
          },
        });
        return;
      }
      if (boxData.uuid != uid) {
        res.status(401).send({
          status: "error",
          data: {
            msg: "not-yours",
          },
        });
        return;
      }
      const updatedBox = await prisma.tobiratory_boxes.update({
        where: {
          id: boxId,
        },
        data: {
          gift_permission: !boxData.gift_permission,
        },
      });
      res.status(200).send({
        status: "success",
        data: updatedBox,
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
  });
};

export const makeBox = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {name} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    await prisma.tobiratory_boxes.create({
      data: {
        uuid: uid,
        name: name,
      },
    });
    res.status(200).send({
      status: "success",
      data: "created",
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "success",
      data: error.code,
    });
  });
};

export const getInventoryData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const boxes = await prisma.tobiratory_boxes.findMany({
        where: {
          uuid: uid,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      const returnBoxes = boxes.map(async (box)=>{
        const itemsInBox = await prisma.tobiratory_items.findMany({
          where: {
            box_id: box.id,
          },
          orderBy: {
            updated_date_time: "desc"
          }
        });
        const items4 = itemsInBox.splice(0, 4).map((item)=>{
          return {
            id: item.id,
            title: item.title,
            image: item.image,
          };
        });
        return {
          id: box.id,
          name: box.name,
          items: items4,
        };
      });
      const items = await prisma.tobiratory_items.findMany({
        where: {
          creator_uid: uid,
          box_id: 0,
        },
      });
      const returnItems = items.map((item)=>{
        return {
          id: item.id,
          title: item.title,
          image: item.image,
          saidanId: item.saidan_id,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          giftPermission: false,
          items: returnItems,
          boxes: returnBoxes,
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
  });
};

export const getBoxData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const box = await prisma.tobiratory_boxes.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (box == null) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (box.uuid == uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    const items = await prisma.tobiratory_items.findMany({
      where: {
        box_id: parseInt(id),
      },
    });
    const returnItem = items.map((item)=>{
      return {
        id: item.id,
        title: item.title,
        image: item.image,
        saidanId: item.saidan_id,
      };
    });
    res.status(200).send({
      status: "success",
      data: {
        giftPermission: box.gift_permission,
        items: returnItem,
      },
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "success",
      data: error.code,
    });
  });
};

export const deleteBoxData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const box = await prisma.tobiratory_boxes.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (box == null) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (box.uuid == uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    await prisma.tobiratory_boxes.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).send({
      status: "success",
      data: "deleted",
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "success",
      data: error.code,
    });
  });
};
