import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

access(all) fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .capabilities.get<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(HouseBadge.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
