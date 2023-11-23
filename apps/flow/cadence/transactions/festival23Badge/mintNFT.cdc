import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import Festival23 from "../../contracts/Festival23.cdc"

transaction(name: String, description: String) {
    let minter: &Festival23.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&Festival23.Collection>(from: Festival23.collectionStoragePath) == nil {
            let collection <- Festival23.createEmptyCollection() as! @Festival23.Collection
            acct.save(<- collection, to: Festival23.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(Festival23.collectionPublicPath, target: Festival23.collectionStoragePath)
        }
        self.minter = acct.borrow<&Festival23.Minter>(from: Festival23.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(Festival23.collectionPublicPath)
    }
    execute {
        // let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
        self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description})
    }
}
