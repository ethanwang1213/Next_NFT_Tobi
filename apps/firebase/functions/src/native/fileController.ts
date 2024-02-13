import { Request, Response } from "express";
// import {firestore} from "firebase-admin";
// import { PrismaClient } from "@prisma/client";
import { /*auth,*/ storage } from "firebase-admin";
// import { DecodedIdToken } from "firebase-admin/auth";
import * as Multer from 'multer';

// const prisma = new PrismaClient();

export const fileMulter = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
});

export const uploadMaterial = (req: Request, res: Response) => {
    const bucket = storage().bucket(`/users/uid/material`)
    const files = req.body.files;
    const file = req.file;
    console.log(files, file, req);
    try {
        
        if (!files || files.length === 0) {
            res.status(401).send({
                status: "error",
                data: "no-file",
            });
            return
        }
        const blob = bucket.file(file?.originalname??"");
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file?.mimetype,
            }
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading file:', err);
            res.status(500).send({
                status: "error",
                data: "server-error"
            });
        });

        blobStream.on('finish', () => {
            console.log('File uploaded successfully.');
            res.status(200).send({
                status: "success",
                data: "success"
            });
        });

        // blobStream.end(files['file']?.buffer);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(401).send({
            status: "error",
            data: "server-error"
        });
    }
    // const { authorization } = req.headers;
    // await auth().verifyIdToken(authorization ?? "").then((decodedToken: DecodedIdToken) => {
    //     const uid = decodedToken.uid;
    //     const bucket = storage().bucket(`/users/${uid}/material`)
    //     try {
    //         const file = req.file;

    //         if (!file) {
    //             return res.status(401).send({
    //                 status: "error",
    //                 data: "no-file",
    //             });
    //         }

    //         const blob = bucket.file(Date.now().toString());
    //         const blobStream = blob.createWriteStream();

    //         blobStream.on('error', (err) => {
    //             console.error('Error uploading file:', err);
    //             res.status(500).send('Internal server error');
    //         });

    //         blobStream.on('finish', () => {
    //             console.log('File uploaded successfully.');
    //             res.status(200).send({
    //                 status: "success",
    //                 data: "success"
    //             });
    //         });

    //         blobStream.end(file.buffer);
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         res.status(500).send('Internal server error');
    //     }
    // })
}

export const getMaterial = (req: Request, res: Response) => {

}
