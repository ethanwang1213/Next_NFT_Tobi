import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

access(all) fun main(address: Address, id: String): {UFix64: Address}? {
    let collection = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowTobiratoryNFT(UInt64.fromString(id)!)

    return nft?.getOwnerHistory();
}
