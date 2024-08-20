import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import AchievementBadge from "../../contracts/AchievementBadge.cdc"

transaction() {
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Setup Collection
        if acct.storage.borrow<&AchievementBadge.Collection>(from: AchievementBadge.collectionStoragePath) == nil {
            let collection <- AchievementBadge.createEmptyCollection(nftType: Type<@AchievementBadge.NFT>())
            acct.storage.save(<- collection, to: AchievementBadge.collectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&AchievementBadge.Collection>(AchievementBadge.collectionStoragePath)
            acct.capabilities.publish(cap, at: AchievementBadge.collectionPublicPath)
        }
    }
}
