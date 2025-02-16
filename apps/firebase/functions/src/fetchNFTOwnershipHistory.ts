import {REGION, TOBIRATORY_DIGITAL_ITEMS_ADDRESS} from "./lib/constants";
import * as fcl from "@onflow/fcl";
import * as functions from "firebase-functions";

fcl.config({
  "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
  "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
});

const getOwnershipHistory = async (ownerFlowAddress: string, nftId: number) => {
  const cadence = `
import TobiratoryDigitalItems from 0x${TOBIRATORY_DIGITAL_ITEMS_ADDRESS}

access(all) fun main(address: Address, id: String): {UFix64: Address}? {
    let collection = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowTobiratoryNFT(UInt64.fromString(id)!)

    return nft?.getOwnerHistory();
}`;

  try {
    console.log(`Fetch ownership history: ${ownerFlowAddress}, ${nftId}`);
    console.log(` flow.network: ${process.env.FLOW_NETWORK}, accessNode.api: ${process.env.FLOW_ACCESS_NODE_API}`);
    console.log(JSON.stringify(await fcl.config().all()));

    fcl.send([fcl.ping()])
        .then(() => {
          console.log("SUCCESS");
        })
        .catch((e) => {
          console.log("ERROR: ");
          throw e;
        });

    const result = await fcl.query({
      cadence,
      args: (arg: any, t: any) => [arg(ownerFlowAddress, t.Address), arg(String(nftId), t.String)],
    });
    return result;
  } catch (e) {
    console.log("The error occurs while fetching ownership history: ");
    console.error(e);
  }

  return;
};

export const fetchNFTOwnershipHistory = functions.region(REGION).https.onRequest(async (request, response) => {
  const {account, id} = request.query;
  if (!account || !id) {
    response.status(500).send("Invalid parameter 'account' or 'id'").end();
    return;
  }
  const result = await getOwnershipHistory(String(account), Number(id));
  response.status(200).json(result);
});
