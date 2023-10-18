import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import TobirapolisFestival23 from "../../contracts/TobirapolisFestival23.cdc"

pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(TobirapolisFestival23.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
