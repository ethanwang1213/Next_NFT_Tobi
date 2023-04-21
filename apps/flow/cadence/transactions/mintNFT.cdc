import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core/MetadataViews.cdc"
import SampleNFT from "../contracts/SampleNFT.cdc"

transaction(name: String, description: String, metaURI: String) {
    let minter: Capability<&SampleNFT.Minter>
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&SampleNFT.Collection>(from: SampleNFT.collectionStoragePath) == nil {
            let collection <- SampleNFT.createEmptyCollection() as! @SampleNFT.Collection
            acct.save(<- collection, to: SampleNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(SampleNFT.collectionPublicPath, target: SampleNFT.collectionStoragePath)
        }
        self.minter = SampleNFT.minter()
        self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(SampleNFT.collectionPublicPath)
    }
    execute {
        let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
        minter.mintTo(creator: self.receiver, metadata: {"name": name, "description": description, "metaURI": metaURI})
    }
}
