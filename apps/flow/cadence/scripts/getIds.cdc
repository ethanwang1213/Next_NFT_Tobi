import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import TobiraNeko from "../contracts/TobiraNeko.cdc"

pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(TobiraNeko.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
