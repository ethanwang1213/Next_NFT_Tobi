import {Request, Response} from "express";
import {prisma} from "../prisma";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {statusOfShowcase} from "./utils";

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
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization??"").then(async (_decodedToken: DecodedIdToken)=>{
    try {
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          id: parseInt(id),
        }
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const showcase = await prisma.tobiratory_showcase.findFirst({
        where: {
          content_id: content.id,
          status: statusOfShowcase.public,
        },
        include: {
          tobiratory_showcase_template: {},
          tobiratory_showcase_sample_items: {
            include: {
              sample: {
                include: {
                  digital_item: true
                }
              },
            },
          },
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      const owner = await prisma.tobiratory_accounts.findUnique({
        where: {
          uuid: content.owner_uuid,
        },
      });
      if (!owner) {
        res.status(404).send({
          status: "error",
          data: "not-exist-owner",
        });
        return;
      }
      const sampleItems = showcase.tobiratory_showcase_sample_items.map(async (sampleId) => {
        return {
          sampleId: sampleId.sample_id,
          thumbImage: sampleId.sample.digital_item.is_default_thumb?
            sampleId.sample.digital_item.default_thumb_url : 
            sampleId.sample.digital_item?.custom_thumb_url,
        };
      })

      const nftItemInfos = await prisma.tobiratory_digital_item_nfts.findMany({
        where: {
          content_id: content.id,
        },
        include: {
          digital_item: true,
        }
      });
      const nftItems = nftItemInfos.map((nft) => {
        return {
          nftId: nft.id,
          thumbImage: nft.digital_item.is_default_thumb?nft.digital_item.default_thumb_url:nft.digital_item.custom_thumb_url,
        }
      })

      const returnData = {
        content: {
          id: content.id,
          name: content.name,

        },
        showcase: {
          id: showcase.id,
          title: showcase.title,
          description: showcase.description,
        },
        owner: {
          uuid: owner.uuid,
          avatar: owner.icon_url,
        },
        model: showcase.tobiratory_showcase_template?.model_url,
        thumbImage: showcase.thumb_url,
        items: [...sampleItems, ...nftItems],
      }

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

export const getShowcaseTemplate = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
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
      const showcaseTemplate = await prisma.tobiratory_showcase_template.findMany();
      const returnData = showcaseTemplate.map((template)=> {
        return {
          id: template.id,
          thumbImage: template.cover_image,
          model: template.model_url,
        };
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
};

export const createMyShocase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, description, templateId}: {title: string, description: string, templateId: number} = req.body;
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
      const showcaseTemplate = await prisma.tobiratory_showcase_template.findUnique({
        where: {
          id: templateId,
        },
      });
      if (!showcaseTemplate) {
        res.status(401).send({
          status: "error",
          data: "not-template",
        });
        return;
      }
      const showcase = await prisma.tobiratory_showcase.create({
        data: {
          title: title,
          description: description,
          owner_uuid: admin.uuid,
          content_id: content.id,
          template_id: templateId,
          thumb_url: showcaseTemplate.cover_image,
        },
      });
      const returnData = {
        id: showcase.id,
        title: showcase.title,
        description: showcase.description,
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

export const updateMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {title, description, thumbUrl, status}: {title?: string, description?: string, thumbUrl?: string, status?: number} = req.body;
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
      const updateShowcase = await prisma.tobiratory_showcase.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: title,
          description: description,
          thumb_url: thumbUrl,
          status: status,
        },
      });
      const returnData = {
        id: updateShowcase.id,
        title: updateShowcase.title,
        description: updateShowcase.description,
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

export const getMyShowcases = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
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
      const allShowcases = await prisma.tobiratory_showcase.findMany({
        where: {
          owner_uuid: admin.uuid,
        }
      });
      const returnData = allShowcases.map((showcase)=> {
        return {
          id: showcase.id,
          thumbImage: showcase.thumb_url,
          title: showcase.title,
          status: showcase.status,
          scheduleTime: showcase.schedule_time,
          createTime: showcase.created_date_time,
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

export const deleteMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
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
      const showcase = await prisma.tobiratory_showcase.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      if (showcase.owner_uuid!=admin.uuid) {
        res.status(404).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }
      const deleteShowcase = await prisma.tobiratory_showcase.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          id: deleteShowcase.id,
        },
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

export const updateMyContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {name, description, license, copyrightHolders}:
   {name: string, description: string, license: string, copyrightHolders: string[]} = req.body;
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
      const updatedContent = await prisma.tobiratory_contents.update({
        where: {
          id: content.id,
        },
        data: {
          name: name,
          description: description,
          license: license,
        }
      });
      await prisma.tobiratory_copyright.deleteMany({
        where: {
          content_id: content.id,
        }
      });
      res.status(200).send({
        status: "success",
        data: updatedContent,
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

export const getMyContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
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
        include: {
          copyrights: true,
        }
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      
      const returnData = {
        id: content.id,
        name: content.name,
        description: content.description,
        license: content.license,
        copyright: content.copyrights.map((copyright)=>{
          return {
            id: copyright.id,
            name: copyright.copyright_name,
          }
        })
      }
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