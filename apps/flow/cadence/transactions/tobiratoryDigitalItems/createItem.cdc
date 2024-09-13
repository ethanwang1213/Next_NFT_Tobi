import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"
import "FungibleToken"

transaction(
    type: String,
    name: String?,
    description: String?,
    thumbnailUrl: String,
    modelUrl: String?,
    creatorName: String,
    limit: UInt32?,
    license: String?,
    copyrightHolders: [String],
) {
    let itemsRef: &TobiratoryDigitalItems.Items
    let itemReviewerRef: &TobiratoryDigitalItems.ItemReviewer
    let royaltyReceiver: Capability<&{FungibleToken.Receiver}>

    prepare(
        creator: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account,
        reviewer: auth(BorrowValue) &Account
    ) {
        if creator.storage.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) == nil {
            let items <- TobiratoryDigitalItems.createItems()
            creator.storage.save(<- items, to: TobiratoryDigitalItems.ItemsStoragePath)
            let cap = creator.capabilities.storage.issue<&TobiratoryDigitalItems.Items>(TobiratoryDigitalItems.ItemsStoragePath)
            creator.capabilities.publish(cap, at: TobiratoryDigitalItems.ItemsPublicPath)
        }
        if creator.storage.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
            creator.storage.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            let cap = creator.capabilities.storage.issue<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionStoragePath)
            creator.capabilities.publish(cap, at: TobiratoryDigitalItems.CollectionPublicPath)
        }
        self.itemsRef = creator.storage.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) ?? panic("Not found")
        self.itemReviewerRef = reviewer.storage.borrow<&TobiratoryDigitalItems.ItemReviewer>(from: TobiratoryDigitalItems.ItemReviewerStoragePath) ?? panic("Not found")
        self.royaltyReceiver = creator.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    }

    execute {
        self.itemsRef.createItem(
            type: type,
            name: name,
            description: description,
            thumbnailUrl: thumbnailUrl,
            modelUrl: modelUrl,
            creatorName: creatorName,
            limit: limit,
            license: license,
            copyrightHolders: copyrightHolders,
            royalties: [
                MetadataViews.Royalty(
                    receiver: self.royaltyReceiver,
                    cut: 0.1,
                    description: ""
                )
            ],
            extraMetadata: {},
            itemReviewer: self.itemReviewerRef,
        )
    }
}
