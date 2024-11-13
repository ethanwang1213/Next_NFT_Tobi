import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import JournalStampRally from "../../contracts/JournalStampRally.cdc"

transaction() {
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Setup Collection
        if acct.storage.borrow<&JournalStampRally.Collection>(from: JournalStampRally.collectionStoragePath) == nil {
            let collection <- JournalStampRally.createEmptyCollection(nftType: Type<@JournalStampRally.NFT>())
            acct.storage.save(<- collection, to: JournalStampRally.collectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&JournalStampRally.Collection>(JournalStampRally.collectionStoragePath)
            acct.capabilities.publish(cap, at: JournalStampRally.collectionPublicPath)
        }
    }
}
