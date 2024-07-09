import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError, storage} from "firebase-admin";
import {v4 as uuidv4} from "uuid";
import {TOPIC_NAMES} from "../lib/constants";
import {PubSub} from "@google-cloud/pubsub";
import {pushToDevice} from "../appSendPushMessage";
import {prisma} from "../prisma";

const pubsub = new PubSub();

export const mintNFT = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {fcmToken, amount, modelUrl} = req.body;
  if (!fcmToken || !modelUrl) {
    res.status(401).send({
      status: "error",
      data: "invalid-params",
    });
    return;
  }
  let intAmount = parseInt(amount);
  if (amount && intAmount <= 0) {
    res.status(401).send({
      status: "error",
      data: "invalid-amount",
    });
    return;
  } else if (!amount) {
    intAmount = 1;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      for (let i = 0; i < intAmount; i++) {
        await mint(id, uid, fcmToken, modelUrl);
      }
      res.status(200).send({
        status: "success",
        data: "NFT is minting",
      });
    } catch (err) {
      if (err instanceof MintError) {
        res.status(err.status).send({
          status: "error",
          data: err.message,
        });
      } else {
        res.status(401).send({
          status: "error",
          data: err,
        });
      }
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    throw error;
  });
};

class MintError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const mint = async (id: string, uid: string, fcmToken: string, modelUrl: string) => {
  const digitalItem = await prisma.digital_items.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      account: {
        include: {
          business: {
            include: {
              content: true,
            },
          },
          flow_account: true,
        },
      },
    },
  });
  if (!digitalItem) {
    throw new MintError(404, "DigitalItem does not found");
  }

  if (!digitalItem.account.business?.content) {
    throw new MintError(404, "Content does not found");
  } else {
    if (digitalItem.account_uuid !== uid) {
      throw new MintError(401, "You are not creator of this digital item");
    }
  }

  if (digitalItem.limit && digitalItem.limit <= 0) {
    throw new MintError(401, "Minting limit reached");
  }

  const itemId = digitalItem.item_id;
  const digitalItemId = digitalItem.id;

  if (!digitalItem.account.flow_account) {
    throw new MintError(404, "FlowAccount does not found");
  }

  let creatorName;
  if (digitalItem.account.business.content) {
    creatorName = digitalItem.account.business.content.name;
  } else {
    if (!digitalItem.account) {
      throw new MintError(404, "User does not found");
    }
    creatorName = digitalItem.account.username;
  }

  const copyrightRelate = await prisma.digital_items_copyright.findMany({
    where: {
      digital_item_id: digitalItem.id,
    },
  });
  const copyrights = await Promise.all(
      copyrightRelate.map(async (relate)=>{
        const copyrightData = await prisma.copyrights.findUnique({
          where: {
            id: relate.copyright_id,
          },
        });
        return copyrightData?.name;
      })
  );

  const metadata = {
    type: String(digitalItem.type),
    name: digitalItem.name,
    description: digitalItem.description,
    thumbnailUrl: digitalItem.is_default_thumb?digitalItem.default_thumb_url:digitalItem.custom_thumb_url,
    modelUrl: modelUrl,
    creatorName: creatorName,
    limit: digitalItem.limit,
    license: digitalItem.license,
    copyrightHolders: copyrights,
  };

  if (itemId) {
    const flowJobId = uuidv4();
    const message = {flowJobId, txType: "mintNFT", params: {
      tobiratoryAccountUuid: uid,
      itemCreatorAddress: digitalItem.account.flow_account.flow_address,
      itemId,
      digitalItemId,
      digitalItemNftId: undefined,
      metadata,
      fcmToken,
    }};
    const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
    console.log(`Message ${messageId} published.`);
  } else {
    const nft = await prisma.digital_item_nfts.create({
      data: {
        digital_item_id: digitalItem.id,
        account_uuid: uid,
        mint_status: "minting",
      },
    });
    const flowJobId = uuidv4();
    const message = {flowJobId, txType: "createItem", params: {
      tobiratoryAccountUuid: uid,
      digitalItemNftId: nft.id,
      digitalItemId,
      metadata,
      fcmToken,
    }};
    const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
    console.log(`Message ${messageId} published.`);
  }

  pushToDevice(fcmToken, {
    title: "NFTの作成を開始しました",
    body: "作成完了までしばらくお待ちください",
  }, {
    body: JSON.stringify({
      type: "mintBegan",
      data: {id: digitalItemId},
    }),
  });
};

export const giftNFT = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {receiveFlowId, fcmToken} = req.body;
  if (!receiveFlowId || !fcmToken) {
    res.status(401).send({
      status: "error",
      data: "invalid-params",
    });
    return;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      await gift(parseInt(id), uid, receiveFlowId, fcmToken);
      res.status(200).send({
        status: "success",
        data: "NFT is gifting",
      });
    } catch (err) {
      if (err instanceof GiftError) {
        res.status(err.status).send({
          status: "error",
          data: err.message,
        });
      } else {
        res.status(401).send({
          status: "error",
          data: err,
        });
      }
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    throw error;
  });
};

