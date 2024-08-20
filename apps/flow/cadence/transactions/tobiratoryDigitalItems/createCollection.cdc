import MetadataViews from "../../contracts/core/MetadataViews.cdc";
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction() {
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        if acct.storage.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
            acct.storage.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionStoragePath)
            acct.capabilities.publish(cap, at: TobiratoryDigitalItems.CollectionPublicPath)
        }
    }
}
