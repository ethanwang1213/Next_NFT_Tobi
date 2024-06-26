import {Request, Response} from "express";
import {FirebaseError, auth} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
import {prisma} from "../prisma";

export const uploadMaterial = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {image} = req.body;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    await prisma.tobiratory_material_images.create({
      data: {
        owner_uuid: uid,
        image: image,
      },
    });
    const materials = await prisma.tobiratory_material_images.findMany({
      where: {
        owner_uuid: uid,
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
        owner_uuid: uid,
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
        owner_uuid: uid,
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

export const deleteMaterial = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await auth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const material = await prisma.tobiratory_material_images.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!material) {
      res.status(404).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    if (material.owner_uuid != uid) {
      res.status(404).send({
        status: "error",
        data: "not-yours",
      });
      return;
    }
    await prisma.tobiratory_material_images.delete({
      where: {
        id: parseInt(id),
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
