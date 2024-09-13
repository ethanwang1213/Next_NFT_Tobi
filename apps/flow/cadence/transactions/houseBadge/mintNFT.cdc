import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

transaction(name: String, description: String) {
    let minter: &HouseBadge.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Setup Collection
        if acct.storage.borrow<&HouseBadge.Collection>(from: HouseBadge.collectionStoragePath) == nil {
            let collection <- HouseBadge.createEmptyCollection(nftType: Type<@HouseBadge.NFT>())
            acct.storage.save(<- collection, to: HouseBadge.collectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&HouseBadge.Collection>(HouseBadge.collectionStoragePath)
            acct.capabilities.publish(cap, at: HouseBadge.collectionPublicPath)
        }
        self.minter = acct.storage.borrow<&HouseBadge.Minter>(from: HouseBadge.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.capabilities.get<&{NonFungibleToken.Receiver}>(HouseBadge.collectionPublicPath)
    }
    execute {
        self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description})
    }
}
