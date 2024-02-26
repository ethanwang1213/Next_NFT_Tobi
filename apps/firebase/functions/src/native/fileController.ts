import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
// import {firestore} from "firebase-admin";
// import { PrismaClient } from "@prisma/client";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
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
  const {image} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    await prisma.tobiratory_material_images.create({
      data: {
        owner: uid,
        image: image,
      },
    });
    const materials = await prisma.tobiratory_material_images.findMany({
      where: {
        owner: uid,
      },
    });
    const returnData = materials.map((material)=>{
      return {
        id: material.id,
        image: material.image,
      };
    });
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const getMaterial = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const materials = await prisma.tobiratory_material_images.findMany({
      where: {
        owner: uid,
      },
    });
    const returnData = materials.map((material)=>{
      return {
        id: material.id,
        image: material.image,
      };
    });
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};

export const removeMaterials = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    await prisma.tobiratory_material_images.deleteMany({
      where: {
        owner: uid,
      },
    });
    res.status(200).send({
      status: "success",
      data: "deleted",
    });
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
    return;
  });
};
