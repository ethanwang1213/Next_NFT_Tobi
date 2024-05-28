import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";
import {getBoxAddress} from "./utils";

export const updateBoxInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const boxId = Number(id);
  const {name, giftPermission}:{name?: string, giftPermission?: boolean} = req.body;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const userData = await prisma.tobiratory_accounts.findUnique({
      where: {
        uuid: uid,
      },
    });

    if (!boxId) {
      try {
        await prisma.tobiratory_accounts.update({
          where: {
            uuid: uid,
          },
          data: {
            gift_permission: giftPermission,
          },
        });
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
        if (boxData == null) {
          res.status(404).send({
            status: "error",
            data: {
              msg: "not-exist",
            },
          });
          return;
        }
        if (boxData.creator_uuid != uid) {
          res.status(403).send({
            status: "error",
            data: {
              msg: "not-yours",
            },
          });
          return;
        }
        await prisma.tobiratory_boxes.update({
          where: {
            id: boxId,
          },
          data: {
            gift_permission: giftPermission,
            name: name,
          },
        });
      } catch (error) {
        res.status(401).send({
          status: "errorr",
          data: error,
        });
        return;
      }
    }
    const updateUserData = await prisma.tobiratory_accounts.findUnique({
      where: {
        uuid: uid,
      },
    });
    const box = await prisma.tobiratory_boxes.findUnique({
      where: {
        id: boxId,
      },
    });
    const address = getBoxAddress(userData?.id??0, boxId);
    res.status(200).send({
      status: "success",
      data: {
        id: boxId,
        name: !boxId?updateUserData?.username+"'s Inventory":box?.name,
        address: address,
        giftPermission: !boxId?updateUserData?.gift_permission:box?.gift_permission,
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
        creator_uuid: uid,
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
          creator_uuid: uid,
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
          include: {
            digital_item: true,
          },
          orderBy: {
            updated_date_time: "desc",
          },
        });
        const items4 = itemsInBox.slice(0, itemsInBox.length>4 ? 4 : itemsInBox.length)
            .map((item)=>{
              return {
                id: item.id,
                name: item.digital_item.name,
                image: item.digital_item.is_default_thumb?item.digital_item.default_thumb_url:item.digital_item.custom_thumb_url,
              };
            });
        return {
          id: box.id,
          name: box.name,
          items: items4,
        };
      }));
      const items = await prisma.tobiratory_digital_item_nfts.findMany({
        where: {
          owner_uuid: uid,
          box_id: 0,
        },
        include: {
          digital_item: true,
        },
        orderBy: {
          updated_date_time: "desc",
        },
      });
      const returnItems = items.map((item)=>{
        return {
          id: item.id,
          name: item.digital_item.name,
          image: item.digital_item.is_default_thumb?item.digital_item.default_thumb_url:item.digital_item.custom_thumb_url,
          saidanId: item.saidan_id,
          status: item?.mint_status,
        };
      });
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
    if (box.creator_uuid != uuid) {
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
      include: {
        digital_item: true,
      },
    });
    const returnItem = items.map((item)=>{
      return {
        id: item.id,
        name: item.digital_item.name,
        image: item.digital_item.is_default_thumb?item.digital_item.default_thumb_url:item.digital_item.custom_thumb_url,
        saidanId: item?.saidan_id,
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
      status: "error",
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
    if (box.creator_uuid != uid) {
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
      status: "error",
      data: error.code,
    });
  });
};

