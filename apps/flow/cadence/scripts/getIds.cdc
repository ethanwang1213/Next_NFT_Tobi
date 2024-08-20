import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import TobiraNeko from "../contracts/TobiraNeko.cdc"

access(all) fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .capabilities.get<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(TobiraNeko.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
