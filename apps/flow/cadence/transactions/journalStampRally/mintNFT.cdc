import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import JournalStampRally from "../../contracts/JournalStampRally.cdc"

transaction(name: String, description: String) {
    let minter: &JournalStampRally.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Setup Collection
        if acct.storage.borrow<&JournalStampRally.Collection>(from: JournalStampRally.collectionStoragePath) == nil {
            let collection <- JournalStampRally.createEmptyCollection(nftType: Type<@JournalStampRally.NFT>())
            acct.storage.save(<- collection, to: JournalStampRally.collectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&JournalStampRally.Collection>(JournalStampRally.collectionStoragePath)
            acct.capabilities.publish(cap, at: JournalStampRally.collectionPublicPath)
        }
        self.minter = acct.storage.borrow<&JournalStampRally.Minter>(from: JournalStampRally.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.capabilities.get<&{NonFungibleToken.Receiver}>(JournalStampRally.collectionPublicPath)
    }
    execute {
        self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description})
    }
}
