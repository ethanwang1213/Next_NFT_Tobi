import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

pub fun main(address: Address, id: String): MetadataViews.Traits {
    let collection = getAccount(address)
        .getCapability(TobiratoryDigitalItems.CollectionPublicPath)
        .borrow<&{TobiratoryDigitalItems.CollectionPublic,MetadataViews.ResolverCollection}>()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowTobiratoryNFT(id: UInt64.fromString(id)!)
    let traits = (nft!.resolveView(Type<MetadataViews.Traits>()) as! MetadataViews.Traits?)!
    for trait in traits.traits {
        log(trait)
    }
    return traits
}
