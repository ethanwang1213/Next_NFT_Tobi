import {config, mutate, tx} from "@onflow/fcl";
import {signer} from "./signer";

config({
  "flow.network": process.env.FLOW_NETWORK ?? "FLOW_NETWORK",
  "accessNode.api": process.env.FLOW_ACCESS_NODE_API ?? "FLOW_ACCESS_NODE_API",
  "0xJournalStampRally": process.env.FLOW_JOURNAL_STAMP_RALLY_ACCOUNT ?? "FLOW_JOURNAL_STAMP_RALLY_ACCOUNT",
  "0xOthers": process.env.FLOW_OTHER_ACCOUNT ?? "FLOW_OTHER_ACCOUNT",
});

export const sendMintJournalStampRallyNftTx = async (name: string, description: string) => {
  console.log("%cSigning Transaction", "color: teal");

  const cadence = `
    import NonFungibleToken from 0xOthers
    import MetadataViews from 0xOthers
    import JournalStampRally from 0xJournalStampRally
    
    transaction(name: String, description: String) {
        let minter: &JournalStampRally.Minter
        let receiver: Capability<&{NonFungibleToken.Receiver}>
        prepare(acct: AuthAccount) {
            if acct.borrow<&JournalStampRally.Collection>(from: JournalStampRally.collectionStoragePath) == nil {
                let collection <- JournalStampRally.createEmptyCollection() as! @JournalStampRally.Collection
                acct.save(<- collection, to: JournalStampRally.collectionStoragePath)
                acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(JournalStampRally.collectionPublicPath, target: JournalStampRally.collectionStoragePath)
            }
            self.minter = acct.borrow<&JournalStampRally.Minter>(from: JournalStampRally.minterStoragePath) ?? panic("Could not borrow minter reference")
            self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(JournalStampRally.collectionPublicPath)
        }
        execute {
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
