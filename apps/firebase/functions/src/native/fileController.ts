import { PrismaClient } from "@prisma/client";
import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
// import { PrismaClient } from "@prisma/client";
import {auth} from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";
// import { DecodedIdToken } from "firebase-admin/auth";
import * as multer from "multer";

const prisma = new PrismaClient();

export const fileMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

export const uploadMaterial = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {images} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const data = images.map((image: string)=>{
      return {
        owner: uid,
        image: image,
      }
    });
    await prisma.tobiratory_material_images.createMany({
      data: data
    });
    const materials = await prisma.tobiratory_material_images.findMany({
      where: {
        owner: uid,
      }
    });
    const returnData = materials.map((material)=>material.image);
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  })
};

export const getMaterial = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const materials = await prisma.tobiratory_material_images.findMany({
      where: {
        owner: uid,
      }
    });
    const returnData = materials.map((material)=>material.image);
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  })
}