import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import Festival23 from "../../contracts/Festival23.cdc"

access(all) fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .capabilities.get<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(Festival23.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
