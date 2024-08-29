/**
 * Adds object if object is empty.
 * @param {object} obj The parameter of function.
 * @returns {boolean} The if obj is empty.
 */

import AdmZip from "adm-zip";
import {numberOfLimitTransaction, resetLimitTransactionDuration, resetLimitTransactionTime} from "../lib/constants";
import {prisma} from "../prisma";

export function isEmptyObject(obj: object): boolean {
  const len = Object.keys(obj).length;
  if (len) {
    return true;
  } else {
    return false;
  }
}

export function getBoxAddress(userId: number, boxId: number): string {
  const userIdPad = userId.toString().padStart(4, "0");
  const boxIdPad = boxId.toString().padStart(5, "0");
  let address = Buffer.from(userIdPad + "_" + boxIdPad, "ascii").toString("base64");
  address = "TB" + address.replace("==", "");
  return address;
}

export const statusOfShowcase = {
  private: 0,
  public: 1,
  publicSchedule: 2,
};

export const digitalItemStatus = {
  draft: 1,
  private: 2,
  hidden: 3,
  viewingOnly: 4,
  onSale: 5,
};

export const mintStatus = {
  error: 0,
  minting: 1,
  minted: 2,
  opened: 3,
};

export const giftStatus = {
  none: 0,
  error: 1,
  gifting: 2,
};

export enum statusOfLimitTransaction {
  notExistAccount,
  limitedTransaction,
  permitted,
}

export async function increaseTransactionAmount(uuid: string): Promise<statusOfLimitTransaction> {
  const userData = await prisma.accounts.findUnique({
    where: {
      uuid: uuid,
    },
  });
  if (!userData) {
    return statusOfLimitTransaction.notExistAccount;
  }
  if (userData.transaction_amount>=numberOfLimitTransaction) {
    const now = Date.now();
    const lastUpdatedTime = new Date(userData.last_limit_updated_time).getTime();
    if (now-lastUpdatedTime>=resetLimitTransactionDuration) {
      const todayResetTime = new Date(new Date().setHours(resetLimitTransactionTime, 0, 0, 0));
      await prisma.accounts.update({
        where: {
          uuid: uuid,
        },
        data: {
          last_limit_updated_time: todayResetTime,
          transaction_amount: 1,
        },
      });
      return statusOfLimitTransaction.permitted;
    }
    return statusOfLimitTransaction.limitedTransaction;
  }
  await prisma.accounts.update({
    where: {
      uuid: uuid,
    },
    data: {
      transaction_amount: {
        increment: 1,
      },
    },
  });
  return statusOfLimitTransaction.permitted;
}

export const allowedExtension = [
  ".gltf", ".bin", ".png", ".jpg", ".jpeg", ".DS_Store",
];

export const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;

export const checkUri = (uri: string, entries: AdmZip.IZipEntry[], modelName: string) => {
  let flag = false;
  const modelDir = modelName.replace(modelName.split("/").pop()??"", "");
  for (const entry of entries) {
    const entryName = entry.entryName;
    if (entryName==(modelDir+uri)) {
      flag = true;
      return entryName;
    }
  }
  return flag;
};
