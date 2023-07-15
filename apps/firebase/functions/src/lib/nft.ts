import * as voucher from "voucher-code-generator";
import {NEKO_NFT_ID, IMAGE_HOST} from "./constants";

export type Item = {
  name: string;
  price?: number;
  quantity?: number;
  redeem?: string;
  used_at?: Date;
}

export type Nft = {
  id: string;
  type: string;
  name: string;
  thumbnail: string;
  metadata?: string;
}

export const generateRedeemCode = () => {
  return voucher.generate({
    pattern: "####-####-####",
    count: 1,
    charset: "0123456789123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  })[0];
};

const tobiranekoRegExp = new RegExp("TOBIRA NEKO #([0-9]+)");

export const parseNftByName = (name: string): Nft => {
  const isTobiraneko = name.match(tobiranekoRegExp);
  if (isTobiraneko) {
    const id = parseInt(isTobiraneko[1]).toString();
    return {
      id: id,
      type: NEKO_NFT_ID,
      name: name,
      thumbnail: `${IMAGE_HOST}/nft/tobiraneko/${id}.png`,
    };
  }
  return {
    id: name,
    type: "UNDENTIFIED",
    name: name,
    thumbnail: `${IMAGE_HOST}/nft/dummy.png`,
  };
};
