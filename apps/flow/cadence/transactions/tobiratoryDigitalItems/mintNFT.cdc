import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(
    itemCreatorAddress: Address,
    itemID: UInt64,
) {
    let receiverRef: &{NonFungibleToken.Receiver}
    let minterRef: &TobiratoryDigitalItems.Minter

    prepare(
        user: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account,
        minter: auth(BorrowValue) &Account
    ) {
        if user.storage.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) == nil {
            let collection <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
            user.storage.save(<- collection, to: TobiratoryDigitalItems.CollectionStoragePath)
            let cap: Capability = user.capabilities.storage.issue<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionStoragePath)
            user.capabilities.publish(cap, at: TobiratoryDigitalItems.CollectionPublicPath)
        }
        self.receiverRef = user.capabilities.get<&{NonFungibleToken.Receiver}>(TobiratoryDigitalItems.CollectionPublicPath).borrow()!
        self.minterRef = minter.storage.borrow<&TobiratoryDigitalItems.Minter>(from: TobiratoryDigitalItems.MinterStoragePath) ?? panic("Not found")
    }

    execute {
        let nft <- self.minterRef.mint(
            itemCreatorAddress: itemCreatorAddress,
            itemID: itemID,
            extraMetadata: {},
        )
        self.receiverRef.deposit(token: <- nft)
    }
}
