import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobirapolisFestival23 from "../../contracts/TobirapolisFestival23.cdc"

transaction(name: String, description: String) {
    let minter: &TobirapolisFestival23.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&TobirapolisFestival23.Collection>(from: TobirapolisFestival23.collectionStoragePath) == nil {
            let collection <- TobirapolisFestival23.createEmptyCollection() as! @TobirapolisFestival23.Collection
            acct.save(<- collection, to: TobirapolisFestival23.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(TobirapolisFestival23.collectionPublicPath, target: TobirapolisFestival23.collectionStoragePath)
        }
        self.minter = acct.borrow<&TobirapolisFestival23.Minter>(from: TobirapolisFestival23.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(TobirapolisFestival23.collectionPublicPath)
    }
    execute {
        // let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
        self.minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description})
    }
}
