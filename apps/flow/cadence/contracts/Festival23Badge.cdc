import NonFungibleToken from "./core/NonFungibleToken.cdc"
import MetadataViews from "./core/MetadataViews.cdc"
import ViewResolver from "./core/ViewResolver.cdc"

access(all) contract Festival23Badge: NonFungibleToken {

    access(all) var totalSupply: UInt64

    /***********************************************/
    /******************** PATHS ********************/
    /***********************************************/
    access(all) var collectionPublicPath: PublicPath
    access(all) var collectionStoragePath: StoragePath
    // access(all) var minterPublicPath: PublicPath
    access(all) var minterStoragePath: StoragePath

    /************************************************/
    /******************** EVENTS ********************/
    /************************************************/
    access(all) event Mint(id: UInt64, creator: Address, metadata: {String:String}, totalSupply: UInt64)

    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(self) let metadata: {String:String}

        init(id: UInt64, creator: Address, metadata: {String:String}) {
            self.id = id
            self.creator = creator
            self.metadata = metadata
        }

        access(all) view fun getViews(): [Type] {
            return [Type<MetadataViews.Display>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata["name"] ?? "",
                        description: self.metadata["description"] ?? "",
                        thumbnail: MetadataViews.HTTPFile(url: self.metadata["metaURI"] ?? ""),
                    )
            }
            return nil
        }

        access(all) fun getMetadata(): {String:String} {
            return self.metadata
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- Festival23Badge.createEmptyCollection(nftType: Type<@Festival23Badge.NFT>())
        }
    }

    access(all) resource interface CollectionPublic {
        access(all) view fun borrow(id: UInt64): &NFT?
    }

    access(all) resource Collection: NonFungibleToken.Collection, CollectionPublic {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init() {
            self.ownedNFTs <- {}
        }

        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[Type<@Festival23Badge.NFT>()] = true
            return supportedTypes
        }

        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@Festival23Badge.NFT>()
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Missing NFT")
            return <- token
        }

        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let token <- token as! @Festival23Badge.NFT
            let id: UInt64 = token.id
            let dummy <- self.ownedNFTs[id] <- token
            destroy dummy
        }

        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) view fun getLength(): Int {
            return self.ownedNFTs.length
        }

        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id] as &{NonFungibleToken.NFT}?
        }

        access(all) view fun borrowViewResolver(id: UInt64): &{ViewResolver.Resolver}? {
            if let nft = &self.ownedNFTs[id] as &{NonFungibleToken.NFT}? {
                return nft as &{ViewResolver.Resolver}
            }
            return nil
        }

        access(all) view fun borrow(id: UInt64): &NFT? {
            let ref = (&self.ownedNFTs[id] as &{NonFungibleToken.NFT}?)!
            return ref as! &NFT
        }

        access(all) fun getMetadata(id: UInt64): {String:String} {
            let ref = (&self.ownedNFTs[id] as &{NonFungibleToken.NFT}?)!
            return (ref as! &Festival23Badge.NFT).getMetadata()
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- Festival23Badge.createEmptyCollection(nftType: Type<@Festival23Badge.NFT>())
        }
    }

    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>()
        ]
    }

    access(all) view fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<MetadataViews.NFTCollectionData>():
                let collectionData = MetadataViews.NFTCollectionData(
                    storagePath: self.collectionStoragePath,
                    publicPath: self.collectionPublicPath,
                    publicCollection: Type<&Festival23Badge.Collection>(),
                    publicLinkedType: Type<&Festival23Badge.Collection>(),
                    createEmptyCollectionFunction: (fun(): @{NonFungibleToken.Collection} {
                        return <- Festival23Badge.createEmptyCollection(nftType: Type<@Festival23Badge.NFT>())
                    })
                )
                return collectionData
        }
        return nil
    }

    access(all) resource Minter {
        access(all) fun mintTo(creator: Capability<&{NonFungibleToken.Receiver}>, metadata: {String:String}): UInt64 {
            let id = Festival23Badge.totalSupply
            let meta = {
                "name": metadata["name"] ?? "",
                "description": metadata["description"] ?? "",
                "metaURI": "https://nft.tobiratory.com/festival23badge/metadata/".concat(id.toString())
            };
            let token <- create NFT(
                id: id,
                creator: creator.address,
                metadata: meta
            )
            Festival23Badge.totalSupply = Festival23Badge.totalSupply + 1
            emit Mint(id: token.id, creator: creator.address, metadata: meta, totalSupply: Festival23Badge.totalSupply)
            creator.borrow()!.deposit(token: <- token)
            return id
        }
    }

    // access(all) fun minter(): Capability<&Minter> {
    //     return self.account.getCapability<&Minter>(self.minterPublicPath)
    // }

    init() {
        self.totalSupply = 0
        self.collectionPublicPath = /public/Festival23Badge
        self.collectionStoragePath = /storage/Festival23Badge
        // self.minterPublicPath = /public/Festival23BadgeMinter
        self.minterStoragePath = /storage/Festival23BadgeMinter

        if self.account.storage.borrow<&Minter>(from: self.minterStoragePath) == nil {
            self.account.storage.save(<- create Minter(), to: self.minterStoragePath)
        }

        if self.account.storage.borrow<&Festival23Badge.Collection>(from: Festival23Badge.collectionStoragePath) == nil {
            self.account.storage.save(<- create Collection(), to: self.collectionStoragePath)
            let cap: Capability = self.account.capabilities.storage.issue<&Festival23Badge.Collection>(self.collectionStoragePath)
            self.account.capabilities.publish(cap, at: self.collectionPublicPath)
        }
    }
}