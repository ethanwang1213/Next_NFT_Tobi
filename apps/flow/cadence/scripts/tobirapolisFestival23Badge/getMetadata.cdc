import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import TobirapolisFestival23 from "../../contracts/TobirapolisFestival23.cdc"

pub struct NFTView {
  pub let name: String
  pub let description: String
  pub let metaURI: String

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

pub fun main(address: Address, id: String): NFTView {
    let collection = getAccount(address)
        .getCapability(TobirapolisFestival23.collectionPublicPath)
        .borrow<&{TobirapolisFestival23.CollectionPublic,MetadataViews.ResolverCollection}>()
        ?? panic("NFT Collection not found")

    let nft = collection.borrowViewResolver(id: UInt64.fromString(id)!)
    let display = MetadataViews.getDisplay(nft)
    return NFTView(
        name: display!.name,
        description: display!.description,
        metaURI: display!.thumbnail.uri()
    )

    // let nft = collection.borrow(id: UInt64.fromString(id)!)
    // return nft?.getMetadata()
}
