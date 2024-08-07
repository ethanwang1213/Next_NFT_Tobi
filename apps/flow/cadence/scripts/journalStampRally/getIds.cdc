import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import JournalStampRally from "../../contracts/JournalStampRally.cdc"

access(all) fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .capabilities.get<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(JournalStampRally.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
