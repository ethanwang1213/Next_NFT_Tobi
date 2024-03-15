import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import Hashids from "hashids";

const prisma = new PrismaClient();

export const permissionGift = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {boxId} = req.body;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const userData = await prisma.tobiratory_accounts.findUnique({
      where: {
        uuid: uid,
      },
    });
    let giftPermission = false;
    if (!boxId) {
      try {
        const userData = await prisma.tobiratory_accounts.findUnique({
          where: {
            uuid: uid,
          },
        });
        const updateInventory = await prisma.tobiratory_accounts.update({
          where: {
            uuid: uid,
          },
          data: {
            gift_permission: userData?.gift_permission,
          },
        });
        giftPermission = updateInventory.gift_permission;
      } catch (error) {
        res.status(401).send({
          status: "error",
          data: error,
        });
        return;
      }
    } else {
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
        if (boxData.creator_uid != uid) {
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
        giftPermission = updatedBox.gift_permission;
      } catch (error) {
        res.status(401).send({
          status: "error",
          data: error,
        });
        return;
      }
    }
    const hashids = new Hashids();
    const address = hashids.encode(userData?.id + boxId);
    res.status(200).send({
      status: "success",
      data: {
        address: address,
        giftPermission: giftPermission,
      },
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
  const {name} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    await prisma.tobiratory_boxes.create({
      data: {
        creator_uid: uid,
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
      const userData = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: uid,
        },
      });
      if (!userData) {
        res.status(401).send({
          status: "error",
          data: "user-not-exist",
        });
        return;
      }
      const boxes = await prisma.tobiratory_boxes.findMany({
        where: {
          creator_uid: uid,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      const returnBoxes = await Promise.all(boxes.map(async (box) => {
        const itemsInBox = await prisma.tobiratory_digital_item_nfts.findMany({
          where: {
            box_id: box.id,
          },
          orderBy: {
            updated_date_time: "desc",
          },
        });
        const items4 = await Promise.all(
            itemsInBox.slice(0, itemsInBox.length>4 ? 4 : itemsInBox.length)
                .map(async (item)=>{
                  const itemInfo = await prisma.tobiratory_digital_items.findUnique({
                    where: {
                      id: item.digital_item_id,
                    },
                  });
                  return {
                    id: item.id,
                    title: itemInfo?.title,
                    image: itemInfo?.image,
                  };
                })
        );
        return {
          id: box.id,
          name: box.name,
          items: items4,
        };
      }));
      const items = await prisma.tobiratory_digital_item_nfts.findMany({
        where: {
          owner_uid: uid,
          box_id: 0,
        },
        orderBy: {
          updated_date_time: "desc",
        },
      });
      const returnItems = await Promise.all(
          items.map(async (item)=>{
            const itemInfo = await prisma.tobiratory_digital_items.findUnique({
              where: {
                id: item.digital_item_id,
              },
            });
            return {
              id: item.id,
              title: itemInfo?.title,
              image: itemInfo?.image,
              saidanId: itemInfo?.saidan_id,
              status: item?.mint_status,
            };
          })
      );
      res.status(200).send({
        status: "success",
        data: {
          giftPermission: userData.gift_permission,
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
    const uuid = decodedToken.uid;
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
    if (box.creator_uid != uuid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    const items = await prisma.tobiratory_digital_item_nfts.findMany({
      where: {
        box_id: parseInt(id),
      },
    });
    const returnItem = await Promise.all(
        items.map(async (item)=>{
          const itemInfo = await prisma.tobiratory_digital_items.findUnique({
            where: {
              id: item.digital_item_id,
            },
          });
          return {
            id: item.id,
            title: itemInfo?.title,
            image: itemInfo?.image,
            saidanId: itemInfo?.saidan_id,
          };
        })
    );
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
    if (box.creator_uid == uid) {
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
