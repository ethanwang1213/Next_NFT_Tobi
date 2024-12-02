import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError, storage} from "firebase-admin";
import {v4 as uuidv4} from "uuid";
import {TOBIRATORY_DIGITAL_ITEMS_ADDRESS, TOPIC_NAMES} from "../lib/constants";
import {PubSub} from "@google-cloud/pubsub";
import {pushToDevice} from "../appSendPushMessage";
import {prisma} from "../prisma";
import {
  giftStatus,
  increaseTransactionAmount,
  isEmptyObject,
  mintStatus,
  statusOfLimitTransaction,
  notificationBatchStatus,
  digitalItemStatus
} from "./utils";
import * as fcl from "@onflow/fcl";

fcl.config({
  "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
  "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
});

const pubsub = new PubSub();

export const mintNFT = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {fcmToken, amount} = req.body;
  if (!fcmToken) {
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
    const checkLimit = await increaseTransactionAmount(uid);
    if (checkLimit == statusOfLimitTransaction.notExistAccount) {
      res.status(401).send({
        status: "error",
        data: "not-exist-account",
      });
      return;
    } else if (checkLimit == statusOfLimitTransaction.limitedTransaction) {
      res.status(401).send({
        status: "error",
        data: "transaction-limit",
      });
      return;
    }
    try {
      const notificationBatchId = await generateNotificationBatchId(fcmToken);
      let mintCount = 0;

      const mintProcess = async () => {
        if (mintCount >= intAmount) {
          return;
        }
        console.log("mintStart", mintCount, intAmount);
        await mint(id, uid, notificationBatchId);
        console.log("mintEnd", mintCount, intAmount);
        mintCount++;
        setTimeout(mintProcess, 1000);
      };

      await mintProcess();

      pushToDevice(fcmToken, {
        title: "NFTの作成を開始しました",
        body: "作成完了までしばらくお待ちください",
      }, {
        body: JSON.stringify({
          type: "mintBegan",
          data: {id: id},
        }),
      });
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

export const mint = async (id: string, uid: string, notificationBatchId: number) => {
  const notificationBatch = await prisma.notification_batch.findUnique({
    where: {
      id: notificationBatchId,
    },
  });
  if (!notificationBatch) {
    throw new MintError(404, "NotificationBatch does not found");
  }

  const digitalItem = await prisma.digital_items.findUnique({
    where: {
      id: Number(id),
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
      license: true,
    },
  });
  if (!digitalItem) {
    throw new MintError(404, "DigitalItem does not found");
  }
  const modelUrl = digitalItem.meta_model_url;
  if (!modelUrl) {
    throw new MintError(400, "model_url-not-set");
  }

  if (digitalItem.account.business) {
    const content = digitalItem.account.business.content;
    if (!content) {
      throw new MintError(404, "content-not-found");
    }
    if (content.businesses_uuid !== uid && digitalItem.metadata_status != digitalItemStatus.onSale) {
      throw new MintError(401, "not-creator");
    }
  } else {
    if (digitalItem.account_uuid !== uid) {
      throw new MintError(401, "not-creator");
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
        notificationBatchId,
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
        notification_batch_id: notificationBatchId,
        notified: false,
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
        notificationBatchId,
      },
    };
    const messageId = await pubsub.topic(TOPIC_NAMES["flowTxSend"]).publishMessage({json: message});
    console.log(`Message ${messageId} published.`);
  }
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
    const checkLimit = await increaseTransactionAmount(uid);
    if (checkLimit == statusOfLimitTransaction.notExistAccount) {
      res.status(401).send({
        status: "error",
        data: "not-exist-account",
      });
      return;
    } else if (checkLimit == statusOfLimitTransaction.limitedTransaction) {
      res.status(401).send({
        status: "error",
        data: "transaction-limit",
      });
      return;
    }
    try {
      const notificationBatchId = await generateNotificationBatchId(fcmToken);
      await gift(parseInt(id), uid, receiveFlowId, notificationBatchId);
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
    const checkLimit = await increaseTransactionAmount(uid);
    if (checkLimit == statusOfLimitTransaction.notExistAccount) {
      res.status(401).send({
        status: "error",
        data: "not-exist-account",
      });
      return;
    } else if (checkLimit == statusOfLimitTransaction.limitedTransaction) {
      res.status(401).send({
        status: "error",
        data: "transaction-limit",
      });
      return;
    }
    try {
      const notificationBatchId = await generateNotificationBatchId(fcmToken);
      await gift(parseInt(id), uid, process.env.FLOW_TRASH_BOX_ACCOUNT_ADDRESSES || "", notificationBatchId);
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

export const gift = async (id: number, uid: string, receiveFlowId: string, notificationBatchId: number) => {
  const notificationBatch = await prisma.notification_batch.findUnique({
    where: {
      id: notificationBatchId,
    },
  });
  if (!notificationBatch) {
    throw new GiftError(404, "NotificationBatch does not found");
  }
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
  const fcmToken = notificationBatch.fcm_token;
  const flowJobId = uuidv4();
  const message = {
    flowJobId, txType: "giftNFT", params: {
      tobiratoryAccountUuid: uid,
      digitalItemNftId: digitalItemNft.id,
      receiveFlowId,
      notificationBatchId,
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

export const generateNotificationBatchId = async (fcmToken: string) => {
  const column = await prisma.notification_batch.create({
    data: {
      status: notificationBatchStatus.progress,
      fcm_token: fcmToken,
    },
  });
  return column.id;
};

export const finalizeModelUrl = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {modelUrl}: { modelUrl: string } = req.body;

  const prefixUrl = "https://firebasestorage.googleapis.com/v0/b/tobiratory-f6ae1.appspot.com/o/";
  if (!modelUrl.includes(prefixUrl)) {
    res.status(401).send({
      status: "error",
      data: "invalid-model",
    });
    return;
  }

  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const digitalItem = await prisma.digital_items.findUnique({
      where: {
        id: Number(id),
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
      }
    });

    if (!digitalItem) {
      res.status(404).send({
        status: "error",
        data: "digital-item-not-found",
      });
      return;
    }

    if (digitalItem.account.business) {
      const content = digitalItem.account.business.content;
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "content-not-found",
        });
        return;
      }
      if (content.businesses_uuid !== uid) {
        res.status(401).send({
          status: "error",
          data: "not-creator",
        });
        return;
      }
    } else {
      if (digitalItem.account_uuid !== uid) {
        res.status(401).send({
          status: "error",
          data: "not-creator",
        });
        return;
      }
    }

    if (digitalItem.meta_model_url) {
      res.status(400).send({
        status: "error",
        data: "already-exists",
      });
    }

    await prisma.digital_items.update({
      where: {
        id: Number(id),
      },
      data: {
        meta_model_url: modelUrl,
      }
    });

    res.status(200).send({
      status: "success",
      data: {
        id: id,
        modelUrl: modelUrl,
      },
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
}

export const getOwnershipHistory = async (ownerFlowAddress: string, nftId: number) => {
  const cadence = `
import TobiratoryDigitalItems from 0x${TOBIRATORY_DIGITAL_ITEMS_ADDRESS}

access(all) fun main(address: Address, id: String): {UFix64: Address}? {
    let collection = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowTobiratoryNFT(UInt64.fromString(id)!)

    return nft?.getOwnerHistory();
}`;

  return await fcl.query({
    cadence,
    args: (arg: any, t: any) => [arg(ownerFlowAddress, t.Address), arg(String(nftId), t.String)],
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
                  flow_account: true,
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
              license: true,
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
      const owners:{
        [key: number]: string;
      } = await getOwnershipHistory(nftData.nft_owner?.account?.flow_account?.flow_address??"", nftData.flow_nft_id??0);
      console.log(owners);

      let acquiredDate = new Date();
      let ownerHistory: {
        avatarUrl: string | null | undefined;
        uuid: string | undefined;
        flowAddress: string;
        acquiredDate: Date;
      }[] = [];
      if (isEmptyObject(owners)) {
        acquiredDate = new Date(Object.keys(owners)[0]);
        ownerHistory = await Promise.all(
            Object.entries(owners).map(async ([key, owner])=>{
              const ownerData = await prisma.flow_accounts.findFirst({
                where: {
                  flow_address: owner,
                },
                include: {
                  account: true,
                },
              });
              return {
                avatarUrl: ownerData?.account.icon_url,
                uuid: ownerData?.account_uuid,
                flowAddress: owner,
                acquiredDate: new Date(key),
              };
            })
        );
      }
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
        acquiredDate: acquiredDate,
        owners: ownerHistory,
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
