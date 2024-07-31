import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import Festival23 from "../../contracts/Festival23.cdc"

transaction() {
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Setup Collection
        if acct.storage.borrow<&Festival23.Collection>(from: Festival23.collectionStoragePath) == nil {
            let collection <- Festival23.createEmptyCollection(nftType: Type<@Festival23.NFT>())
            acct.storage.save(<- collection, to: Festival23.collectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&Festival23.Collection>(Festival23.collectionStoragePath)
            acct.capabilities.publish(cap, at: Festival23.collectionPublicPath)
        }
    }
}
