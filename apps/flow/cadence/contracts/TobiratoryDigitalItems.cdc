import NonFungibleToken from "./core/NonFungibleToken.cdc"
import MetadataViews from "./core/MetadataViews.cdc"
import ViewResolver from "./core/ViewResolver.cdc"
import Crypto

pub contract TobiratoryDigitalItems: NonFungibleToken, ViewResolver {

    pub var totalSupply: UInt64
    pub var itemTotalSupply: UInt64
    pub var itemReviewEnabled: Bool

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Attach(id: UInt64, parentID: UInt64)
    pub event Detach(id: UInt64, parentID: UInt64)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let ItemsStoragePath: StoragePath
    pub let ItemsPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let itemID: UInt64
        pub let itemsCapability: Capability<&Items{ItemsPublic}>
        pub let purchasePrice: UFix64
        pub let purchasePriceCurrency: String
        pub let regularPrice: UFix64
        pub let regularPriceCurrency: String
        access(contract) var extraMetadata: {String: AnyStruct}
        access(contract) var ownerHistory: {UFix64: Address}
        access(contract) var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init(
            itemID: UInt64,
            itemsCapability: Capability<&Items{ItemsPublic}>,
            purchasePrice: UFix64,
            purchasePriceCurrency: String,
            regularPrice: UFix64,
            regularPriceCurrency: String,
            extraMetadata: {String: AnyStruct},
        ) {
            pre {
                itemsCapability.check(): "Invalid itemsCapability"
                itemsCapability.borrow()!.borrwoItem(itemID: itemID) != nil: "Invalid itemsCapability"
            }
            TobiratoryDigitalItems.totalSupply = TobiratoryDigitalItems.totalSupply + 1
            self.id = TobiratoryDigitalItems.totalSupply
            self.itemID = itemID
            self.itemsCapability = itemsCapability
            self.purchasePrice = purchasePrice
            self.purchasePriceCurrency = purchasePriceCurrency
            self.regularPrice = regularPrice
            self.regularPriceCurrency = regularPriceCurrency
            self.extraMetadata = extraMetadata
            self.ownerHistory = {}
            self.ownedNFTs <- {}
        }

        pub fun getExtraMetadata(): {String: AnyStruct} {
            return self.extraMetadata
        }

        pub fun getOwnerHistory(): {UFix64: Address} {
            return self.ownerHistory
        }

        access(contract) fun recordOwnerHistory() {
            let owner = self.owner?.address
            if owner != nil {
                let now = getCurrentBlock().timestamp
                self.ownerHistory[now] = owner
                for id in self.ownedNFTs.keys {
                    let nftRef = self.borrowTobiratoryNFT(id: id)!
                    nftRef.recordOwnerHistory()
                }
            }
        }

        pub fun getOwnedNFTsIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowTobiratoryNFT(id: UInt64): &TobiratoryDigitalItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &TobiratoryDigitalItems.NFT
            }
            return nil
        }

        access(contract) fun attachNFT(nft: @NonFungibleToken.NFT) {
            let nft <- nft as! @TobiratoryDigitalItems.NFT
            let id: UInt64 = nft.id
            self.ownedNFTs[id] <-! nft
            emit Attach(id: id, parentID: self.id)
        }

        access(contract) fun detachNFT(id: UInt64): @NonFungibleToken.NFT {
            let nft <- self.ownedNFTs.remove(key: id) ?? panic("missing NFT")
            emit Detach(id: nft.id, parentID: self.id)
            return <- nft
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.Traits>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            // TODO: impl
            //
            // switch view {
            //     case Type<MetadataViews.Display>():
            //         return MetadataViews.Display(
            //             name: "",
            //             description: "",
            //             thumbnail: MetadataViews.HTTPFile(
            //                 url: ""
            //             )
            //         )
            //     case Type<MetadataViews.Editions>():
            //         let editionInfo = MetadataViews.Edition(name: "Example NFT Edition", number: self.id, max: nil)
            //         let editionList: [MetadataViews.Edition] = [editionInfo]
            //         return MetadataViews.Editions(
            //             editionList
            //         )
            //     case Type<MetadataViews.Serial>():
            //         return MetadataViews.Serial(
            //             self.id
            //         )
            //     case Type<MetadataViews.Royalties>():
            //         return MetadataViews.Royalties(
            //             self.royalties
            //         )
            //     case Type<MetadataViews.ExternalURL>():
            //         return MetadataViews.ExternalURL("https://example-nft.onflow.org/".concat(self.id.toString()))
            //     case Type<MetadataViews.NFTCollectionData>():
            //         return MetadataViews.NFTCollectionData(
            //             storagePath: TobiratoryDigitalItems.CollectionStoragePath,
            //             publicPath: TobiratoryDigitalItems.CollectionPublicPath,
            //             providerPath: /private/TobiratoryDigitalItemsCollection,
            //             publicCollection: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic}>(),
            //             publicLinkedType: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
            //             providerLinkedType: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
            //             createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
            //                 return <-TobiratoryDigitalItems.createEmptyCollection()
            //             })
            //         )
            //     case Type<MetadataViews.NFTCollectionDisplay>():
            //         let media = MetadataViews.Media(
            //             file: MetadataViews.HTTPFile(
            //                 url: "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"
            //             ),
            //             mediaType: "image/svg+xml"
            //         )
            //         return MetadataViews.NFTCollectionDisplay(
            //             name: "The Example Collection",
            //             description: "This collection is used as an example to help you develop your next Flow NFT.",
            //             externalURL: MetadataViews.ExternalURL("https://example-nft.onflow.org"),
            //             squareImage: media,
            //             bannerImage: media,
            //             socials: {
            //                 "twitter": MetadataViews.ExternalURL("https://twitter.com/flow_blockchain")
            //             }
            //         )
            //     case Type<MetadataViews.Traits>():
            //         return nil
            // }
            return nil
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowTobiratoryNFT(id: UInt64): &TobiratoryDigitalItems.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow TobiratoryDigitalItems reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @TobiratoryDigitalItems.NFT
            token.recordOwnerHistory()
            let id: UInt64 = token.id
            self.ownedNFTs[id] <-! token
            emit Deposit(id: id, to: self.owner?.address)
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowTobiratoryNFT(id: UInt64): &TobiratoryDigitalItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &TobiratoryDigitalItems.NFT
            }
            return nil
        }

        pub fun attachNFT(id: UInt64, nft: @NonFungibleToken.NFT) {
            let nftRef = self.borrowTobiratoryNFT(id: id)!
            nftRef.attachNFT(nft: <- nft)
        }

        pub fun detachNFT(id: UInt64, parentID: UInt64): @NonFungibleToken.NFT {
            let nftRef = self.borrowTobiratoryNFT(id: parentID)!
            return <- nftRef.detachNFT(id: id)
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return (nft as! &TobiratoryDigitalItems.NFT) as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource Item {
        pub let id: UInt64
        pub let type: String
        pub var name: String
        pub var description: String
        pub var imageUrls: [String]
        pub var creator: String
        pub let createdAt: UFix64
        pub var limit: UInt32?
        pub var licence: String
        pub var royalties: [MetadataViews.Royalty]
        pub var extraMetadata: {String: AnyStruct}
        pub var mintedCount: UInt32

        init (
            id: UInt64,
            type: String,
            name: String,
            description: String,
            imageUrls: [String],
            creator: String,
            limit: UInt32?,
            licence: String,
            royalties: [MetadataViews.Royalty],
            extraMetadata: {String: AnyStruct},
        ) {
            self.id = id
            self.type = type
            self.name = name
            self.description = description
            self.imageUrls = imageUrls
            self.creator = creator
            self.createdAt = getCurrentBlock().timestamp
            self.limit = limit
            self.licence = licence
            self.royalties = royalties
            self.extraMetadata = extraMetadata
            self.mintedCount = 0
        }

        access(contract) fun updateName(name: String) {
            self.name = name
        }

        access(contract) fun updateDescription(description: String) {
            self.description = description
        }

        access(contract) fun updateImageUrls(imageUrls: [String]) {
            self.imageUrls = imageUrls
        }

        access(contract) fun updateCreator(creator: String) {
            self.creator = creator
        }

        access(contract) fun updateLimit(limit: UInt32?) {
            self.limit = limit
        }

        access(contract) fun updateRoyalties(royalties: [MetadataViews.Royalty]) {
            self.royalties = royalties
        }

        access(contract) fun updateExtraMetadata(extraMetadata: {String: AnyStruct}) {
            self.extraMetadata = extraMetadata
        }

        access(contract) fun incrementMintedCount() {
            self.mintedCount = self.mintedCount + 1
        }
    }

    pub resource interface ItemsPublic {
        pub fun getItemIDs(): [UInt64]

        pub fun borrwoItem(itemID: UInt64): &Item?

        pub fun mint(
            itemID: UInt64,
            purchasePrice: UFix64,
            purchasePriceCurrency: String,
            regularPrice: UFix64,
            regularPriceCurrency: String,
            extraMetadata: {String: AnyStruct},
            minter: &Minter,
        ): @NFT
    }

    pub resource Items: ItemsPublic {
        pub var items: @{UInt64: Item}

        init () {
            self.items <- {}
        }

        pub fun createItem(
            type: String,
            name: String,
            description: String,
            imageUrls: [String],
            creator: String,
            limit: UInt32?,
            licence: String,
            royalties: [MetadataViews.Royalty],
            extraMetadata: {String: AnyStruct},
            itemReviewer: &ItemReviewer?,
        ): UInt64 {
            pre {
                !TobiratoryDigitalItems.itemReviewEnabled || itemReviewer!.ownerAddress == itemReviewer!.owner!.address: "Invalid itemReviewer"
            }
            TobiratoryDigitalItems.itemTotalSupply = TobiratoryDigitalItems.itemTotalSupply + 1
            let id = TobiratoryDigitalItems.itemTotalSupply
            let item <- create Item(
                id: id,
                type: type,
                name: name,
                description: description,
                imageUrls: imageUrls,
                creator: creator,
                limit: limit,
                licence: licence,
                royalties: royalties,
                extraMetadata: extraMetadata,
            )
            self.items[id] <-! item
            return id
        }

        pub fun mint(
            itemID: UInt64,
            purchasePrice: UFix64,
            purchasePriceCurrency: String,
            regularPrice: UFix64,
            regularPriceCurrency: String,
            extraMetadata: {String: AnyStruct},
            minter: &Minter,
        ): @NFT {
            pre {
                minter.ownerAddress == minter.owner!.address: "Invalid minter"
            }
            let itemRef: &TobiratoryDigitalItems.Item = self.borrwoItem(itemID: itemID) ?? panic("Missing Item")
            assert(itemRef.limit == nil || itemRef.mintedCount < itemRef.limit!, message: "Limit over")
            itemRef.incrementMintedCount()
            return <- create NFT(
                itemID: itemID,
                itemsCapability: self.owner!.getCapability<&Items{ItemsPublic}>(TobiratoryDigitalItems.ItemsPublicPath),
                purchasePrice: purchasePrice,
                purchasePriceCurrency: purchasePriceCurrency,
                regularPrice: regularPrice,
                regularPriceCurrency: regularPriceCurrency,
                extraMetadata: extraMetadata,
            )
        }

        pub fun getItemIDs(): [UInt64] {
            return self.items.keys
        }

        pub fun borrwoItem(itemID: UInt64): &Item? {
            return &self.items[itemID] as &Item?
        }

        pub fun updateItemName(itemID: UInt64, name: String) {
            let itemRef = self.borrwoItem(itemID: itemID)!
            itemRef.updateName(name: name)
        }

        pub fun updateItemDescription(itemID: UInt64, description: String) {
            let itemRef = self.borrwoItem(itemID: itemID)!
            itemRef.updateDescription(description: description)
        }

        pub fun updateItemImageUrls(itemID: UInt64, imageUrls: [String]) {
            let itemRef = self.borrwoItem(itemID: itemID)!
            itemRef.updateImageUrls(imageUrls: imageUrls)
        }

        pub fun updateItemCreator(itemID: UInt64, creator: String) {
            let itemRef = self.borrwoItem(itemID: itemID)!
            itemRef.updateCreator(creator: creator)
        }

        pub fun updateItemRoyalties(itemID: UInt64, royalties: [MetadataViews.Royalty]) {
            let itemRef = self.borrwoItem(itemID: itemID)!
            itemRef.updateRoyalties(royalties: royalties)
        }

        pub fun updateItemExtraMetadata(itemID: UInt64, extraMetadata: {String: AnyStruct}) {
            let itemRef = self.borrwoItem(itemID: itemID)!
            itemRef.updateExtraMetadata(extraMetadata: extraMetadata)
        }

        pub fun destroyItem(itemID: UInt64) {
            let item <- self.items.remove(key: itemID) ?? panic("Missing Item")
            destroy item
        }

        destroy() {
            destroy self.items
        }
    }

    pub fun createItems(): @TobiratoryDigitalItems.Items {
        return <- create Items()
    }

    pub resource Admin {
        pub fun setItemReviewEnabled(itemReviewEnabled: Bool) {
            TobiratoryDigitalItems.itemReviewEnabled = itemReviewEnabled
        }

        pub fun createItemReviewer(ownerAddress: Address): @ItemReviewer {
            return <- create ItemReviewer(ownerAddress: ownerAddress)
        }

        pub fun createMinter(ownerAddress: Address): @Minter {
            return <- create Minter(ownerAddress: ownerAddress)
        }
    }

    pub resource ItemReviewer {
        pub let ownerAddress: Address

        init(ownerAddress: Address) {
            self.ownerAddress = ownerAddress
        }
    }

    pub resource Minter {
        pub let ownerAddress: Address

        init(ownerAddress: Address) {
            self.ownerAddress = ownerAddress
        }
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
        // TODO: impl
        //
        // switch view {
        //     case Type<MetadataViews.NFTCollectionData>():
        //         return MetadataViews.NFTCollectionData(
        //             storagePath: TobiratoryDigitalItems.CollectionStoragePath,
        //             publicPath: TobiratoryDigitalItems.CollectionPublicPath,
        //             providerPath: /private/TobiratoryDigitalItemsCollection,
        //             publicCollection: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic}>(),
        //             publicLinkedType: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
        //             providerLinkedType: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
        //             createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
        //                 return <-TobiratoryDigitalItems.createEmptyCollection()
        //             })
        //         )
        //     case Type<MetadataViews.NFTCollectionDisplay>():
        //         let media = MetadataViews.Media(
        //             file: MetadataViews.HTTPFile(
        //                 url: "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"
        //             ),
        //             mediaType: "image/svg+xml"
        //         )
        //         return MetadataViews.NFTCollectionDisplay(
        //             name: "The Example Collection",
        //             description: "This collection is used as an example to help you develop your next Flow NFT.",
        //             externalURL: MetadataViews.ExternalURL("https://example-nft.onflow.org"),
        //             squareImage: media,
        //             bannerImage: media,
        //             socials: {
        //                 "twitter": MetadataViews.ExternalURL("https://twitter.com/flow_blockchain")
        //             }
        //         )
        // }
        return nil
    }

    pub fun getViews(): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
    }

    init() {
        self.totalSupply = 0
        self.itemTotalSupply = 0
        self.itemReviewEnabled = true

        self.CollectionStoragePath = /storage/TobiratoryDigitalItemsCollection
        self.CollectionPublicPath = /public/TobiratoryDigitalItemsCollection
        self.ItemsStoragePath = /storage/TobiratoryDigitalItemsItems
        self.ItemsPublicPath = /public/TobiratoryDigitalItemsItems
        self.AdminStoragePath = /storage/TobiratoryDigitalItemsAdmin

        self.account.save(<- create Collection(), to: self.CollectionStoragePath)
        self.account.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        self.account.save(<- create Items(), to: self.ItemsStoragePath)
        self.account.link<&TobiratoryDigitalItems.Items{TobiratoryDigitalItems.ItemsPublic}>(
            self.ItemsPublicPath,
            target: self.ItemsStoragePath
        )

        self.account.save(<- create Admin(), to: self.AdminStoragePath)

        emit ContractInitialized()
    }
}
