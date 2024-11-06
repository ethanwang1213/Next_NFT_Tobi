import {Request, Response} from "express";
import {FirebaseError} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {prisma} from "../prisma";
import {digitalItemStatus, statusOfShowcase} from "./utils";
import {defaultPageSize} from "../lib/constants";

export const searchAll = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {q} = req.query;
  const searchValue = q?.toString()==""?undefined:q?.toString();
  console.log(searchValue);
  if (!searchValue) {
    res.status(200).send({
      status: "success",
      data: {
        users: [],
        contents: [],
        saidans: [],
        digitalItems: [],
      },
    });
    return;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (_decodedToken: DecodedIdToken) => {
    try {
      const users = await prisma.accounts.findMany({
        where: {
          is_deleted: false,
          OR: [
            {
              username: {
                contains: searchValue,
                mode: "insensitive",
              },
            },
            {
              user_id: {
                contains: searchValue,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          username: "asc",
        },
        take: 5,
      });
      const resultUsers = users.map((user)=>{
        return {
          uuid: user.uuid,
          avatar: user.icon_url,
          username: user.username,
          aboutMe: user.about_me,
        };
      });
      const contents = await prisma.contents.findMany({
        where: {
          name: {
            contains: searchValue,
            mode: "insensitive",
          },
          is_deleted: false,
        },
        take: 2,
        include: {
          showcases: {
            where: {
              status: statusOfShowcase.public,
            },
            include: {
              showcase_template: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
      const resultContents = contents.map((content)=> {
        return {
          contentId: content.id,
          contentName: content.name,
          thumbImage: content.showcases[0].thumb_url,
        };
      });
      const saidans = await prisma.saidans.findMany({
        where: {
          title: {
            contains: searchValue,
            mode: "insensitive",
          },
          is_deleted: false,
        },
        take: 2,
        include: {
          saidans_template: true,
        },
        orderBy: {
          title: "asc",
        },
      });
      const resultSaidans = saidans.map((saidan)=>{
        return {
          saidanId: saidan.id,
          saidanTitle: saidan.title,
          thumbImage: saidan.saidans_template.cover_image,
        };
      });
      const digitalItems = await prisma.digital_items.findMany({
        where: {
          name: {
            contains: searchValue,
            mode: "insensitive",
          },
          metadata_status: digitalItemStatus.hidden,
          is_deleted: false,
        },
        take: 10,
        orderBy: {
          name: "asc",
        },
      });
      const resultDigitalItems = digitalItems.map((digitalItem)=>{
        return {
          sampleId: digitalItem.id,
          thumbImage: digitalItem.is_default_thumb?digitalItem.default_thumb_url:digitalItem.custom_thumb_url,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          users: resultUsers,
          contents: resultContents,
          saidans: resultSaidans,
          digitalItems: resultDigitalItems,
        },
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
      data: error.code,
    });
  });
};

export const searchUsers = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {q, pageNumber} = req.query;
  const searchValue = q?.toString()==""?undefined:q?.toString();
  const skip = (Number(pageNumber??1)-1)*defaultPageSize;
  console.log(searchValue, pageNumber);
  if (!searchValue) {
    res.status(200).send({
      status: "success",
      data: {
        users: [],
      },
    });
    return;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (_decodedToken: DecodedIdToken) => {
    try {
      const totalUsers = await prisma.accounts.findMany({
        where: {
          OR: [
            {
              username: {
                contains: searchValue,
                mode: "insensitive",
              },
            },
            {
              user_id: {
                contains: searchValue,
                mode: "insensitive",
              },
            },
          ],
          is_deleted: false,
        },
        orderBy: {
          username: "asc",
        },
      });
      const users = await prisma.accounts.findMany({
        skip: skip,
        take: defaultPageSize,
        where: {
          OR: [
            {
              username: {
                contains: searchValue,
                mode: "insensitive",
              },
            },
            {
              user_id: {
                contains: searchValue,
                mode: "insensitive",
              },
            },
          ],
          is_deleted: false,
        },
        orderBy: {
          username: "asc",
        },
      });
      const resultUsers = users.map((user)=>{
        return {
          uuid: user.uuid,
          avatar: user.icon_url,
          username: user.username,
          aboutMe: user.about_me,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          users: resultUsers,
          totalRecords: totalUsers.length,
        },
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
      data: error.code,
    });
  });
};

export const searchDigitalItems = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {q, pageNumber} = req.query;
  const skip = (Number(pageNumber??1)-1)*defaultPageSize;
  const searchValue = q?.toString()==""?undefined:q?.toString();
  console.log(searchValue);
  if (!searchValue) {
    res.status(200).send({
      status: "success",
      data: {
        digitalItems: [],
      },
    });
    return;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (_decodedToken: DecodedIdToken) => {
    try {
      const totalDigitalItems = await prisma.digital_items.findMany({
        where: {
          name: {
            contains: searchValue,
            mode: "insensitive",
          },
          metadata_status: digitalItemStatus.hidden,
          is_deleted: false,
        },
        orderBy: {
          name: "asc",
        },
      });
      const digitalItems = await prisma.digital_items.findMany({
        skip: skip,
        take: defaultPageSize,
        where: {
          name: {
            contains: searchValue,
            mode: "insensitive",
          },
          metadata_status: digitalItemStatus.hidden,
          is_deleted: false,
        },
        orderBy: {
          name: "asc",
        },
      });
      const resultDigitalItems = digitalItems.map((digitalItem)=>{
        return {
          sampleId: digitalItem.id,
          thumbImage: digitalItem.is_default_thumb?digitalItem.default_thumb_url:digitalItem.custom_thumb_url,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          digitalItems: resultDigitalItems,
          totalRecords: totalDigitalItems.length,
        },
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
      data: error.code,
    });
  });
};

export const searchContents = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {q, pageNumber} = req.query;
  const searchValue = q?.toString()==""?undefined:q?.toString();
  const skip = (Number(pageNumber??1)-1)*defaultPageSize;
  console.log(searchValue, pageNumber);
  if (!searchValue) {
    res.status(200).send({
      status: "success",
      data: {
        contents: [],
      },
    });
    return;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const totalContents = await prisma.contents.findMany({
        skip: skip,
        take: defaultPageSize,
        where: {
          name: {
            contains: searchValue,
            mode: "insensitive",
          },
          is_deleted: false,
        },
        include: {
          showcases: {
            where: {
              status: statusOfShowcase.public,
            },
            include: {
              showcase_template: true,
            },
          },
          favorite_users: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      const contents = await prisma.contents.findMany({
        skip: skip,
        take: defaultPageSize,
        where: {
          name: {
            contains: searchValue,
            mode: "insensitive",
          },
          is_deleted: false,
        },
        include: {
          showcases: {
            where: {
              status: statusOfShowcase.public,
            },
            include: {
              showcase_template: true,
            },
          },
          favorite_users: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      const resultContents = contents.map((content)=> {
        return {
          contentId: content.id,
          contentName: content.name,
          thumbImage: content.showcases[0].thumb_url,
          favorite: content.favorite_users.filter((favor)=>favor.account_uuid==uid).length!=0,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          contents: resultContents,
          totalRecords: totalContents.length,
        },
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
      data: error.code,
    });
  });
};

export const searchSaidans = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {q, pageNumber} = req.query;
  const searchValue = q?.toString()==""?undefined:q?.toString();
  const skip = (Number(pageNumber??1)-1)*defaultPageSize;
  console.log(searchValue, pageNumber);
  if (!searchValue) {
    res.status(200).send({
      status: "success",
      data: {
        saidans: [],
      },
    });
    return;
  }
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (_decodedToken: DecodedIdToken) => {
    try {
      const totalSaidans = await prisma.saidans.findMany({
        skip: skip,
        take: defaultPageSize,
        where: {
          title: {
            contains: searchValue,
            mode: "insensitive",
          },
          is_deleted: false,
        },
        include: {
          saidans_template: true,
        },
        orderBy: {
          title: "asc",
        },
      });
      const saidans = await prisma.saidans.findMany({
        skip: skip,
        take: defaultPageSize,
        where: {
          title: {
            contains: searchValue,
            mode: "insensitive",
          },
          is_deleted: false,
        },
        include: {
          saidans_template: true,
        },
        orderBy: {
          title: "asc",
        },
      });
      const resultSaidans = saidans.map((saidan)=>{
        return {
          saidanId: saidan.id,
          saidanTitle: saidan.title,
          thumbImage: saidan.saidans_template.cover_image,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          saidans: resultSaidans,
          totalRecords: totalSaidans.length,
        },
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
      data: error.code,
    });
  });
};

export const hotPicksDigitalItem = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {pageNumber} = req.query;
  const defaultPageSize = 10;
  const skip = (Number(pageNumber??1)-1)*defaultPageSize;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (_decodedToken: DecodedIdToken) => {
    try {
      const digitalItems = await prisma.digital_items.findMany({
        skip: skip,
        take: defaultPageSize,
        where: {
          metadata_status: digitalItemStatus.hidden,
          is_deleted: false,
        },
        orderBy: [
          {sale_quantity: "desc"},
          {
            name: "asc",
          },
        ],
      });
      const totalRecord = await prisma.digital_items.findMany({
        where: {
          metadata_status: digitalItemStatus.hidden,
          is_deleted: false,
        },
        orderBy: [
          {
            name: "asc",
          },
        ],
      });
      const resultDigitalItems = digitalItems.map((digitalItem)=>{
        return {
          sampleId: digitalItem.id,
          thumbImage: digitalItem.is_default_thumb?digitalItem.default_thumb_url:digitalItem.custom_thumb_url,
        };
      });
      res.status(200).send({
        status: "success",
        data: {
          pageNumber: pageNumber,
          size: defaultPageSize,
          totalRecord: totalRecord.length,
          digitalItems: resultDigitalItems,
        },
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
      data: error.code,
    });
  });
};
