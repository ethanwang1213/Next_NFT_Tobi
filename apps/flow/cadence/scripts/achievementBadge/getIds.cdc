import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import AchievementBadge from "../../contracts/AchievementBadge.cdc"

pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(AchievementBadge.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
