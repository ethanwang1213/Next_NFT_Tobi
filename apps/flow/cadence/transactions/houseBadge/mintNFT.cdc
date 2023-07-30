import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

transaction(name: String, description: String) {
    let minter: &HouseBadge.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&HouseBadge.Collection>(from: HouseBadge.collectionStoragePath) == nil {
            let collection <- HouseBadge.createEmptyCollection() as! @HouseBadge.Collection
            acct.save(<- collection, to: HouseBadge.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(HouseBadge.collectionPublicPath, target: HouseBadge.collectionStoragePath)
        }
        self.minter = acct.borrow<&HouseBadge.Minter>(from: HouseBadge.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(HouseBadge.collectionPublicPath)
    }
    execute {
        // let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
        self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description})
    }
}
