const fcl = require("@onflow/fcl");

fcl.config({
  "flow.network": "emulator",
  "accessNode.api": "http://localhost:8888"
})

const address = "0xf8d6e0586b0a20c7";

const main = async () => {

  const result = await fcl.query({
    cadence: `
    import NonFungibleToken from ${address}
    import MetadataViews from ${address}
    import SampleNFT from ${address}
    
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
            .getCapability(SampleNFT.collectionPublicPath)
            .borrow<&{SampleNFT.CollectionPublic,MetadataViews.ResolverCollection}>()
            ?? panic("NFT Collection not found")
    
        let nft = collection.borrowViewResolver(id: UInt64.fromString(id)!)
        let display = MetadataViews.getDisplay(nft)
        return NFTView(
            name: display!.name,
            description: display!.description,
            thumbnail: display!.thumbnail.uri()
        )
    
        // let nft = collection.borrow(id: id)
        // return nft?.getMetadata()
    }
    `,
    args: (arg, t) => [
      arg(address, t.Address),
      arg("0", t.String),
    ],
  });
  console.log(result);
};

main().catch((e) => {
  console.error(e);
});