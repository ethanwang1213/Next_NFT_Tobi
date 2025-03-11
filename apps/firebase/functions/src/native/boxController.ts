import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";
import {getBoxAddress, mintStatus} from "./utils";

export const updateBoxInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const boxId = Number(id);
  const {name, giftPermission}:{name?: string, giftPermission?: boolean} = req.body;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const userData = await prisma.accounts.findUnique({
      where: {
        uuid: uid,
        is_deleted: false,
      },
    });
    if (!userData) {
      res.status(403).send({
        status: "error",
        data: "user-not-exist",
      });
      return;
    }

    if (!boxId) {
      try {
        await prisma.accounts.update({
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
        const boxData = await prisma.boxes.findUnique({
          where: {
            id: boxId,
            is_deleted: false,
          },
        });
        if (!boxData) {
          res.status(404).send({
            status: "error",
            data: {
              msg: "not-exist",
            },
          });
          return;
        }
        if (boxData.account_uuid != uid) {
          res.status(404).send({
            status: "error",
            data: {
              msg: "not-yours",
            },
          });
          return;
        }
        await prisma.boxes.update({
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
    const updatedUserData = await prisma.accounts.findUnique({
      where: {
        uuid: uid,
      },
    });
    const box = await prisma.boxes.findUnique({
      where: {
        id: boxId,
        is_deleted: false,
      },
    });
    const address = getBoxAddress(updatedUserData?.id??0, boxId);
    res.status(200).send({
      status: "success",
      data: {
        id: boxId,
        name: !boxId?updatedUserData?.username+"'s Inventory":box?.name,
        address: address,
        giftPermission: !boxId?updatedUserData?.gift_permission:box?.gift_permission,
      },
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
  });
};

export const makeBox = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {name} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    await prisma.boxes.create({
      data: {
        account_uuid: uid,
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
      data: error,
    });
  });
};

export const getInventoryData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const userData = await prisma.accounts.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      const boxes = await prisma.boxes.findMany({
        where: {
          account_uuid: uid,
          is_deleted: false,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      const returnBoxes = await Promise.all(boxes.map(async (box) => {
        const itemsInBox = await prisma.nft_owners.findMany({
          where: {
            box_id: box.id,
          },
          include: {
            nft: {
              include: {
                digital_item: {
                  include: {
                    license: true,
                    account: {
                      include: {
                        business: {
                          include: {
                            content: true,
                          },
                        },
                      },
                    },
                    material_image: true,
                  },
                },
                showcase_nft_items: true,
              },
            },
          },
          orderBy: {
            updated_date_time: "desc",
          },
        });
        let boxItems: any[] = [];
        itemsInBox.forEach((nftOwnerRelation) => {
          const nft = nftOwnerRelation.nft;
          let flag = false;
          for (let i = 0; i < boxItems.length; i++) {
            if (boxItems[i].digitalItemId == nft.digital_item.id) {
              boxItems[i].items = [
                ...boxItems[i].items,
                {
                  id: nft.id,
                  status: nft.mint_status,
                  createDate: nft.created_date_time,
                  canAdd: nft.showcase_nft_items.length == 0,
                  saidanId: nftOwnerRelation.saidan_id,
                },
              ];
              flag = true;
              break;
            }
          }
          if (!flag) {
            boxItems = [
              ...boxItems,
              {
                digitalItemId: nft.digital_item.id,
                name: nft.digital_item.name,
                thumbUrl: nft.digital_item?.is_default_thumb ? nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
                modelUrl: nft.digital_item.meta_model_url,
                modelType: nft.digital_item.type,
                materialUrl: nft.digital_item.material_image?.image,
                content: nft.digital_item.account?.business?{
                  name: nft.digital_item.account?.business.content?.name,
                }:null,
                creator: {
                  uuid: nft.digital_item.account?.uuid,
                  username: nft.digital_item.account?.username,
                  avatar: nft.digital_item.account?.icon_url,
                },
                license: nft.digital_item.license,
                mintedCount: nft.digital_item.minted_count,
                limit: nft.digital_item.limit,
                items: [
                  {
                    id: nft.id,
                    status: nft.mint_status,
                    createDate: nft.created_date_time,
                    canAdd: nft.showcase_nft_items.length == 0,
                    saidanId: nftOwnerRelation.saidan_id,
                  },
                ],
              },
            ];
          }
        });
        return {
          id: box.id,
          name: box.name,
          nfts: boxItems,
        };
      }));
      const allNfts = await prisma.nft_owners.findMany({
        where: {
          account_uuid: uid,
          box_id: 0,
        },
        include: {
          nft: {
            include: {
              digital_item: {
                include: {
                  license: true,
                  account: {
                    include: {
                      business: {
                        include: {
                          content: true,
                        },
                      },
                    },
                  },
                  material_image: true,
                },
              },
              showcase_nft_items: true,
            },
          },
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      let returnNFTs: any[] = [];
      allNfts.forEach((nftOwnerRelation) => {
        const nft = nftOwnerRelation.nft;
        // if (nft.mint_status<3) {
        //   returnNFTs = [
        //     ...returnNFTs,
        //     {
        //       digitalItemId: nft.digital_item.id,
        //       name: nft.digital_item.name,
        //       thumbUrl: nft.digital_item?.is_default_thumb ? nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
        //       modelUrl: nft.digital_item.model_url,
        //       modelType: nft.digital_item.type,
        //       materialUrl: nft.digital_item.material_image?.image,
        //       content: nft.digital_item.account.business?{
        //         name: nft.digital_item.account.business.content?.name,
        //       }:null,
        //       items: [
        //         {
        //           id: nft.id,
        //           status: nft.mint_status,
        //           createDate: nft.created_date_time,
        //           canAdd: nft.showcase_nft_items.length == 0,
        //           saidanId: nftOwnerRelation.saidan_id,
        //         },
        //       ],
        //     },
        //   ];
        //   return;
        // }
        let flag = false;
        for (let i = 0; i < returnNFTs.length; i++) {
          if (returnNFTs[i].digitalItemId == nft.digital_item.id) {
            returnNFTs[i].items = [
              ...returnNFTs[i].items,
              {
                id: nft.id,
                status: nft.mint_status,
                createDate: nft.created_date_time,
                canAdd: nft.showcase_nft_items.length == 0,
                saidanId: nftOwnerRelation.saidan_id,
              },
            ];
            flag = true;
            break;
          }
        }
        if (!flag) {
          returnNFTs = [
            ...returnNFTs,
            {
              digitalItemId: nft.digital_item.id,
              name: nft.digital_item.name,
              thumbUrl: nft.digital_item?.is_default_thumb ? nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
              modelUrl: nft.digital_item.meta_model_url,
              modelType: nft.digital_item.type,
              materialUrl: nft.digital_item.material_image?.image,
              content: nft.digital_item.account?.business?{
                name: nft.digital_item.account?.business.content?.name,
              }:null,
              creator: {
                uuid: nft.digital_item.account?.uuid,
                username: nft.digital_item.account?.username,
                avatar: nft.digital_item.account?.icon_url,
              },
              license: nft.digital_item.license,
              mintedCount: nft.digital_item.minted_count,
              limit: nft.digital_item.limit,
              items: [
                {
                  id: nft.id,
                  status: nft.mint_status,
                  createDate: nft.created_date_time,
                  canAdd: nft.showcase_nft_items.length == 0,
                  saidanId: nftOwnerRelation.saidan_id,
                },
              ],
            },
          ];
        }
      });
      res.status(200).send({
        status: "success",
        data: {
          giftPermission: userData?.gift_permission,
          nfts: returnNFTs,
          boxes: returnBoxes,
        },
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: {
          result: error,
        },
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: {
        result: error,
      },
    });
    return;
  });
};

export const getBoxData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uuid = decodedToken.uid;
    const box = await prisma.boxes.findUnique({
      where: {
        id: parseInt(id),
        is_deleted: false,
      },
    });
    if (!box) {
      res.status(404).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (box.account_uuid != uuid) {
      res.status(404).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    const items = await prisma.nft_owners.findMany({
      where: {
        box_id: parseInt(id),
      },
      include: {
        nft: {
          include: {
            digital_item: {
              include: {
                account: {
                  include: {
                    business: {
                      include: {
                        content: true,
                      },
                    },
                  },
                },
                material_image: true,
              },
            },
            showcase_nft_items: true,
          },
        },
      },
    });
    let returnNFTs: any[] = [];
    items.forEach((nftOwnerRelation) => {
      const nft = nftOwnerRelation.nft;
      // if (nft.mint_status<3) {
      //   returnNFTs = [
      //     ...returnNFTs,
      //     {
      //       digitalItemId: nft.digital_item.id,
      //       name: nft.digital_item.name,
      //       thumbUrl: nft.digital_item?.is_default_thumb ? nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
      //       modelUrl: nft.digital_item.model_url,
      //       modelType: nft.digital_item.type,
      //       materialUrl: nft.digital_item.material_image?.image,
      //       content: nft.digital_item.account.business?{
      //         name: nft.digital_item.account.business.content?.name,
      //       }:null,
      //       items: [
      //         {
      //           id: nft.id,
      //           status: nft.mint_status,
      //           createDate: nft.created_date_time,
      //           canAdd: nft.showcase_nft_items.length == 0,
      //           saidanId: nftOwnerRelation.saidan_id,
      //         },
      //       ],
      //     },
      //   ];
      //   return;
      // }
      let flag = false;
      for (let i = 0; i < returnNFTs.length; i++) {
        if (returnNFTs[i].digitalItemId == nft.digital_item.id) {
          returnNFTs[i].items = [
            ...returnNFTs[i].items,
            {
              id: nft.id,
              status: nft.mint_status,
              createDate: nft.created_date_time,
              canAdd: nft.showcase_nft_items.length == 0,
              saidanId: nftOwnerRelation.saidan_id,
            },
          ];
          flag = true;
          break;
        }
      }
      if (!flag) {
        returnNFTs = [
          ...returnNFTs,
          {
            digitalItemId: nft.digital_item.id,
            name: nft.digital_item.name,
            thumbUrl: nft.digital_item?.is_default_thumb ? nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
            modelUrl: nft.digital_item.meta_model_url,
            modelType: nft.digital_item.type,
            materialUrl: nft.digital_item.material_image?.image,
            content: nft.digital_item.account?.business?{
              name: nft.digital_item.account?.business.content?.name,
            }:null,
            items: [
              {
                id: nft.id,
                status: nft.mint_status,
                createDate: nft.created_date_time,
                canAdd: nft.showcase_nft_items.length == 0,
                saidanId: nftOwnerRelation.saidan_id,
              },
            ],
          },
        ];
      }
    });
    res.status(200).send({
      status: "success",
      data: {
        giftPermission: box.gift_permission,
        nfts: returnNFTs,
      },
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
  });
};

export const deleteBoxData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const box = await prisma.boxes.findUnique({
      where: {
        id: parseInt(id),
        is_deleted: false,
      },
    });
    if (!box) {
      res.status(404).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (box.account_uuid != uid) {
      res.status(404).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    await prisma.boxes.update({
      where: {
        id: parseInt(id),
      },
      data: {
        is_deleted: true,
      },
    });
    res.status(200).send({
      status: "success",
      data: "deleted",
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
  });
};

export const openNFT = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id}:{id: number} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const nftData = await prisma.digital_item_nfts.findUnique({
      where: {
        id: id,
      },
      include: {
        nft_owner: true,
      },
    });
    if (!nftData) {
      res.status(404).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (nftData.nft_owner?.account_uuid != uid) {
      res.status(404).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    if (nftData.mint_status == mintStatus.minting) {
      res.status(401).send({
        status: "error",
        data: "minting",
      });
      return;
    }
    if (nftData.mint_status == mintStatus.opened) {
      res.status(401).send({
        status: "error",
        data: "already-opened",
      });
      return;
    }
    try {
      const updatedNFT = await prisma.digital_item_nfts.update({
        where: {
          id: id,
        },
        data: {
          mint_status: mintStatus.opened,
        },
        include: {
          digital_item: {
            include: {
              material_image: true,
              account: {
                include: {
                  business: {
                    include: {
                      content: true,
                    },
                  },
                },
              },
            },
          },
          nft_owner: true,
          showcase_nft_items: true,
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          digitalItemId: updatedNFT.digital_item.id,
          name: updatedNFT.digital_item.name,
          thumbUrl: updatedNFT.digital_item?.is_default_thumb ? updatedNFT.digital_item?.default_thumb_url : updatedNFT.digital_item?.custom_thumb_url,
          modelUrl: updatedNFT.digital_item.meta_model_url,
          modelType: updatedNFT.digital_item.type,
          materialUrl: updatedNFT.digital_item.material_image?.image,
          content: updatedNFT.digital_item.account?.business?{
            name: updatedNFT.digital_item.account?.business.content?.name,
          }:null,
          items: [
            {
              id: updatedNFT.id,
              status: updatedNFT.mint_status,
              createDate: updatedNFT.created_date_time,
              canAdd: updatedNFT.showcase_nft_items.length == 0,
              saidanId: updatedNFT.nft_owner?.saidan_id,
            },
          ],
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
  });
};

export const userInfoFromAddress = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {address}:{address: string} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    const encodedAddress = address.replace("TB", "") + "==";
    const decodeAddress = Buffer.from(encodedAddress, "base64").toString();
    const receiverId = decodeAddress.split("_")[0];
    const receiverBoxId = decodeAddress.split("_")[1];

    try {
      const receiverUserData = await prisma.accounts.findUnique({
        where: {
          id: parseInt(receiverId),
          is_deleted: false,
        },
        include: {
          flow_account: true,
        },
      });
      if (!receiverUserData) {
        res.status(404).send({
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
            flowAddress: receiverUserData.flow_account?.flow_address,
          },
        });
      } else {
        const receiverBoxData = await prisma.boxes.findUnique({
          where: {
            id: parseInt(receiverBoxId),
            is_deleted: false,
          },
        });
        if (!receiverBoxData) {
          res.status(404).send({
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
            flowAddress: receiverUserData.flow_account?.flow_address,
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
      data: error,
    });
  });
};

export const moveNFT = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {boxId, nfts}:{boxId: number, nfts: number[]} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const boxData = await prisma.boxes.findUnique({
        where: {
          id: boxId,
          is_deleted: false,
        },
      });
      if (!boxData&&boxId) {
        res.status(404).send({
          status: "error",
          data: "box-not-exist",
        });
        return;
      }
      for (const nftId of nfts) {
        const nftData = await prisma.digital_item_nfts.findUnique({
          where: {
            id: nftId,
          },
          include: {
            nft_owner: true,
          },
        });
        if (!nftData) {
          res.status(401).send({
            status: "error",
            data: "not-exist",
          });
          return;
        }
        if (nftData.nft_owner?.account_uuid != uid) {
          res.status(401).send({
            status: "error",
            data: "exist-not-yours",
          });
          return;
        }
      }
      await prisma.nft_owners.updateMany({
        where: {
          nft_id: {
            in: nfts,
          },
        },
        data: {
          box_id: boxId,
        },
      });
      const boxes = await prisma.boxes.findMany({
        where: {
          account_uuid: uid,
          is_deleted: false,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      const returnBoxes = await Promise.all(boxes.map(async (box) => {
        const itemsInBox = await prisma.nft_owners.findMany({
          where: {
            box_id: box.id,
          },
          include: {
            nft: {
              include: {
                digital_item: {
                  include: {
                    account: {
                      include: {
                        business: {
                          include: {
                            content: true,
                          },
                        },
                      },
                    },
                    material_image: true,
                  },
                },
                showcase_nft_items: true,
              },
            },
          },
          orderBy: {
            updated_date_time: "desc",
          },
        });
        let boxItems: any[] = [];
        itemsInBox.forEach((nftOwnerRelation) => {
          const nft = nftOwnerRelation.nft;
          let flag = false;
          for (let i = 0; i < boxItems.length; i++) {
            if (boxItems[i].digitalItemId == nft.digital_item.id) {
              boxItems[i].items = [
                ...boxItems[i].items,
                {
                  id: nft.id,
                  status: nft.mint_status,
                  createDate: nft.created_date_time,
                  canAdd: nft.showcase_nft_items.length == 0,
                  saidanId: nftOwnerRelation.saidan_id,
                },
              ];
              flag = true;
              break;
            }
          }
          if (!flag) {
            boxItems = [
              ...boxItems,
              {
                digitalItemId: nft.digital_item.id,
                name: nft.digital_item.name,
                thumbUrl: nft.digital_item?.is_default_thumb ? nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
                modelUrl: nft.digital_item.meta_model_url,
                modelType: nft.digital_item.type,
                materialUrl: nft.digital_item.material_image?.image,
                content: nft.digital_item.account?.business?{
                  name: nft.digital_item.account?.business.content?.name,
                }:null,
                items: [
                  {
                    id: nft.id,
                    status: nft.mint_status,
                    createDate: nft.created_date_time,
                    canAdd: nft.showcase_nft_items.length == 0,
                    saidanId: nftOwnerRelation.saidan_id,
                  },
                ],
              },
            ];
          }
        });
        return {
          id: box.id,
          name: box.name,
          items: boxItems,
        };
      }));
      const items = await prisma.nft_owners.findMany({
        where: {
          account_uuid: uid,
          box_id: 0,
        },
        include: {
          nft: {
            include: {
              digital_item: true,
            },
          },
        },
        orderBy: {
          updated_date_time: "desc",
        },
      });
      const returnItems = items.map((item)=>{
        return {
          id: item.id,
          name: item.nft.digital_item?.name,
          image: item.nft.digital_item?.is_default_thumb?item.nft.digital_item.default_thumb_url:item.nft.digital_item?.custom_thumb_url,
          saidanId: item.saidan_id,
          status: item.nft.mint_status,
        };
      });
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
      data: error,
    });
  });
};

export const adminGetBoxList = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.businesses.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const inventory = await prisma.accounts.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      const boxes = await prisma.boxes.findMany({
        where: {
          account_uuid: uid,
          is_deleted: false,
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
