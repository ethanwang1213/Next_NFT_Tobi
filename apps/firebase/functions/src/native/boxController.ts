import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
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

export const getMyItemsById = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const itemData = await prisma.tobiratory_items.findUnique({
      where: {
        id: parseInt(id),
        creator_uid: uid,
      },
    });

    if (itemData == null) {
      res.status(404).send({
        status: "error",
        data: "Item does not exist!",
      });
      return;
    }

    const contentData = await prisma.tobiratory_contents.findUnique({
      where: {
        id: itemData.content_id,
      },
    });
    const resData = {
      id: id,
      title: itemData.title,
      image: itemData.image,
      type: itemData.type,
      content: contentData == null ? null : {
        id: contentData.id,
        creator: {
          userId: contentData.creator_user_id,
        },
      },
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
  });
};

export const makeBox = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {parentBox, name} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    await prisma.tobiratory_boxes.create({
      data: {
        uuid: uid,
        parent_id: parentBox,
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
    const parentBox = await prisma.tobiratory_boxes.findUnique({
      where: {
        id: box.parent_id,
      },
    });
    const childrenBoxes = await prisma.tobiratory_boxes.findMany({
      where: {
        parent_id: parseInt(id),
      },
    });
    const items = await prisma.tobiratory_items.findMany({
      where: {
        box_id: parseInt(id),
      },
    });
    res.status(200).send({
      status: "success",
      data: {
        parentBox: parentBox,
        items: items,
        boxes: childrenBoxes,
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