class GiftError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const gift = async (id: number, uid: string, receiveFlowId: string, fcmToken: string) => {
  const digitalItemNft = await prisma.digital_item_nfts.findUnique({
    where: {
      id: id,
    },
    include: {
      account: {
        include: {
          flow_account: true,
        },
      },
    },
  });
  if (!digitalItemNft) {
    throw new GiftError(404, "NFT does not found");
  }
  if (digitalItemNft.account_uuid !== uid) {
    throw new GiftError(401, "You are not owner of this NFT");
  }
  if (!digitalItemNft.account?.flow_account) {
    throw new GiftError(404, "FlowAccount does not found");
  }
  if (digitalItemNft.account?.flow_account.flow_address === receiveFlowId) {
    throw new GiftError(401, "You can not gift to yourself");
  }
  if (digitalItemNft.gift_status === "gifting") {
    throw new GiftError(401, "This NFT is gifting now");
  }
  const flowJobId = uuidv4();
  const message = {flowJobId, txType: "giftNFT", params: {
    tobiratoryAccountUuid: uid,
    digitalItemNftId: digitalItemNft.id,
    receiveFlowId,
    fcmToken,
  }};
  const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
  console.log(`Message ${messageId} published.`);
  pushToDevice(fcmToken, {
    title: "NFTをギフトしています",
    body: "ギフト完了までしばらくお待ちください",
  }, {
    body: JSON.stringify({
      type: "transferBegan",
      data: {id: id},
    }),
  });
};

