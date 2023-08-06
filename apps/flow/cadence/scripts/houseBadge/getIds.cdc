import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(HouseBadge.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
