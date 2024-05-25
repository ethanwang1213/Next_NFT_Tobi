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
  const sampleItem = await prisma.tobiratory_sample_items.findUnique({
    where: {
      id: parseInt(id),
      is_deleted: false,
    },
  });
  if (!sampleItem) {
    throw new MintError(404, "SampleItem does not found");
  }

  const digitalItem = await prisma.tobiratory_digital_items.findUnique({
    where: {
      id: sampleItem.digital_item_id,
    },
  });
  if (!digitalItem) {
    throw new MintError(404, "DigitalItem does not found");
  }

  if (sampleItem.content_id) {
    const content = await prisma.tobiratory_contents.findUnique({
      where: {
        id: sampleItem.content_id,
      },
    });
    if (!content) {
      throw new MintError(404, "Content does not found");
    }
  } else {
    if (digitalItem.creator_uuid !== uid) {
      throw new MintError(401, "You are not creator of this digital item");
    }
  }

  if (digitalItem.limit && digitalItem.limit <= 0) {
    throw new MintError(401, "Minting limit reached");
  }

  const itemId = digitalItem.item_id;
  const digitalItemId = digitalItem.id;
  const creatorUuid = digitalItem.creator_uuid;
  const flowAccount = await prisma.tobiratory_flow_accounts.findUnique({
    where: {
      uuid: creatorUuid,
    },
  });
  if (!flowAccount) {
    throw new MintError(404, "FlowAccount does not found");
  }

  let creatorName;
  if (sampleItem.content_id) {
    const content = await prisma.tobiratory_contents.findUnique({
      where: {
        id: sampleItem.content_id,
      },
    });
    if (content) {
      creatorName = content.name;
    } else {
      const user = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: digitalItem.creator_uuid,
        },
      });
      if (!user) {
        throw new MintError(404, "User does not found");
      }
      creatorName = user.username;
    }
  } else {
    const user = await prisma.tobiratory_accounts.findUnique({
      where: {
        uuid: digitalItem.creator_uuid,
      },
    });
    if (!user) {
      throw new MintError(404, "User does not found");
    }
    creatorName = user.username;
  }
  const copyrightRelate = await prisma.tobiratory_digital_items_copyright.findMany({
    where: {
      digital_item_id: digitalItem.id,
    },
  });
  const copyrights = await Promise.all(
      copyrightRelate.map(async (relate)=>{
        const copyrightData = await prisma.tobiratory_copyright.findUnique({
          where: {
            id: relate.copyright_id,
          },
        });
        return copyrightData?.copyright_name;
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
      itemCreatorAddress: flowAccount.flow_address,
      itemId,
      digitalItemId,
      digitalItemNftId: undefined,
      metadata,
      fcmToken,
    }};
    const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
    console.log(`Message ${messageId} published.`);
  } else {
    await prisma.tobiratory_sample_items.update({
      where: {
        id: parseInt(id),
      },
      data: {
        model_url: modelUrl,
      },
    });
    const content = await prisma.tobiratory_contents.findUnique({
      where: {
        owner_uuid: uid,
      },
    });
    const nft = await prisma.tobiratory_digital_item_nfts.create({
      data: {
        digital_item_id: digitalItem.id,
        owner_uuid: uid,
        mint_status: "minting",
        content_id: content?.id,
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
  const digitalData = await prisma.tobiratory_digital_items.findFirst({
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
    if (digitalData.creator_uuid != uid) {
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
  const digitalData = await prisma.tobiratory_digital_items.findFirst({
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
    if (digitalData.creator_uuid != uid) {
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
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const nftData = await prisma.tobiratory_digital_item_nfts.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          digital_item: {
            include: {
              copyright: {
                include: {
                  copyright: true,
                },
              },
            },
          },
          tobiratory_digital_nft_ownership: true,
          user: true,
        },
      });
      if (!nftData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }

      const owners = await Promise.all(
          nftData.tobiratory_digital_nft_ownership.map(async (ownership)=>{
            const userData = await prisma.tobiratory_accounts.findUnique({
              where: {
                uuid: ownership.owner_uuid,
              },
            });
            const business = await prisma.tobiratory_businesses.findFirst({
              where: {
                uuid: ownership.owner_uuid,
              },
            });
            return {
              uid: ownership.owner_uuid,
              avatarUrl: userData==null?"":userData.icon_url,
              isBusinnessAccount: business!=null,
            };
          })
      );
      const content = await prisma.tobiratory_contents.findFirst({
        where: {
          owner_uuid: uid,
        },
      });
      const copyrights = nftData.digital_item.copyright.map(async (relate)=>{
        return relate.copyright?.copyright_name;
      });
      const returnData = {
        content: content!=null?{
          name: content.name,
          sticker: content.sticker,
        }:null,
        name: nftData.digital_item.name,
        modelUrl: nftData.nft_model,
        description: nftData.digital_item.description,
        creator: nftData.user==null?null:{
          uid: nftData.user.uuid,
          name: nftData.user.username,
        },
        copyrights: copyrights,
        license: nftData.digital_item.license,
        acquiredDate: nftData.tobiratory_digital_nft_ownership[0].created_date_time,
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
          data: "not-exist-content",
        });
        return;
      }
      const allNfts = await prisma.tobiratory_digital_item_nfts.findMany({
        where: {
          owner_uuid: uid,
        },
        include: {
          digital_item: true,
          tobiratory_showcase_nfts: true,
        },
      });
      const returnData = allNfts.map((nft) => {
        return {
          id: nft.id,
          name: nft.digital_item.name,
          thumbnail: nft.digital_item?.is_default_thumb?nft.digital_item?.default_thumb_url : nft.digital_item?.custom_thumb_url,
          status: nft.mint_status,
          createDate: nft.created_date_time,
          canAdd: nft.tobiratory_showcase_nfts.length==0,
        };
      });
      res.status(200).send({
        status: "success",
        data: returnData,
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
