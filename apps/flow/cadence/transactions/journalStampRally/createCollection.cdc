import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc";
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import JournalStampRally from "../../contracts/JournalStampRally.cdc"

transaction() {
    prepare(acct: AuthAccount) {
        if acct.borrow<&JournalStampRally.Collection>(from: JournalStampRally.collectionStoragePath) == nil {
            let collection <- JournalStampRally.createEmptyCollection() as! @JournalStampRally.Collection
            acct.save(<- collection, to: JournalStampRally.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(JournalStampRally.collectionPublicPath, target: JournalStampRally.collectionStoragePath)
        }
    }
}