export const fetchNftThumb = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {mediaUrl}:{mediaUrl: string} = req.body;
  const storageBucket = storage().bucket();
  const prefixUrl = "https://firebasestorage.googleapis.com/v0/b/tobiratory-f6ae1.appspot.com/o/";
  if (!mediaUrl.includes(prefixUrl)) {
    res.status(401).send({
      status: "error",
      data: "invalid-thumb",
    });
    return;
  }
  const bucketUrl = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1).split("?")[0];
  const file = storageBucket.file(bucketUrl);
  const digitalData = await prisma.digital_items.findFirst({
    where: {
      OR: [
        {default_thumb_url: mediaUrl},
        {custom_thumb_url: mediaUrl},
      ],
    },
  });
  if (!digitalData) {
    res.status(401).send({
      status: "error",
      data: "digital-not-exist",
    });
    return;
  }
  if (digitalData.status>2) {
    try {
      const download = await file.download();
      res.status(200).send({
        status: "success",
        data: download[0],
      });
      return;
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
      return;
    }
  }
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    if (digitalData.account_uuid != uid) {
      const placeHolderImageUrl = "images/Journal_book_TOBIRAPOLIS_2.png";
      const placeHolderFile = storageBucket.file(placeHolderImageUrl);
      const download = await placeHolderFile.download();
      res.status(200).send({
        status: "success",
        data: download[0],
      });
      return;
    }
    const download = await file.download();
    res.status(200).send({
      status: "success",
      data: download[0],
    });
    return;
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const fetchNftModel = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {modelUrl}:{modelUrl: string} = req.body;
  const storageBucket = storage().bucket();
  const prefixUrl = "https://firebasestorage.googleapis.com/v0/b/tobiratory-f6ae1.appspot.com/o/";
  if (!modelUrl.includes(prefixUrl)) {
    res.status(401).send({
      status: "error",
      data: "invalid-model",
    });
    return;
  }
  const bucketUrl = modelUrl.substring(modelUrl.lastIndexOf("/") + 1).split("?")[0];
  const file = storageBucket.file(bucketUrl);
  const digitalData = await prisma.digital_items.findFirst({
    where: {
      OR: [
        {default_thumb_url: modelUrl},
        {custom_thumb_url: modelUrl},
      ],
    },
  });
  if (!digitalData) {
    res.status(401).send({
      status: "error",
      data: "digital-not-exist",
    });
    return;
  }
  if (digitalData.status>2) {
    try {
      const download = await file.download();
      res.status(200).send({
        status: "success",
        data: download,
      });
      return;
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
      return;
    }
  }
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    if (digitalData.account_uuid != uid) {
      const placeHolderImageUrl = "images/Journal_book_TOBIRAPOLIS_2.png";
      const placeHolderFile = storageBucket.file(placeHolderImageUrl);
      const download = await placeHolderFile.download();
      res.status(200).send({
        status: "success",
        data: download,
      });
      return;
    }
    const download = await file.download();
    res.status(200).send({
      status: "success",
      data: download,
    });
    return;
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getNftInfo = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const nftData = await prisma.digital_item_nfts.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          digital_item: {
            include: {
              copyrights: {
                include: {
                  copyright: true,
                },
              },
            },
          },
          owner_hisotory: {
            include: {
              account: {
                include: {
                  business: true,
                },
              },
            },
          },
          account: true,
        },
      });
      if (!nftData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const owners = nftData.owner_hisotory.map((ownership)=>{
        return {
          uid: ownership.account_uuid,
          avatarUrl: ownership.account==null?"":ownership.account.icon_url,
          isBusinnessAccount: ownership.account?.business!=null,
        };
      });
      const content = await prisma.contents.findFirst({
        where: {
          businesses_uuid: nftData.account_uuid??"",
        },
      });
      const copyrights = nftData.digital_item.copyrights.map((relate)=>{
        return relate.copyright.name;
      });
      const returnData = {
        content: content!=null?{
          name: content.name,
          sticker: content.sticker,
        }:null,
        name: nftData.digital_item.name,
        modelUrl: nftData.digital_item.model_url,
        description: nftData.digital_item.description,
        creator: nftData.account==null?null:{
          uid: nftData.account.uuid,
          name: nftData.account.username,
        },
        copyrights: copyrights,
        license: nftData.digital_item.license,
        acquiredDate: nftData.owner_hisotory[0].created_date_time,
        certImageUrl: "",
        sn: nftData.serial_no,
        owners: owners,
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
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const adminGetAllNFTs = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.businesses.findFirst({
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
      const content = await prisma.contents.findFirst({
        where: {
          businesses_uuid: uid,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-exist-content",
        });
        return;
      }
      const boxes = await prisma.boxes.findMany({
        where: {
          account_uuid: uid,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      const returnBoxes = await Promise.all(boxes.map(async (box) => {
        const itemsInBox = await prisma.digital_item_nfts.findMany({
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
      const allNfts = await prisma.digital_item_nfts.findMany({
        where: {
          account_uuid: uid,
          box_id: 0,
        },
        include: {
          digital_item: true,
          showcase_nft_items: true,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });
      let returnNFTs: any[] = [];
      allNfts.map((nft) => {
        let flag = false;
        for (let i = 0; i < returnNFTs.length; i++) {
          if (returnNFTs[i].digitalItemId == nft.digital_item.id) {
            returnNFTs[i].items = [
              ...returnNFTs[i].items,
              {
                id: nft.id,
                name: nft.digital_item.name,
                thumbnail: nft.digital_item?.is_default_thumb?nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
                status: nft.mint_status,
                createDate: nft.created_date_time,
                canAdd: nft.showcase_nft_items.length==0,
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
              items: [
                {
                  id: nft.id,
                  name: nft.digital_item.name,
                  thumbnail: nft.digital_item?.is_default_thumb?nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
                  status: nft.mint_status,
                  createDate: nft.created_date_time,
                  canAdd: nft.showcase_nft_items.length==0,
                },
              ],
            },
          ];
        }

        return {
          id: nft.id,
          name: nft.digital_item.name,
          thumbnail: nft.digital_item?.is_default_thumb?nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
          status: nft.mint_status,
          createDate: nft.created_date_time,
          canAdd: nft.showcase_nft_items.length==0,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          items: returnNFTs,
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
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: {
        result: error.code,
      },
    });
    return;
  });
};

export const adminGetBoxData = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uuid = decodedToken.uid;
    const box = await prisma.boxes.findUnique({
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
    if (box.account_uuid != uuid) {
      res.status(401).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    const allNfts = await prisma.digital_item_nfts.findMany({
      where: {
        box_id: parseInt(id),
      },
      include: {
        digital_item: true,
        showcase_nft_items: true,
      },
      orderBy: {
        created_date_time: "desc",
      },
    });
    let returnNFTs: any[] = [];
    allNfts.map((nft) => {
      let flag = false;
      for (let i = 0; i < returnNFTs.length; i++) {
        if (returnNFTs[i].digitalItemId == nft.digital_item.id) {
          returnNFTs[i].items = [
            ...returnNFTs[i].items,
            {
              id: nft.id,
              name: nft.digital_item.name,
              thumbnail: nft.digital_item?.is_default_thumb?nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
              status: nft.mint_status,
              createDate: nft.created_date_time,
              canAdd: nft.showcase_nft_items.length==0,
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
            items: [
              {
                id: nft.id,
                name: nft.digital_item.name,
                thumbnail: nft.digital_item?.is_default_thumb?nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
                status: nft.mint_status,
                createDate: nft.created_date_time,
                canAdd: nft.showcase_nft_items.length==0,
              },
            ],
          },
        ];
      }

      return {
        id: nft.id,
        name: nft.digital_item.name,
        thumbnail: nft.digital_item?.is_default_thumb?nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
        status: nft.mint_status,
        createDate: nft.created_date_time,
        canAdd: nft.showcase_nft_items.length==0,
      };
    });
    res.status(200).send({
      status: "success",
      data: {
        items: returnNFTs,
      },
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
  });
};
