import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

access(all) fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
