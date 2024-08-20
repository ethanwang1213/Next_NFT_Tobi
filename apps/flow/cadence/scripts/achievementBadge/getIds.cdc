import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import AchievementBadge from "../../contracts/AchievementBadge.cdc"

access(all) fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .capabilities.get<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(AchievementBadge.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
