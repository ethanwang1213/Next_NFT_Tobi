import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import AchievementBadge from "../../contracts/AchievementBadge.cdc"

transaction(name: String, description: String) {
    let minter: &AchievementBadge.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&AchievementBadge.Collection>(from: AchievementBadge.collectionStoragePath) == nil {
            let collection <- AchievementBadge.createEmptyCollection() as! @AchievementBadge.Collection
            acct.save(<- collection, to: AchievementBadge.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(AchievementBadge.collectionPublicPath, target: AchievementBadge.collectionStoragePath)
        }
        self.minter = acct.borrow<&AchievementBadge.Minter>(from: AchievementBadge.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(AchievementBadge.collectionPublicPath)
    }
    execute {
        // let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
        self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description})
    }
}
