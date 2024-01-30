import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc";
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction() {
    prepare(acct: AuthAccount) {
        if acct.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection: @TobiratoryDigitalItems.Collection <- TobiratoryDigitalItems.createEmptyCollection() as! @TobiratoryDigitalItems.Collection
            acct.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            acct.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
                TobiratoryDigitalItems.CollectionPublicPath,
                target: TobiratoryDigitalItems.CollectionStoragePath
            )
        }
    }
}
