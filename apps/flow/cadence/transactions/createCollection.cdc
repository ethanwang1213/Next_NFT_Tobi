import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core/MetadataViews.cdc"
import SampleNFT from "../contracts/SampleNFT.cdc"

transaction() {
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&SampleNFT.Collection>(from: SampleNFT.collectionStoragePath) == nil {
            let collection <- SampleNFT.createEmptyCollection() as! @SampleNFT.Collection
            acct.save(<- collection, to: SampleNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(SampleNFT.collectionPublicPath, target: SampleNFT.collectionStoragePath)
        }
    }
}
