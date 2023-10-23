import {sansPrefix} from "@onflow/fcl";
import {sha256} from "js-sha256";
import {SHA3} from "sha3";
import {ec as EC} from "elliptic";

const curve = new EC("p256");

const hashMessageHex = (hashType: string, msgHex: string) => {
  const buffer = Buffer.from(msgHex, "hex");
  if (hashType === "sha3") {
    return sha256.digest(buffer);
  } else if (hashType === "sha256") {
    const sha3 = new SHA3(256);
    sha3.update(buffer);
    return sha3.digest();
  } else {
    throw Error("Invalid arguments");
  }
};

const signWithKey = ({privateKey, msgHex}: {privateKey: string, msgHex: string}) => {
  const key = curve.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMessageHex("sha3", msgHex));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

export const signer = async (account: any) => {
  const accountAddress = process.env.FLOW_ACHIEVEMENT_BADGE_ACCOUNT;
  const pkey = process.env.FLOW_ACHIEVEMENT_BADGE_ACCOUNT_PKEY;
  const keyId = Number(process.env.FLOW_ACHIEVEMENT_BADGE_ACCOUNT_KEY_ID);
  if (!accountAddress || !pkey) {
    throw new Error("The environment of flow signer is not defined.");
  }
  return {
    ...account,
    tempId: `${accountAddress}-${keyId}`,
    addr: sansPrefix(accountAddress),
    keyId,
    signingFunction: async (signable: any) => {
      const signature = signWithKey({privateKey: pkey, msgHex: signable.message});
      return {
        addr: accountAddress,
        keyId,
        signature,
      };
    },
  };
}
