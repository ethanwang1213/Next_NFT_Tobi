import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {v4 as uuidv4} from "uuid";
import {TOPIC_NAMES} from "../lib/constants";
import {PubSub} from "@google-cloud/pubsub";
import {pushToDevice} from "../appSendPushMessage";

const pubsub = new PubSub();
const prisma = new PrismaClient();

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

    if (digitalItem.content_id) {
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          id: digitalItem.content_id,
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
          fcmToken
      }};
      const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
      console.log(`Message ${messageId} published.`);
    } else {
      let creatorName;
      if (digitalItem.content_id) {
        const content = await prisma.tobiratory_contents.findUnique({
          where: {
            id: digitalItem.content_id,
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
        thumbnailUrl: digitalItem.thumb_url,
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
