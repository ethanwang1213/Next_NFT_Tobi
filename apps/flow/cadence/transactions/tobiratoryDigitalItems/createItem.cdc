import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"
import FungibleToken from 0xee82856bf20e2aa6

transaction(
    type: String,
    name: String,
    description: String,
    imageUrls: [String],
    creatorName: String,
    limit: UInt32?,
    license: String,
) {
    let itemsRef: &TobiratoryDigitalItems.Items
    let itemReviewerRef: &TobiratoryDigitalItems.ItemReviewer
    let royaltyReceiver: Capability<&AnyResource{FungibleToken.Receiver}>

    prepare(creator: AuthAccount, reviewer: AuthAccount) {
        if creator.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) == nil {
            let items <- TobiratoryDigitalItems.createItems()
            creator.save(<- items, to: TobiratoryDigitalItems.ItemsStoragePath)
            creator.link<&{TobiratoryDigitalItems.ItemsPublic}>(
                TobiratoryDigitalItems.ItemsPublicPath,
                target: TobiratoryDigitalItems.ItemsStoragePath
            )
        }
        if creator.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection: @TobiratoryDigitalItems.Collection <- TobiratoryDigitalItems.createEmptyCollection() as! @TobiratoryDigitalItems.Collection
            creator.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            creator.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
                TobiratoryDigitalItems.CollectionPublicPath,
                target: TobiratoryDigitalItems.CollectionStoragePath
            )
        }
        self.itemsRef = creator.borrow<&TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) ?? panic("Not found")
        self.itemReviewerRef = reviewer.borrow<&TobiratoryDigitalItems.ItemReviewer>(from: TobiratoryDigitalItems.ItemReviewerStoragePath) ?? panic("Not found")
        self.royaltyReceiver = creator.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        // self.royaltyReceiver = creator.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver) ?? panic("Not found")
    }

    execute {
        self.itemsRef.createItem(
            type: type,
            name: name,
            description: description,
            imageUrls: imageUrls,
            creatorName: creatorName,
            limit: limit,
            license: license,
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
