import NonFungibleToken from "./core/NonFungibleToken.cdc"
import MetadataViews from "./core/MetadataViews.cdc"

pub contract JournalStampRally: NonFungibleToken {

    pub var totalSupply: UInt64

    /***********************************************/
    /******************** PATHS ********************/
    /***********************************************/
    pub var collectionPublicPath: PublicPath
    pub var collectionStoragePath: StoragePath
    // pub var minterPublicPath: PublicPath
    pub var minterStoragePath: StoragePath

    /************************************************/
    /******************** EVENTS ********************/
    /************************************************/
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub event Mint(id: UInt64, creator: Address, metadata: {String:String}, totalSupply: UInt64)
    pub event Destroy(id: UInt64)

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let creator: Address
        access(self) let metadata: {String:String}

        init(id: UInt64, creator: Address, metadata: {String:String}) {
            self.id = id
            self.creator = creator
            self.metadata = metadata
        }

        pub fun getViews(): [Type] {
            return [Type<MetadataViews.Display>()]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
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

        pub fun getMetadata(): {String:String} {
            return self.metadata
        }

        destroy() {
            emit Destroy(id: self.id)
        }
    }

    pub resource interface CollectionPublic {
        pub fun borrow(id: UInt64): &NFT?
    }

    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection, CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @JournalStampRally.NFT
            let id: UInt64 = token.id
            let dummy <- self.ownedNFTs[id] <- token
            destroy dummy
            // emit Deposit(id: id, to: self.owner?.address)
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowViewResolver(id: UInt64): &{MetadataViews.Resolver} {
            let authRef = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let ref = authRef as! &NFT
            return ref as! &{MetadataViews.Resolver}
        }

        pub fun borrow(id: UInt64): &NFT? {
            let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return ref as! &NFT
        }

        pub fun getMetadata(id: UInt64): {String:String} {
            let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return (ref as! &JournalStampRally.NFT).getMetadata()
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource Minter {
        pub fun mintTo(creator: Capability<&{NonFungibleToken.Receiver}>, metadata: {String:String}): &NonFungibleToken.NFT {
            let id = JournalStampRally.totalSupply.toString()
            let meta = {
                "name": metadata["name"] ?? "",
                "description": metadata["description"] ?? "",
                "metaURI": "https://nft.tobiratory.com/journalstamprally/metadata/".concat(id)
            };
            let token <- create NFT(
                id: JournalStampRally.totalSupply,
                creator: creator.address,
                metadata: meta
            )
            JournalStampRally.totalSupply = JournalStampRally.totalSupply + 1
            let tokenRef = &token as &NonFungibleToken.NFT
            emit Mint(id: token.id, creator: creator.address, metadata: meta, totalSupply: JournalStampRally.totalSupply)
            creator.borrow()!.deposit(token: <- token)
            return tokenRef
        }
    }

    // pub fun minter(): Capability<&Minter> {
    //     return self.account.getCapability<&Minter>(self.minterPublicPath)
    // }

    init() {
        self.totalSupply = 0
        self.collectionPublicPath = /public/JournalStampRally
        self.collectionStoragePath = /storage/JournalStampRally
        // self.minterPublicPath = /public/JournalStampRallyMinter
        self.minterStoragePath = /storage/JournalStampRallyMinter

        if self.account.borrow<&Minter>(from: self.minterStoragePath) == nil {
            let minter <- create Minter()
            self.account.save(<- minter, to: self.minterStoragePath)
        }

        if self.account.borrow<&JournalStampRally.Collection>(from: JournalStampRally.collectionStoragePath) == nil {
            let collection <- self.createEmptyCollection()
            self.account.save(<- collection, to: self.collectionStoragePath)
            self.account.link<&{NonFungibleToken.CollectionPublic,JournalStampRally.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(self.collectionPublicPath, target: self.collectionStoragePath)
        }
        emit ContractInitialized()
    }
}