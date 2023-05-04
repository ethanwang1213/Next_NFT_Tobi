import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core/MetadataViews.cdc"
import SampleNFT from "../contracts/SampleNFT.cdc"

pub struct NFTView {
  pub let name: String
  pub let description: String
  pub let externalURL: String

  init(
      name: String,
      description: String,
      externalURL: String
  ) {
      self.name = name
      self.description = description
      self.externalURL = externalURL
  }
}

pub fun main(address: Address, id: UInt64): {String: String}? {
    let collection = getAccount(address)
        .getCapability(SampleNFT.collectionPublicPath)
        .borrow<&{SampleNFT.CollectionPublic,MetadataViews.ResolverCollection}>()
        ?? panic("NFT Collection not found")

    // let nft = collection.borrowViewResolver(id: id)
    // let display = MetadataViews.getDisplay(nft)
    // return NFTView(
    //     name: display!.name,
    //     description: display!.description,
    //     externalURL: display!.thumbnail.uri()
    // )

    let nft = collection.borrow(id: id)
    return nft?.getMetadata()
}
