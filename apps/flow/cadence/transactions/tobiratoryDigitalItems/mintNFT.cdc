import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(
    itemCreatorAddress: Address,
    itemID: UInt64,
    purchasePrice: UFix64,
    purchasePriceCurrency: String,
    regularPrice: UFix64,
    regularPriceCurrency: String,
) {
    let receiverRef: &{NonFungibleToken.Receiver}
    let itemsRef: &{TobiratoryDigitalItems.ItemsPublic}
    let minterRef: &TobiratoryDigitalItems.Minter

    prepare(user: AuthAccount, minter: AuthAccount) {
        if user.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection: @TobiratoryDigitalItems.Collection <- TobiratoryDigitalItems.createEmptyCollection() as! @TobiratoryDigitalItems.Collection
            user.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            user.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
                TobiratoryDigitalItems.CollectionPublicPath,
                target: TobiratoryDigitalItems.CollectionStoragePath
            )
        }
        self.receiverRef = user.getCapability<&{NonFungibleToken.Receiver}>(TobiratoryDigitalItems.CollectionPublicPath).borrow()!
        self.itemsRef = getAccount(itemCreatorAddress).getCapability<&{TobiratoryDigitalItems.ItemsPublic}>(TobiratoryDigitalItems.ItemsPublicPath).borrow() ?? panic("Not found")
        self.minterRef = minter.borrow<&TobiratoryDigitalItems.Minter>(from: TobiratoryDigitalItems.MinterStoragePath) ?? panic("Not found")
    }

    execute {
        let nft <- self.itemsRef.mint(
            itemID: itemID,
            purchasePrice: purchasePrice,
            purchasePriceCurrency: purchasePriceCurrency,
            regularPrice: regularPrice,
            regularPriceCurrency: regularPriceCurrency,
            extraMetadata: {},
        )
        self.receiverRef.deposit(token: <- nft)
    }
}
