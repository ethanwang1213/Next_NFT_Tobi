import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core/MetadataViews.cdc"
import TobiraNeko from "../contracts/TobiraNeko.cdc"

transaction(name: String, description: String, metaURI: String) {
    let minter: &TobiraNeko.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&TobiraNeko.Collection>(from: TobiraNeko.collectionStoragePath) == nil {
            let collection <- TobiraNeko.createEmptyCollection() as! @TobiraNeko.Collection
            acct.save(<- collection, to: TobiraNeko.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(TobiraNeko.collectionPublicPath, target: TobiraNeko.collectionStoragePath)
        }
        // self.minter = TobiraNeko.minter()
        self.minter = acct.borrow<&TobiraNeko.Minter>(from: TobiraNeko.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(TobiraNeko.collectionPublicPath)
    }
    execute {
        // let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
        self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description, "metaURI": metaURI})
    }
}
