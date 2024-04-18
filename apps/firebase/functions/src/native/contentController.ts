import {Response} from "express";
import {prisma} from "../prisma";

type AllContentRequest = {
    params: {
        q: string,
        sortBy: string,
        sortOrder: "desc" | "asc"
    }
}

type ContentRequest = {
    params: { id: string }
}

export const getContents = async (req: AllContentRequest, res: Response) => {
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

export const getContentById = async (req: ContentRequest, res: Response) => {
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
