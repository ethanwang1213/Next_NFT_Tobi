import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError, storage} from "firebase-admin";
import {v4 as uuidv4} from "uuid";
import {TOPIC_NAMES} from "../lib/constants";
import {PubSub} from "@google-cloud/pubsub";
import {pushToDevice} from "../appSendPushMessage";
import {prisma} from "../prisma";
import {giftStatus, mintStatus} from "./utils";

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
      data: error,
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

  if (digitalItem.account.business) {
    if (!digitalItem.account.business.content) {
      throw new MintError(404, "Content does not found");
    }
  } else {
    if (digitalItem.account_uuid !== uid) {
      throw new MintError(401, "You are not creator of this digital item");
    }
  }

  if (digitalItem.limit && digitalItem.limit <= 0) {
    throw new MintError(401, "Minting limit reached");
  }

  const itemId = digitalItem.flow_item_id;
  const digitalItemId = digitalItem.id;

  if (!digitalItem.account.flow_account) {
    throw new MintError(404, "FlowAccount does not found");
  }

  let creatorName;
  if (digitalItem.account.business?.content) {
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
      copyrightRelate.map(async (relate) => {
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
    thumbnailUrl: digitalItem.is_default_thumb ? digitalItem.default_thumb_url : digitalItem.custom_thumb_url,
    modelUrl: modelUrl,
    creatorName: creatorName,
    limit: digitalItem.limit,
    license: digitalItem.license,
    copyrightHolders: copyrights,
  };

  if (itemId) {
    const flowJobId = uuidv4();
    const message = {
      flowJobId, txType: "mintNFT", params: {
        tobiratoryAccountUuid: uid,
        itemCreatorAddress: digitalItem.account.flow_account.flow_address,
        itemId,
        digitalItemId,
        digitalItemNftId: undefined,
        metadata,
        fcmToken,
      },
    };
    const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
    console.log(`Message ${messageId} published.`);
  } else {
    const creatorData = await prisma.accounts.findUnique({
      where: {
        uuid: uid,
      },
      include: {
        flow_account: true,
      },
    });
    const nft = await prisma.digital_item_nfts.create({
      data: {
        digital_item_id: digitalItem.id,
        nft_owner: {
          create: {
            account_uuid: uid,
            owner_flow_address: creatorData?.flow_account?.flow_address ?? "",
            nick_name: "",
            status: mintStatus.minting,
            saidan_id: 0,
            box_id: 0,
          },
        },
      },
    });
    const flowJobId = uuidv4();
    const message = {
      flowJobId, txType: "createItem", params: {
        tobiratoryAccountUuid: uid,
        digitalItemNftId: nft.id,
        digitalItemId,
        metadata,
        fcmToken,
      },
    };
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
      data: error,
    });
    throw error;
  });
};

export const deleteMyNFT = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {fcmToken} = req.body;
  if (!fcmToken) {
    res.status(401).send({
      status: "error",
      data: "invalid-params",
    });
    return;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      await gift(parseInt(id), uid, process.env.FLOW_TRASH_BOX_ACCOUNT_ADDRESSES || "", fcmToken);
      res.status(200).send({
        status: "success",
        data: "NFT is deleting",
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
      data: error,
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
      nft_owner: {
        include: {
          account: {
            include: {
              flow_account: true,
            },
          },
        },
      },
    },
  });
  if (!digitalItemNft) {
    throw new GiftError(404, "NFT does not found");
  }
  if (digitalItemNft.nft_owner?.account_uuid !== uid) {
    throw new GiftError(401, "You are not owner of this NFT");
  }
  if (!digitalItemNft.nft_owner?.account?.flow_account) {
    throw new GiftError(404, "FlowAccount does not found");
  }
  if (digitalItemNft.nft_owner?.account?.flow_account.flow_address === receiveFlowId) {
    throw new GiftError(401, "You can not gift to yourself");
  }
  if (digitalItemNft.gift_status !== giftStatus.none) {
    throw new GiftError(401, "This NFT is gifting now");
  }
  const flowJobId = uuidv4();
  const message = {
    flowJobId, txType: "giftNFT", params: {
      tobiratoryAccountUuid: uid,
      digitalItemNftId: digitalItemNft.id,
      receiveFlowId,
      fcmToken,
    },
  };
  const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
  console.log(`Message ${messageId} published.`);
  let title = "NFTをギフトしています";
  let body = "ギフト完了までしばらくお待ちください";
  if (receiveFlowId === process.env.FLOW_TRASH_BOX_ACCOUNT_ADDRESSES) {
    title = "NFTを削除しています";
    body = "削除完了までしばらくお待ちください";
  }
  pushToDevice(fcmToken, {
    title: title,
    body: body,
  }, {
    body: JSON.stringify({
      type: "transferBegan",
      data: {id: id},
    }),
  });
};

export const fetchNftThumb = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {mediaUrl}: { mediaUrl: string } = req.body;
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
    include: {
      sales: {
        where: {
          schedule_start_time: {
            lt: new Date(),
          },
        },
        orderBy: {
          schedule_start_time: "desc",
        },
        take: 1,
      },
    },
  });
  if (!digitalData) {
    res.status(401).send({
      status: "error",
      data: "digital-not-exist",
    });
    return;
  }
  const currentStatus = digitalData.sales.length > 0 ? digitalData.sales[0].status : digitalData.metadata_status;
  if (currentStatus > 2) {
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
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const fetchNftModel = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {modelUrl}: { modelUrl: string } = req.body;
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
    include: {
      sales: {
        where: {
          schedule_start_time: {
            lt: new Date(),
          },
        },
        orderBy: {
          schedule_start_time: "desc",
        },
        take: 1,
      },
    },
  });
  if (!digitalData) {
    res.status(401).send({
      status: "error",
      data: "digital-not-exist",
    });
    return;
  }
  const currentStatus = digitalData.sales.length > 0 ? digitalData.sales[0].status : digitalData.metadata_status;
  if (currentStatus > 2) {
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
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
  }).catch((error: FirebaseError) => {
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
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      const nftData = await prisma.digital_item_nfts.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          nft_owner: {
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
            },
          },
          digital_item: {
            include: {
              copyrights: {
                include: {
                  copyright: true,
                },
              },
              sales: {
                where: {
                  schedule_start_time: {
                    lt: new Date(),
                  },
                },
                orderBy: {
                  schedule_start_time: "desc",
                },
                take: 1,
              },
            },
          },
        },
      });
      if (!nftData) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const copyrights = nftData.digital_item.copyrights.map((relate) => {
        return relate.copyright.name;
      });
      const returnData = {
        content: nftData.nft_owner?.account?.business?.content != null ? {
          name: nftData.nft_owner?.account?.business?.content.name,
          sticker: nftData.nft_owner?.account?.business?.content.sticker,
        } : null,
        name: nftData.digital_item.name,
        modelUrl: nftData.digital_item.model_url,
        description: nftData.digital_item.description,
        copyrights: copyrights,
        license: nftData.digital_item.license,
        certImageUrl: "",
        sn: nftData.serial_no,
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
