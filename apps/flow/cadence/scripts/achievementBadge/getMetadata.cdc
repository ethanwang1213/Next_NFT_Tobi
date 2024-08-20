import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import AchievementBadge from "../../contracts/AchievementBadge.cdc"

access(all) struct NFTView {
  access(all) let name: String
  access(all) let description: String
  access(all) let metaURI: String

  init(
      name: String,
      description: String,
      metaURI: String
  ) {
      self.name = name
      self.description = description
      self.metaURI = metaURI
  }
}

access(all) fun main(address: Address, id: String): NFTView {
    let collection = getAccount(address)
        .capabilities.get<&AchievementBadge.Collection>(AchievementBadge.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowViewResolver(id: UInt64.fromString(id)!)!
    let display = MetadataViews.getDisplay(nft)
    return NFTView(
        name: display!.name,
        description: display!.description,
        metaURI: display!.thumbnail.uri()
    )

    // let nft = collection.borrow(id: UInt64.fromString(id)!)
    // return nft?.getMetadata()
}
