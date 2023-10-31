import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import Festival23 from "../../contracts/Festival23.cdc"

pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(Festival23.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
