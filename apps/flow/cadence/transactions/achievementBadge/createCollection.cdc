import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import AchievementBadge from "../../contracts/AchievementBadge.cdc"

transaction() {
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&AchievementBadge.Collection>(from: AchievementBadge.collectionStoragePath) == nil {
            let collection <- AchievementBadge.createEmptyCollection() as! @AchievementBadge.Collection
            acct.save(<- collection, to: AchievementBadge.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(AchievementBadge.collectionPublicPath, target: AchievementBadge.collectionStoragePath)
        }
    }
}
