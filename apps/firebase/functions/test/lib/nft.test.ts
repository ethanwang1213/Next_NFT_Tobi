import * as tobiraneko from "../../src/lib/nft";
import {NEKO_NFT_ID} from "../../src/lib/constants";

const nftNames = [
  {name: "TOBIRA NEKO #1", expectedId: "1", expectedType: NEKO_NFT_ID},
  {name: "TOBIRA NEKO #00001", expectedId: "1", expectedType: NEKO_NFT_ID},
  {name: "TOBIRA NEKO #00002", expectedId: "2", expectedType: NEKO_NFT_ID},
  {name: "TOBIRA NEKO #99999", expectedId: "99999", expectedType: NEKO_NFT_ID},
  {name: "", expectedId: "", expectedType: "UNDENTIFIED"},
  {name: "aaa", expectedId: "aaa", expectedType: "UNDENTIFIED"},
  {name: "TOBIRA NEKO #", expectedId: "TOBIRA NEKO #", expectedType: "UNDENTIFIED"},
  {name: "TOBIRA NEKO #aaa", expectedId: "TOBIRA NEKO #aaa", expectedType: "UNDENTIFIED"},
];

test.each(nftNames)("check parseNftByName", (c) => {
  const res = tobiraneko.parseNftByName(c.name);
  expect(res.id).toBe(c.expectedId);
  expect(res.type).toBe(c.expectedType);
});
