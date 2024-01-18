import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

pub struct NFTView {
  pub let name: String
  pub let description: String
  pub let thumbnail: String

  init(
      name: String,
      description: String,
      thumbnail: String
  ) {
      self.name = name
      self.description = description
      self.thumbnail = thumbnail
  }
}

pub fun main(address: Address, id: String): NFTView {
    let collection = getAccount(address)
        .getCapability(TobiratoryDigitalItems.CollectionPublicPath)
        .borrow<&{TobiratoryDigitalItems.CollectionPublic,MetadataViews.ResolverCollection}>()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowViewResolver(id: UInt64.fromString(id)!)
    let display = MetadataViews.getDisplay(nft)
    return NFTView(
        name: display!.name,
        description: display!.description,
        thumbnail: display!.thumbnail.uri()
    )

    // let nft = collection.borrow(id: UInt64.fromString(id)!)
    // return nft?.getMetadata()
}
