import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobirapolisFestival23 from "../../contracts/TobirapolisFestival23.cdc"

transaction() {
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&TobirapolisFestival23.Collection>(from: TobirapolisFestival23.collectionStoragePath) == nil {
            let collection <- TobirapolisFestival23.createEmptyCollection() as! @TobirapolisFestival23.Collection
            acct.save(<- collection, to: TobirapolisFestival23.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(TobirapolisFestival23.collectionPublicPath, target: TobirapolisFestival23.collectionStoragePath)
        }
    }
}
