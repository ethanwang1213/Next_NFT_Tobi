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
  await getAuth().verifyIdToken(authorization ?? "").then(async (_decodedToken: DecodedIdToken) => {
    try {
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          id: parseInt(id),
        },
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
                  digital_item: true,
                },
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
      const sampleItems = showcase.tobiratory_showcase_sample_items.map((sampleId) => {
        return {
          sampleId: sampleId.sample_id,
          thumbImage: sampleId.sample.digital_item.is_default_thumb ?
            sampleId.sample.digital_item.default_thumb_url :
            sampleId.sample.digital_item?.custom_thumb_url,
        };
      });

      const nftItemInfos = await prisma.tobiratory_digital_item_nfts.findMany({
        where: {
          content_id: content.id,
        },
        include: {
          digital_item: true,
        },
      });
      const nftItems = nftItemInfos.map((nft) => {
        return {
          nftId: nft.id,
          thumbImage: nft.digital_item.is_default_thumb ? nft.digital_item.default_thumb_url : nft.digital_item.custom_thumb_url,
        };
      });

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

export const updateMyContentInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {name, description, license, copyrightHolders, image, sticker}:
    { name?: string, description?: string, license?: string, copyrightHolders?: {id: number|null, name: string}[], image?: string, sticker?: string } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
          image: image,
          sticker: sticker,
        },
        include: {
          copyrights: true,
        },
      });
      if (copyrightHolders) {
        const copyrightIds = await Promise.all(
          copyrightHolders.map(async (copyright)=>{
            const upsertCopyright = await prisma.tobiratory_copyright.upsert({
              where: {
                id: copyright.id??0,
              },
              update: {
                copyright_name: copyright.name,
              },
              create: {
                copyright_name: copyright.name,
                content_id: content.id,
              }
            });
            return upsertCopyright.id;
          })
        );
        await prisma.tobiratory_copyright.deleteMany({
          where: {
            id: {
              notIn: copyrightIds,
            },
            content_id: content.id,
          },
        });
      }
      const copyrights = await prisma.tobiratory_copyright.findMany({
        where: {
          content_id: updatedContent.id,
        },
      });
      const returnData = {
        id: updatedContent.id,
        name: updatedContent.name,
        description: updatedContent.description,
        license: updatedContent.license,
        image: updatedContent.image,
        sticker: updatedContent.sticker,
        copyright: copyrights.map((copyright) => {
          return {
            id: copyright.id,
            name: copyright.copyright_name,
          };
        }),
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

export const getMyContentInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
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
        },
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
        image: content.image,
        sticker: content.sticker,
        copyright: content.copyrights.map((copyright) => {
          return {
            id: copyright.id,
            name: copyright.copyright_name,
          };
        }),
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

export const setFavoriteContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {favorite}: { favorite: boolean } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const content = await prisma.tobiratory_contents.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          copyrights: true,
        },
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const nowFavorStatus = await prisma.tobiratory_favorite_content.findMany({
        where: {
          favor_uuid: uid,
          content_id: content.id,
        },
      });
      if (favorite && nowFavorStatus.length==0) {
        await prisma.tobiratory_favorite_content.create({
          data: {
            content_id: content.id,
            favor_uuid: uid,
          },
        });
      } else if (!favorite) {
        await prisma.tobiratory_favorite_content.deleteMany({
          where: {
            content_id: content.id,
            favor_uuid: uid,
          },
        });
      }
      const returnData = {
        id: content.id,
        favorite: favorite,
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

export const getFavoriteContents = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const favorContents = await prisma.tobiratory_favorite_content.findMany({
        where: {
          favor_uuid: uid,
        },
        include: {
          content: {
            include: {
              showcase: true,
            },
          },
        },
      });
      const returnData = favorContents.map((content) => {
        const mainShowcase = content.content.showcase.filter((showcase) => showcase.status == statusOfShowcase.public);
        return {
          id: content.content_id,
          name: content.content.name,
          thumbImage: mainShowcase[0].thumb_url,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};
