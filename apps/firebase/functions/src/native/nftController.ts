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
  const {fcmToken} = req.body;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;

    const sampleItem = await prisma.tobiratory_sample_items.findFirst({
      where: {
        id: parseInt(id),
        is_deleted: false,
      },
    });
    if (!sampleItem) {
      res.status(404).send({
        status: "error",
        data: "SampleItem does not found",
      });
      return;
    }

    const digitalItem = await prisma.tobiratory_digital_items.findUnique({
      where: {
        id: sampleItem.digital_item_id,
      },
    });
    if (!digitalItem) {
      res.status(404).send({
        status: "error",
        data: "DigitalItem does not found",
      });
      return;
    }

    if (sampleItem.content_id) {
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          id: sampleItem.content_id,
        },
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "Content does not found",
        });
        return;
      }
      if (content.owner_uuid !== uid) {
        res.status(401).send({
          status: "error",
          data: "You are not owner of this content",
        });
        return;
      }
    } else {
      if (digitalItem.creator_uuid !== uid) {
        res.status(401).send({
          status: "error",
          data: "You are not creator of this digital item",
        });
        return;
      }
    }

    if (digitalItem.limit && digitalItem.limit <= 0) {
      res.status(401).send({
        status: "error",
        data: "Minting limit reached",
      });
      return;
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
      res.status(404).send({
        status: "error",
        data: "FlowAccount does not found",
      });
      return;
    }
    if (itemId) {
      const flowJobId = uuidv4();
      const message = {flowJobId, txType: "mintNFT", params: {
        tobiratoryAccountUuid: uid,
        itemCreatorAddress: flowAccount.flow_address,
        itemId,
        digitalItemId,
        fcmToken,
      }};
      const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
      console.log(`Message ${messageId} published.`);
    } else {
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
            res.status(404).send({
              status: "error",
              data: "User does not found",
            });
            return;
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
          res.status(404).send({
            status: "error",
            data: "User does not found",
          });
          return;
        }
        creatorName = user.username;
      }
      const copyrightRelate = await prisma.tobiratory_digital_items_copyright.findMany({
        where: {
          id: digitalItem.id,
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
        modelUrl: sampleItem.model_url,
        creatorName: creatorName,
        limit: digitalItem.limit,
        license: digitalItem.license,
        copyrightHolders: copyrights,
      };
      const flowJobId = uuidv4();
      const message = {flowJobId, txType: "createItem", params: {tobiratoryAccountUuid: uid, digitalItemId, metadata, fcmToken}};
      const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
      console.log(`Message ${messageId} published.`);
      await prisma.tobiratory_digital_item_nfts.update({
        where: {
          id: digitalItemId,
        },
        data: {
          nft_metadata: JSON.stringify(metadata),
          nft_model: sampleItem.model_url,
        },
      });
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

    res.status(200).send({
      status: "success",
      data: "NFT is minting",
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    throw error;
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
      });
      if (!nftData) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (nftData.owner_uuid!=uid) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      const digitalData = await prisma.tobiratory_digital_items.findUnique({
        where: {
          id: nftData.digital_item_id,
        },
      });
      if (!digitalData) {
        res.status(401).send({
          status: "error",
          data: "digital-not-exist",
        });
        return;
      }
      const ownerships = await prisma.tobiratory_digital_nft_ownership.findMany({
        where: {
          nft_id: nftData.id,
        },
        orderBy: {
          created_date_time: "desc",
        },
      });

      if (!ownerships.length||ownerships[0].owner_uuid!=uid) {
        res.status(401).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }
      const owners = await Promise.all(
          ownerships.map(async (ownership)=>{
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
      const creatorData = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: digitalData.creator_uuid,
        },
      });
      const content = await prisma.tobiratory_contents.findFirst({
        where: {
          owner_uuid: uid,
        },
      });
      const copyrightRelate = await prisma.tobiratory_digital_items_copyright.findMany({
        where: {
          digital_item_id: digitalData.id,
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
      const returnData = {
        content: content!=null?{
          name: content.name,
        }:null,
        name: digitalData.name,
        modelUrl: nftData.nft_model,
        description: digitalData.description,
        creator: creatorData==null?null:{
          uid: creatorData.uuid,
          name: creatorData.username,
        },
        copyrights: copyrights,
        license: digitalData.license,
        acquiredDate: ownerships[0].created_date_time,
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
