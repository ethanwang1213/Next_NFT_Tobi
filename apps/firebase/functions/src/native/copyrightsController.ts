import {Request, Response} from "express";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {prisma} from "../prisma";

export const getCopyrights = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.businesses.findFirst({
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
      const content = await prisma.contents.findUnique({
        where: {
          businesses_uuid: uid,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const copyrights = await prisma.copyrights.findMany({
        where: {
          content_id: content.id,
        },
      });
      const returnData = copyrights.map((copyright)=> {
        return {
          id: copyright.id,
          name: copyright.name,
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

export const updateCopyrights = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  const {name}: {name: string} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.businesses.findFirst({
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
      const content = await prisma.contents.findUnique({
        where: {
          businesses_uuid: uid,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const copyright = await prisma.copyrights.findUnique({
        where: {
          id: parseInt(id),
          content_id: content.id,
        },
      });
      if (!copyright) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const updatedCopyrights = await prisma.copyrights.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: name,
        },
      });
      const returnData = {
        id: updatedCopyrights.id,
        name: updatedCopyrights.name,
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

export const deleteCopyrights = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const admin = await prisma.businesses.findFirst({
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
      const content = await prisma.contents.findUnique({
        where: {
          businesses_uuid: uid,
        },
      });
      if (!content) {
        res.status(401).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const copyright = await prisma.copyrights.findUnique({
        where: {
          id: parseInt(id),
          content_id: content.id,
        },
      });
      if (!copyright) {
        res.status(401).send({
          status: "error",
          data: "not-yours",
        });
        return;
      }
      await prisma.digital_items_copyright.deleteMany({
        where: {
          copyright_id: copyright.id,
        },
      });
      const deletedCopyrights = await prisma.copyrights.delete({
        where: {
          id: parseInt(id),
        },
      });
      const returnData = {
        id: deletedCopyrights.id,
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
