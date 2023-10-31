import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import Festival23 from "../../contracts/Festival23.cdc"

transaction() {
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&Festival23.Collection>(from: Festival23.collectionStoragePath) == nil {
            let collection <- Festival23.createEmptyCollection() as! @Festival23.Collection
            acct.save(<- collection, to: Festival23.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(Festival23.collectionPublicPath, target: Festival23.collectionStoragePath)
        }
    }
}
