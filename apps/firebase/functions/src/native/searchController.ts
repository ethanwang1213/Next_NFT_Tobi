import {Request, Response} from "express";
import {FirebaseError} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {prisma} from "../prisma";
import { statusOfSample, statusOfShowcase } from "./utils";

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
      const users = await prisma.tobiratory_accounts.findMany({
        where: {
          OR: [
            {
              username: {
                contains: searchValue,
              },
            },
            {
              user_id: {
                contains: searchValue,
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
        };
      });
      const contents = await prisma.tobiratory_contents.findMany({
        where: {
            name: {
                contains: searchValue,
            },
        },
        take: 2,
        include: {
            showcase: {
                where: {
                    status: statusOfShowcase.public,
                },
                include: {
                    tobiratory_showcase_template: true,
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
            thumbImage: content.showcase[0].thumb_url,
        };
      });
      const saidans = await prisma.tobiratory_saidans.findMany({
        where: {
            title: {
                contains: searchValue,
            },
        },
        take: 2,
        include: {
            template: true,
        },
        orderBy: {
            title: "asc",
        },
      });
      const resultSaidans = saidans.map((saidan)=>{
        return {
            saidanId: saidan.id,
            saidanTitle: saidan.title,
            thumbImage: saidan.template.cover_image,
        };
      });
      const digitalItems = await prisma.tobiratory_sample_items.findMany({
        where: {
            digital_item: {
                name: {
                    contains: searchValue,
                },
                status: {
                    in: [statusOfSample.public, statusOfSample.onSale, statusOfSample.saleSchedule]
                }
            },
        },
        take: 10,
        include: {
            digital_item: true,
        },
        orderBy: {
            digital_item: {
                name: "asc",
            },
        },
      });
      const resultDigitalItems = digitalItems.map((sample)=>{
        return {
            sampleId: sample.id,
            thumbImage: sample.digital_item.is_default_thumb?sample.digital_item.default_thumb_url:sample.digital_item.custom_thumb_url,
        }
      })
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
