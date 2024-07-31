import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

access(all) struct NFTView {
  access(all) let name: String
  access(all) let description: String
  access(all) let thumbnail: String

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

access(all) fun main(address: Address, id: String): NFTView {
    let collection = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Collection>(TobiratoryDigitalItems.CollectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowViewResolver(id: UInt64.fromString(id)!)!
    let display = MetadataViews.getDisplay(nft)
    return NFTView(
        name: display!.name,
        description: display!.description,
        thumbnail: display!.thumbnail.uri()
    )

    // let nft = collection.borrow(id: UInt64.fromString(id)!)
    // return nft?.getMetadata()
}
