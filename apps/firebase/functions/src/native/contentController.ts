import {Request, Response} from "express";
import {prisma} from "../prisma";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { FirebaseError } from "firebase-admin";

export const getContents = async (req: Request, res: Response) => {
  const {q, sortBy, sortOrder} = req.params;
  const orderValue = {};
  Object.defineProperty(orderValue, sortBy, {
    value: sortOrder,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  const contents = await prisma.tobiratory_contents.findMany({
    where: {
      name: {
        in: [q],
      },
    },
    orderBy: orderValue,
  });
  const resData = {
    contents: contents.map(async (content) => {
      return {
        id: content.id,
        name: content.name,
        image: content.image,
      };
    }),
  };

  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const getContentById = async (req: Request, res: Response) => {
  const {id} = req.params;
  const contentData = await prisma.tobiratory_contents.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (contentData == null) {
    res.status(404).send({
      status: "error",
      data: "Content does not exist!",
    });
    return;
  }

  const resData = {
    id: id,
    name: contentData.name,
    image: contentData.image,
    owner_uuid: contentData.owner_uuid,
  };
  res.status(200).send({
    status: "success",
    data: resData,
  });
};

export const createMyContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, description}: {title: string, description: string} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
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
      const showcase = await prisma.tobiratory_showcase.create({
        data: {
          title: title,
          description: description,
          owner_uuid: admin.uuid,
          content_id: content?.id,
        }
      })
      const returnData = {
        id: showcase.id,
        title: showcase.title,
        description: showcase.description,
      }
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
}
