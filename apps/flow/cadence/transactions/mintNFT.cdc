import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core/MetadataViews.cdc"
import TobiraNeko from "../contracts/TobiraNeko.cdc"

transaction(quantity: UInt64) {
    let minter: &TobiraNeko.Minter
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Setup Collection
        if acct.storage.borrow<&TobiraNeko.Collection>(from: TobiraNeko.collectionStoragePath) == nil {
            let collection <- TobiraNeko.createEmptyCollection(nftType: Type<@TobiraNeko.NFT>())
            acct.storage.save(<- collection, to: TobiraNeko.collectionStoragePath)
            let cap: Capability = acct.capabilities.storage.issue<&TobiraNeko.Collection>(TobiraNeko.collectionStoragePath)
            acct.capabilities.publish(cap, at: TobiraNeko.collectionPublicPath)
        }
        self.minter = acct.storage.borrow<&TobiraNeko.Minter>(from: TobiraNeko.minterStoragePath) ?? panic("Could not borrow minter reference")
        self.receiver = acct.capabilities.get<&{NonFungibleToken.Receiver}>(TobiraNeko.collectionPublicPath)
    }
    execute {
        self.minter.batchMintTo(creator: self.receiver, quantity: quantity)
    }
}
