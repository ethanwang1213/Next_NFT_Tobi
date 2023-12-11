import { Response } from "express";
// import {firestore} from "firebase-admin";
import { PrismaClient } from "@prisma/client";

type AllSaidansRequest = {
    params: {
        q: string,
        showcase: boolean,
        sortBy: string,
        sortOrder: "desc" | "asc"
    }
}

type EachSaidanRequest = {
    params: { id: string }
}

const prisma = new PrismaClient();

export const getSaidans = async (req: AllSaidansRequest, res: Response) => {
    const { q, showcase, sortBy, sortOrder } = req.params;
    const orderValue = {};
    Object.defineProperty(orderValue, sortBy, {
        value: sortOrder,
        writable: false,
        enumerable: true,
        configurable: true,
    });
    const saidans = await prisma.tobiratory_saidans.findMany({
        where: {
            title: {
                in: [q],
            },
            showcase: {
                equals: showcase,
            },
        },
        orderBy: orderValue
    });
    const resData = {
        saidans: saidans.map(async (saidan) => {
            return {
                id: saidan.id,
                title: saidan.title,
                description: saidan.description,
                owner: {
                    userId: saidan.owner_id,
                },
                showcase: saidan.showcase,
            };
        }),
    };

    res.status(200).send({
        status: "success",
        data: resData,
    });
};

export const getSaidansById = async (req: EachSaidanRequest, res: Response) => {
    const { id } = req.params;
    const saidanData = await prisma.tobiratory_saidans.findUnique({
        where: {
            id: parseInt(id),
        }
    });

    if (saidanData == null) {
        res.status(404).send({
            status: "error",
            data: 'Item does not exist!',
        });
        return;
    }

    const resData = {
        id: id,
        title: saidanData.title,
        description: saidanData.description,
        owner: {
            userId: saidanData.owner_id,
        },
        showcase: saidanData.showcase,
    };
    res.status(200).send({
        status: "success",
        data: resData,
    });
};
