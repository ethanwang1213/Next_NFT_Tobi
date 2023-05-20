import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core/MetadataViews.cdc"
import TobiraNeko from "../contracts/TobiraNeko.cdc"

transaction() {
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&TobiraNeko.Collection>(from: TobiraNeko.collectionStoragePath) == nil {
            let collection <- TobiraNeko.createEmptyCollection() as! @TobiraNeko.Collection
            acct.save(<- collection, to: TobiraNeko.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(TobiraNeko.collectionPublicPath, target: TobiraNeko.collectionStoragePath)
        }
    }
}
