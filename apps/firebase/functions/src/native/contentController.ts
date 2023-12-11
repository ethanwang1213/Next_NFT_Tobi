import { Response } from "express";
// import {firestore} from "firebase-admin";
import { PrismaClient } from "@prisma/client";

type AllAccountRequest = {
    params: {
        q: string,
        sortBy: any,
        sortOrder: "desc" | "asc"
    }
}

type AccountRequest = {
    params: { id: number }
}

const prisma = new PrismaClient();

export const getContents = async (req: AllAccountRequest, res: Response) => {
    const { q, sortBy, sortOrder } = req.params;
    const orderValue = {};
    Object.defineProperty(orderValue, sortBy, {
        value: sortOrder,
        writable: false,
        enumerable: true,
        configurable: true,
    });
    const accounts = await prisma.tobiratory_contents.findMany({
        where: {
            title: {
                in: [q],
            }
        },
        orderBy: orderValue
    });
    const resData = {
        contents: accounts.map(async (account) => {
            return {
                id: account.id,
                title: account.title,
                image: account.image
            };
        }),
    };

    res.status(200).send({
        status: "success",
        data: resData,
    });
};

export const getContentById = async (req: AccountRequest, res: Response) => {
    const { id } = req.params;
    const accountData = await prisma.tobiratory_contents.findUnique({
        where: {
            id: id,
        }
    });

    if (accountData == null) {
        res.status(404).send({
            status: "error",
            data: 'Account does not exist!',
        });
        return;
    }

    const resData = {
        id: id,
        title: accountData.title,
        image: accountData.image,
        creator: {
            userId: accountData.creator_user_id,
            username: accountData.creator_username,
            icon: accountData.creator_username,
            sns: accountData.creator_sns,
        },
    };
    res.status(200).send({
        status: "success",
        data: resData,
    });
};
