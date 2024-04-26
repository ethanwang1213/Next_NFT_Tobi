import {Request, Response} from "express";
import {prisma} from "../prisma";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";

export const getShowcaseTemplate = async (req: Request, res: Response) => {
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
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const showcaseTemplate = await prisma.tobiratory_showcase_template.findMany();
      const returnData = showcaseTemplate.map((template) => {
        return {
          id: template.id,
          thumbImage: template.cover_image,
          model: template.model_url,
          title: template.title,
          description: template.description,
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

export const createMyShocase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {title, description, templateId}: { title: string, description: string, templateId: number} = req.body;
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
        model: showcaseTemplate.model_url,
        thumbImage: showcase.thumb_url,
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

export const updateMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {title, description, thumbUrl, status}: { title?: string, description?: string, thumbUrl?: string, status?: number } = req.body;
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getMyShowcases = async (req: Request, res: Response) => {
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
        },
      });
      const returnData = allShowcases.map((showcase) => {
        return {
          id: showcase.id,
          thumbImage: showcase.thumb_url,
          title: showcase.title,
          status: showcase.status,
          scheduleTime: showcase.schedule_time,
          createTime: showcase.created_date_time,
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

export const deleteMyShowcase = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
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
      if (showcase.owner_uuid != admin.uuid) {
        res.status(404).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }
      await prisma.tobiratory_sample_items.updateMany({
        where: {
            content_id: content.id,
        },
        data: {
            content_id: 0,
        }
      })
      await prisma.tobiratory_digital_item_nfts.updateMany({
        where: {
            content_id: content.id,
        },
        data: {
            content_id: 0,
        }
      })
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};