export const openNFT = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id}:{id: number} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const nftData = await prisma.tobiratory_digital_item_nfts.findUnique({
      where: {
        id: id,
      },
    });
    if (nftData == null) {
      res.status(401).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (nftData.owner_uuid != uid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    if (nftData.mint_status == "minting") {
      res.status(401).send({
        status: "error",
        data: "minting",
      });
      return;
    }
    if (nftData.mint_status == "opened") {
      res.status(401).send({
        status: "error",
        data: "already-opened",
      });
      return;
    }
    try {
      const updatedNFT = await prisma.tobiratory_digital_item_nfts.update({
        where: {
          id: id,
        },
        data: {
          mint_status: "opened",
        },
      });
      const itemData = await prisma.tobiratory_digital_items.findUnique({
        where: {
          id: updatedNFT.digital_item_id,
        },
      });
      if (!itemData) {
        res.status(401).send({
          status: "error",
          data: "not-exist-item",
        });
        return;
      }
      res.status(200).send({
        status: "success",
        data: {
          id: updatedNFT.id,
          name: itemData.name,
          image: itemData?.is_default_thumb?itemData.default_thumb_url:itemData?.custom_thumb_url,
          saidanId: updatedNFT.saidan_id,
          status: updatedNFT.mint_status,
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

export const userInfoFromAddress = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {address}:{address: string} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (/* decodedToken: DecodedIdToken*/) => {
    // const uid = decodedToken.uid;
    const encodedAddress = address.replace("TB", "") + "==";
    const decodeAddress = Buffer.from(encodedAddress, "base64").toString();
    const receiverId = decodeAddress.split("_")[0];
    const receiverBoxId = decodeAddress.split("_")[1];

    try {
      const receiverUserData = await prisma.tobiratory_accounts.findUnique({
        where: {
          id: parseInt(receiverId),
        },
      });
      if (receiverUserData == null) {
        res.status(401).send({
          status: "error",
          data: "not-exist-receiver",
        });
        return;
      }
      if (!parseInt(receiverBoxId)) {
        res.status(200).send({
          status: "success",
          data: {
            uuid: receiverUserData.uuid,
            userId: receiverUserData.user_id,
            username: receiverUserData.username,
            icon: receiverUserData.icon_url,
            boxName: receiverUserData.username + "'s Inventory",
          },
        });
      } else {
        const receiverBoxData = await prisma.tobiratory_boxes.findUnique({
          where: {
            id: parseInt(receiverBoxId),
          },
        });
        if (receiverBoxData == null) {
          res.status(401).send({
            status: "error",
            data: "not-exist-box",
          });
          return;
        }
        res.status(200).send({
          status: "success",
          data: {
            uuid: receiverUserData.uuid,
            userId: receiverUserData.user_id,
            username: receiverUserData.username,
            icon: receiverUserData.icon_url,
            boxName: receiverBoxData.name,
          },
        });
      }
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

export const moveNFT = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {boxId, nfts}:{boxId: number, nfts: number[]} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const boxData = await prisma.tobiratory_boxes.findUnique({
        where: {
          id: boxId,
        },
      });
      if (!boxData&&boxId) {
        res.status(401).send({
          status: "error",
          data: "box-not-exist",
        });
        return;
      }
      for (const nftId of nfts) {
        const nftData = await prisma.tobiratory_digital_item_nfts.findUnique({
          where: {
            id: nftId,
          },
        });
        if (!nftData) {
          res.status(401).send({
            status: "error",
            data: "not-exist",
          });
          return;
        }
        if (nftData.owner_uuid != uid) {
          res.status(401).send({
            status: "error",
            data: "exist-not-yours",
          });
          return;
        }
      }
      await prisma.tobiratory_digital_item_nfts.updateMany({
        where: {
          id: {
            in: nfts,
          },
        },
        data: {
          box_id: boxId,
        },
      });
      const boxes = await prisma.tobiratory_boxes.findMany({
        where: {
          creator_uuid: uid,
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
                    name: itemInfo?.name,
                    image: itemInfo?.is_default_thumb?itemInfo.default_thumb_url:itemInfo?.custom_thumb_url,
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
          owner_uuid: uid,
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
              name: itemInfo?.name,
              image: itemInfo?.is_default_thumb?itemInfo.default_thumb_url:itemInfo?.custom_thumb_url,
              saidanId: item.saidan_id,
              status: item.mint_status,
            };
          })
      );
      res.status(200).send({
        status: "success",
        data: {
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

export const deleteNFT = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {nfts}:{nfts: number[]} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      for (const nftId of nfts) {
        const nftData = await prisma.tobiratory_digital_item_nfts.findUnique({
          where: {
            id: nftId,
          },
        });
        if (!nftData) {
          res.status(401).send({
            status: "error",
            data: "not-exist",
          });
          return;
        }
        if (nftData.owner_uuid != uid) {
          res.status(401).send({
            status: "error",
            data: "exist-not-yours",
          });
          return;
        }
      }
      await prisma.tobiratory_digital_item_nfts.deleteMany({
        where: {
          id: {
            in: nfts,
          },
        },
      });
      const boxes = await prisma.tobiratory_boxes.findMany({
        where: {
          creator_uuid: uid,
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
                    name: itemInfo?.name,
                    image: itemInfo?.is_default_thumb?itemInfo.default_thumb_url:itemInfo?.custom_thumb_url,
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
          owner_uuid: uid,
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
              name: itemInfo?.name,
              image: itemInfo?.is_default_thumb?itemInfo.default_thumb_url:itemInfo?.custom_thumb_url,
              saidanId: item.saidan_id,
              status: item.mint_status,
            };
          })
      );
      res.status(200).send({
        status: "success",
        data: {
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

export const adminGetBoxList = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.tobiratory_businesses.findFirst({
        where: {
          uuid: uid,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const content = await prisma.tobiratory_contents.findFirst({
        where: {
          owner_uuid: uid,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const inventory = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: uid,
        },
      });
      const boxes = await prisma.tobiratory_boxes.findMany({
        where: {
          creator_uuid: uid,
        },
      });
      const inventoryAddress = getBoxAddress(inventory?.id??0, 0);
      const returnData = {
        giftPermission: inventory?.gift_permission,
        address: inventoryAddress,
        boxes: boxes.map((box)=>{
          return {
            id: box.id,
            name: box.name,
            giftPermission: box.gift_permission,
            address: getBoxAddress(inventory?.id??0, box.id),
          };
        }),
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
