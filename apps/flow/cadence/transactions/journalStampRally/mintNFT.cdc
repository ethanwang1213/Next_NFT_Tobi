import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import JournalStampRally from "../../contracts/JournalStampRally.cdc"

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
