import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
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
      if (content.creator_user_id !== uid) {
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
          creatorName = content.title;
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
        modelUrl: digitalItem.nft_model,
        creatorName: creatorName,
        limit: digitalItem.limit,
        license: digitalItem.license,
        copyrightHolders: copyrights,
      };
      const flowJobId = uuidv4();
      const message = {flowJobId, txType: "createItem", params: {tobiratoryAccountUuid: uid, digitalItemId, metadata, fcmToken}};
      const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
      console.log(`Message ${messageId} published.`);
      await prisma.tobiratory_digital_items.update({
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
            return {
              uid: ownership.owner_uuid,
              avatarUrl: userData==null?"":userData.icon_url,
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
          creator_user_id: uid,
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
          name: content.title
        }:null,
        name: digitalData.name,
        modelUrl: digitalData.nft_model,
        description: digitalData.description,
        creator: creatorData==null?null:{
          uid: creatorData.uuid,
          name: creatorData.username,
        },
        copyrights: copyrights,
        license: digitalData.license,
        acquiredDate: ownerships[0].created_date_time,
        certImageUrl: "",
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

export const getCopyrights = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const copyrights = await prisma.tobiratory_copyright.findMany();
      const returnData = copyrights.map((copyright)=> {
        return {
          id: copyright.id,
          name: copyright.copyright_name,
        }
      });
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
}