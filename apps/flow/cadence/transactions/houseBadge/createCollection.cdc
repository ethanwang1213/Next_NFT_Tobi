import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

transaction() {
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Setup Collection
        if acct.storage.borrow<&HouseBadge.Collection>(from: HouseBadge.collectionStoragePath) == nil {
            let collection <- HouseBadge.createEmptyCollection(nftType: Type<@HouseBadge.NFT>())
            acct.storage.save(<- collection, to: HouseBadge.collectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&HouseBadge.Collection>(HouseBadge.collectionStoragePath)
            acct.capabilities.publish(cap, at: HouseBadge.collectionPublicPath)
        }
    }
}
