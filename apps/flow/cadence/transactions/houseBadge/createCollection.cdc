import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

transaction() {
    prepare(acct: AuthAccount) {
       // Setup Collection
        if acct.borrow<&HouseBadge.Collection>(from: HouseBadge.collectionStoragePath) == nil {
            let collection <- HouseBadge.createEmptyCollection() as! @HouseBadge.Collection
            acct.save(<- collection, to: HouseBadge.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(HouseBadge.collectionPublicPath, target: HouseBadge.collectionStoragePath)
        }
    }
}
