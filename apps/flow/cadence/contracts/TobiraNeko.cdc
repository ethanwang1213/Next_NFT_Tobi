import NonFungibleToken from "./core/NonFungibleToken.cdc"
import MetadataViews from "./core/MetadataViews.cdc"
import ViewResolver from "./core/ViewResolver.cdc"

access(all) contract TobiraNeko: NonFungibleToken {

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
    access(all) event Mint(id: UInt64, creator: Address, metadata: {String:String})

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
                        thumbnail: MetadataViews.HTTPFile(url: self.metadata["thumbnail"] ?? ""),
                    )
            }
            return nil
        }

        access(all) fun getMetadata(): {String:String} {
            return self.metadata
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- TobiraNeko.createEmptyCollection(nftType: Type<@TobiraNeko.NFT>())
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
            supportedTypes[Type<@TobiraNeko.NFT>()] = true
            return supportedTypes
        }

        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@TobiraNeko.NFT>()
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Missing NFT")
            return <- token
        }

        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let token <- token as! @TobiraNeko.NFT
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
            return (ref as! &TobiraNeko.NFT).getMetadata()
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- TobiraNeko.createEmptyCollection(nftType: Type<@TobiraNeko.NFT>())
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
                    publicCollection: Type<&TobiraNeko.Collection>(),
                    publicLinkedType: Type<&TobiraNeko.Collection>(),
                    createEmptyCollectionFunction: (fun(): @{NonFungibleToken.Collection} {
                        return <- TobiraNeko.createEmptyCollection(nftType: Type<@TobiraNeko.NFT>())
                    })
                )
                return collectionData
        }
        return nil
    }

    access(all) resource Minter {
        access(all) fun mintTo(creator: Capability<&{NonFungibleToken.Receiver}>, metadata: {String:String}): UInt64 {
            let id = TobiraNeko.totalSupply
            let token <- create NFT(
                id: id,
                creator: creator.address,
                metadata: metadata
            )
            TobiraNeko.totalSupply = TobiraNeko.totalSupply + 1
            // emit Mint(id: token.id, creator: creator.address, metadata: metadata)
            creator.borrow()!.deposit(token: <- token)
            return id
        }

        access(all) fun batchMintTo(creator: Capability<&{NonFungibleToken.Receiver}>, quantity: UInt64): UInt64 {
            var i: UInt64 = 0
            while i < quantity {
                let id = TobiraNeko.totalSupply.toString()
                let idLength = id.length
                let formattedId = "00000".concat(id).slice(from: idLength, upTo: idLength + 5)
                self.mintTo(creator: creator, metadata: {
                    "name": "TOBIRA NEKO #".concat(formattedId),
                    "description": "",
                    "thumbnail": "https://storage.googleapis.com/tobiratory-media/nft/tobiraneko/".concat(id).concat(".png"),
                    "metaURI": "https://nft.tobiratory.com/metadata/".concat(id)
                })
                i = i + UInt64(1)
            }
            return quantity
        }
    }

    // access(all) fun minter(): Capability<&Minter> {
    //     return self.account.getCapability<&Minter>(self.minterPublicPath)
    // }

    init() {
        self.totalSupply = 0
        self.collectionPublicPath = /public/TobiraNekoCollection001
        self.collectionStoragePath = /storage/TobiraNekoCollection001
        // self.minterPublicPath = /public/TobiraNekoMinter001
        self.minterStoragePath = /storage/TobiraNekoMinter001

        if self.account.storage.borrow<&Minter>(from: self.minterStoragePath) == nil {
            self.account.storage.save(<- create Minter(), to: self.minterStoragePath)
        }

        if self.account.storage.borrow<&TobiraNeko.Collection>(from: TobiraNeko.collectionStoragePath) == nil {
            self.account.storage.save(<- create Collection(), to: self.collectionStoragePath)
            let cap: Capability = self.account.capabilities.storage.issue<&TobiraNeko.Collection>(self.collectionStoragePath)
            self.account.capabilities.publish(cap, at: self.collectionPublicPath)
        }
    }
}