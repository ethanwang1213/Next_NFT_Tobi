import {Request, Response} from "express";
import {prisma} from "../prisma";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {statusOfShowcase} from "./utils";

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
        createTime: showcase.updated_date_time,
        updateTime: showcase.updated_date_time,
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
  const {title, description, thumbUrl, status, scheduleTime}: { title?: string, description?: string, thumbUrl?: string, status?: number, scheduleTime: string} = req.body;
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
          data: "not-showcase",
        });
        return;
      }
      if (status&&status != statusOfShowcase.public&&status != statusOfShowcase.publicSchedule) {
        res.status(401).send({
          status: "error",
          data: "invalid-status",
        });
        return;
      }
      if (status == statusOfShowcase.public) {
        await prisma.tobiratory_showcase.updateMany({
          where: {
            status: statusOfShowcase.public,
            content_id: showcase.content_id,
          },
          data: {
            status: statusOfShowcase.private,
          },
        });
      }
      const updateShowcase = await prisma.tobiratory_showcase.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: title,
          description: description,
          thumb_url: thumbUrl,
          schedule_time: scheduleTime==undefined?undefined:new Date(scheduleTime),
          status: status,
          updated_date_time: new Date(),
        },
      });
      if (status == statusOfShowcase.publicSchedule&&scheduleTime) {
        const specificTime = new Date(scheduleTime);
        const currentTime = new Date();
        const timeDifference = specificTime.getTime() - currentTime.getTime();

        if (timeDifference > 0) {
          updateShocaseSchedule(scheduleTime, timeDifference, updateShowcase.id);
        } else {
          console.log("Specific time has already passed.");
        }
      }
      const returnData = {
        id: updateShowcase.id,
        title: updateShowcase.title,
        status: updateShowcase.status,
        scheduleTime: updateShowcase.schedule_time,
        description: updateShowcase.description,
        createTime: updateShowcase.created_date_time,
        updateTime: updateShowcase.updated_date_time,
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
        orderBy: {
          created_date_time: "desc",
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
          updateTime: showcase.updated_date_time,
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
      if (showcase.status == statusOfShowcase.public) {
        res.status(401).send({
          status: "error",
          data: "public-showcase",
        });
        return;
      }
      await prisma.tobiratory_sample_items.updateMany({
        where: {
          content_id: content.id,
        },
        data: {
          content_id: 0,
        },
      });
      await prisma.tobiratory_digital_item_nfts.updateMany({
        where: {
          content_id: content.id,
        },
        data: {
          content_id: 0,
        },
      });
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

const updateShocaseSchedule = async (scheduleTime: string, timeDifference: number, id: number) => {
  setTimeout(async () => {
    try {
      const showcase = await prisma.tobiratory_showcase.findUnique({
        where: {
          id: id,
        },
      });
      if (!showcase||showcase.schedule_time!=new Date(scheduleTime)) {
        return;
      }
      await prisma.tobiratory_showcase.updateMany({
        where: {
          status: statusOfShowcase.public,
          content_id: showcase.content_id,
        },
        data: {
          status: statusOfShowcase.private,
        },
      });
      await prisma.tobiratory_showcase.updateMany({
        where: {
          id: id,
          schedule_time: scheduleTime,
          status: statusOfShowcase.publicSchedule,
        },
        data: {
          status: statusOfShowcase.public,
        },
      });
      console.log("Database updated at specific time.");
    } catch (error) {
      console.error("Error updating database:", error);
    }
  }, timeDifference);
};
