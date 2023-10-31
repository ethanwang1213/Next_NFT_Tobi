import {config, mutate, tx} from "@onflow/fcl";
import {signer} from "./signer";

config({
  "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
  "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
  "0xTobirapolisFestival23Badge": process.env.FLOW_TOBIRAPOLIS_FESTIVAL23_BADGE_ACCOUNT ?? "FLOW_TOBIRAPOLIS_FESTIVAL23_BADGE_ACCOUNT",
  "0xOthers": process.env.FLOW_OTHER_ACCOUNT ?? "FLOW_OTHER_ACCOUNT",
});

export const createCollection = async () => {
  console.log("Signing Transaction");

  const cadence = `
    import NonFungibleToken from 0xOthers;
    import MetadataViews from 0xOthers
    import TobirapolisFestival23Badge from 0xTobirapolisFestival23Badge

    transaction() {
      prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&TobirapolisFestival23Badge.Collection>(from: TobirapolisFestival23Badge.collectionStoragePath) == nil {
            let collection <- TobirapolisFestival23Badge.createEmptyCollection() as! @TobirapolisFestival23Badge.Collection
            acct.save(<- collection, to: TobirapolisFestival23Badge.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(TobirapolisFestival23Badge.collectionPublicPath, target: TobirapolisFestival23Badge.collectionStoragePath)
        }
      }
    }
  `;

  const args = () => [];
  const proposer = signer;
  const payer = signer;
  const authorizations = [signer];

  const txId = await mutate({
    cadence,
    args,
    proposer,
    payer,
    authorizations,
    limit: 999,
  });

  console.log(`Submitted transaction ${txId} to the network`);
  console.log("%cWaiting for transaction to be sealed...", "color: teal");

  const label = "Transaction Sealing Time";
  console.time(label);

  const txDetails = await tx(txId).onceSealed();

  console.timeEnd(label);
  return txDetails;
};

export const mintTobirapolisFestival23BadgeNFT = async (name: string, description: string) => {
  console.log("%cSigning Transaction", "color: teal");

  const cadence = `
    import NonFungibleToken from 0xOthers;
    import MetadataViews from 0xOthers
    import TobirapolisFestival23Badge from 0xTobirapolisFestival23Badge

    transaction(name: String, description: String) {
        let minter: &TobirapolisFestival23Badge.Minter
        let receiver: Capability<&{NonFungibleToken.Receiver}>
        prepare(acct: AuthAccount) {
           // Setup Collection
            if acct.borrow<&TobirapolisFestival23Badge.Collection>(from: TobirapolisFestival23Badge.collectionStoragePath) == nil {
                let collection <- TobirapolisFestival23Badge.createEmptyCollection() as! @TobirapolisFestival23Badge.Collection
                acct.save(<- collection, to: TobirapolisFestival23Badge.collectionStoragePath)
                acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(TobirapolisFestival23Badge.collectionPublicPath, target: TobirapolisFestival23Badge.collectionStoragePath)
            }
            self.minter = acct.borrow<&TobirapolisFestival23Badge.Minter>(from: TobirapolisFestival23Badge.minterStoragePath) ?? panic("Could not borrow minter reference")
            self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(TobirapolisFestival23Badge.collectionPublicPath)
        }
        execute {
            // let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
            self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description})
        }
    }
  `;

  const args = (arg: any, t: any) => [arg(name, t.String), arg(description, t.String)];
  const proposer = signer;
  const payer = signer;
  const authorizations = [signer];

  const txId = await mutate({
    cadence,
    args,
    proposer,
    payer,
    authorizations,
    limit: 999,
  });

  console.log(`Submitted transaction ${txId} to the network`);
  console.log("%cWaiting for transaction to be sealed...", "color: teal");

  const label = "Transaction Sealing Time";
  console.time(label);

  const txDetails = await tx(txId).onceSealed();

  console.timeEnd(label);
  return txDetails;
};
