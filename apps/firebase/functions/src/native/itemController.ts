import { Response } from "express";
// import {firestore} from "firebase-admin";
import { PrismaClient } from "@prisma/client";

type AllItemRequest = {
    params: {
        q: string,
        type: string,
        creator: string,
        sortBy: string,
        sortOrder: "desc" | "asc"
    }
}

type EachItemRequest = {
    params: { id: string }
}

const prisma = new PrismaClient();

export const getItems = async (req: AllItemRequest, res: Response) => {
    const { q, type, creator, sortBy, sortOrder } = req.params;
    const orderValue = {};
    Object.defineProperty(orderValue, sortBy, {
        value: sortOrder,
        writable: false,
        enumerable: true,
        configurable: true,
    });
    const items = await prisma.tobiratory_items.findMany({
        where: {
            title: {
                in: [q],
            },
            type: {
                equals: type,
            },
        },
        orderBy: orderValue
    });
    const resData = {
        items: items.map(async (item) => {
            const content = await prisma.tobiratory_contents.findUnique({
                where: {
                    id: item.content_id,
                    creator_user_id: creator,
                }
            });

            return {
                id: item.id,
                title: item.title,
                image: item.image,
                type: item.type,
                content: {
                    id: content?.id ?? -1,
                    creator: {
                        userId: content?.creator_user_id,
                    }
                }
            };
        }),
    };

    res.status(200).send({
        status: "success",
        data: resData,
    });
};

export const getItemsById = async (req: EachItemRequest, res: Response) => {
    const { id } = req.params;
    const itemData = await prisma.tobiratory_items.findUnique({
        where: {
            id: parseInt(id),
        }
    });

    if (itemData == null) {
        res.status(404).send({
            status: "error",
            data: 'Item does not exist!',
        });
        return;
    }

    const contentData = await prisma.tobiratory_contents.findUnique({
        where: {
            id: itemData.content_id,
        }
    });

    if (contentData == null) {
        res.status(404).send({
            status: "error",
            data: 'Content for this item does not exist!',
        });
        return;
    }

    const resData = {
        id: id,
        title: itemData.title,
        image: itemData.image,
        type: itemData.type,
        content: {
            id: contentData.id,
            creator: {
                userId: contentData.creator_user_id,
            }
        },
    };
    res.status(200).send({
        status: "success",
        data: resData,
    });
};
