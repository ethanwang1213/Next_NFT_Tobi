import {Response} from "express";
// import {firestore} from "firebase-admin";
import {PrismaClient} from "@prisma/client";

type NFTRequest = {
  params: { id: string }
}

const prisma = new PrismaClient();

export const getNFTById = async (req: NFTRequest, res: Response) => {
  const {id} = req.params;
  const nftData = await prisma.tobiratory_nfts.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (nftData == null) {
    res.status(200).send({
      status: "error",
      data: "Account does not exist!",
    });
    return;
  }

  const creatorData = await prisma.tobiratory_accounts.findUnique({
    where: {
      uuid: nftData.creator,
    },
  });

  if (creatorData == null) {
    res.status(200).send({
      status: "error",
      data: "Flow account does not exist!",
    });
    return;
  }

  const resData = {
    serialNo: nftData.serial_no,
    owner: nftData.owner,
    id: nftData.id,
    title: nftData.title,
    image: nftData.image,
    creator: {
      userId: creatorData.uuid,
      username: creatorData.username,
      icon: creatorData.icon_url,
      sns: creatorData.sns,
    },
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};
