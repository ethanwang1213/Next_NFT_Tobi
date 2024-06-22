import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import JournalStampRally from "../../contracts/JournalStampRally.cdc"

pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(JournalStampRally.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
