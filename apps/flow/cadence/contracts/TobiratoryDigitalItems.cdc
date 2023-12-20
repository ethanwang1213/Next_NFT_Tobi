import NonFungibleToken from "./core/NonFungibleToken.cdc"
import MetadataViews from "./core/MetadataViews.cdc"
import ViewResolver from "./core/ViewResolver.cdc"

pub contract TobiratoryDigitalItems: NonFungibleToken, ViewResolver {

    pub var totalSupply: UInt64
    pub var itemTotalSupply: UInt64
    pub var itemReviewEnabled: Bool
    pub var baseExternalURL: String

    pub event ContractInitialized()
    pub event ItemCreated(id: UInt64, type: String, creatorAddress: Address)
    pub event ItemDestroyed(id: UInt64)
    pub event Mint(id: UInt64, itemID: UInt64, serialNumber: UInt32)
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Attach(id: UInt64, parentID: UInt64)
    pub event Detach(id: UInt64, parentID: UInt64)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let ItemsStoragePath: StoragePath
    pub let ItemsPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath
    pub let ItemReviewerStoragePath: StoragePath
    pub let MinterStoragePath: StoragePath

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let itemID: UInt64
        pub let itemsCapability: Capability<&{ItemsPublic}>
        pub let serialNumber: UInt32
        pub let purchasePrice: UFix64
        pub let purchasePriceCurrency: String
        pub let regularPrice: UFix64
        pub let regularPriceCurrency: String
        access(contract) var extraMetadata: {String: AnyStruct}
        access(contract) var ownerHistory: {UFix64: Address}
        access(contract) var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init(
            itemID: UInt64,
            itemsCapability: Capability<&{ItemsPublic}>,
            serialNumber: UInt32,
            purchasePrice: UFix64,
            purchasePriceCurrency: String,
            regularPrice: UFix64,
            regularPriceCurrency: String,
            extraMetadata: {String: AnyStruct},
        ) {
            pre {
                itemsCapability.check(): "Invalid itemsCapability"
                itemsCapability.borrow()!.borrowItem(itemID: itemID) != nil: "Invalid itemsCapability"
            }
            TobiratoryDigitalItems.totalSupply = TobiratoryDigitalItems.totalSupply + 1
            let id = TobiratoryDigitalItems.totalSupply
            self.id = id
            self.itemID = itemID
            self.itemsCapability = itemsCapability
            self.serialNumber = serialNumber
            self.purchasePrice = purchasePrice
            self.purchasePriceCurrency = purchasePriceCurrency
            self.regularPrice = regularPrice
            self.regularPriceCurrency = regularPriceCurrency
            self.extraMetadata = extraMetadata
            self.ownerHistory = {}
            self.ownedNFTs <- {}
            emit Mint(id: id, itemID: itemID, serialNumber: serialNumber)
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
            let itemRef = self.itemsCapability.borrow()!.borrowItem(itemID: self.itemID)!
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: itemRef.name,
                        description: itemRef.description,
                        thumbnail: MetadataViews.HTTPFile(
                            url: itemRef.imageUrls.length > 0 ? itemRef.imageUrls[0] : ""
                        )
                    )
                case Type<MetadataViews.Editions>():
                    let editionInfo = MetadataViews.Edition(name: itemRef.name, number: UInt64(self.serialNumber), max: UInt64(itemRef.limit ?? 0))
                    let editionList: [MetadataViews.Edition] = [editionInfo]
                    return MetadataViews.Editions(
                        editionList
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(
                        self.id
                    )
                case Type<MetadataViews.Royalties>():
                    return MetadataViews.Royalties(
                        itemRef.royalties
                    )
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://www.tobiratory.com/?item=".concat(self.id.toString()))
                case Type<MetadataViews.NFTCollectionData>():
                    return TobiratoryDigitalItems.resolveView(view)
                case Type<MetadataViews.NFTCollectionDisplay>():
                    return TobiratoryDigitalItems.resolveView(view)
                case Type<MetadataViews.Traits>():
                    let traits = MetadataViews.Traits([
                        MetadataViews.Trait(name: "name", value: itemRef.name, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "description", value: itemRef.description, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "thumbnail", value: itemRef.imageUrls.length > 0 ? itemRef.imageUrls[0] : "", displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "serialNumber", value: self.serialNumber, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "creatorName", value: itemRef.creatorName, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "creatorAddress", value: itemRef.creatorAddress.toString(), displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "limit", value: itemRef.limit ?? 0, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "license", value: itemRef.license, displayType: nil, rarity: nil)
                    ])
                    return traits
            }
            return nil
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub resource Item {
        pub let id: UInt64
        pub let type: String
        pub var name: String
        pub var description: String
        pub var imageUrls: [String]
        pub var creatorName: String
        pub let creatorAddress: Address
        pub let createdAt: UFix64
        pub var limit: UInt32?
        pub var license: String
        pub var royalties: [MetadataViews.Royalty]
        pub var extraMetadata: {String: AnyStruct}
        pub var mintedCount: UInt32

        init (
            type: String,
            name: String,
            description: String,
            imageUrls: [String],
            creatorName: String,
            creatorAddress: Address,
            limit: UInt32?,
            license: String,
            royalties: [MetadataViews.Royalty],
            extraMetadata: {String: AnyStruct},
        ) {
            TobiratoryDigitalItems.itemTotalSupply = TobiratoryDigitalItems.itemTotalSupply + 1
            let id: UInt64 = TobiratoryDigitalItems.itemTotalSupply
            self.id = id
            self.type = type
            self.name = name
            self.description = description
            self.imageUrls = imageUrls
            self.creatorName = creatorName
            self.creatorAddress = creatorAddress
            self.createdAt = getCurrentBlock().timestamp
            self.limit = limit
            self.license = license
            self.royalties = royalties
            self.extraMetadata = extraMetadata
            self.mintedCount = 0
            emit ItemCreated(id: id, type: type, creatorAddress: creatorAddress)
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

        access(contract) fun updateCreatorName(creatorName: String) {
            self.creatorName = creatorName
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

        pub fun borrowItem(itemID: UInt64): &Item?
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
            creatorName: String,
            limit: UInt32?,
            license: String,
            royalties: [MetadataViews.Royalty],
            extraMetadata: {String: AnyStruct},
            itemReviewer: &ItemReviewer?,
        ): UInt64 {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let item <- create Item(
                type: type,
                name: name,
                description: description,
                imageUrls: imageUrls,
                creatorName: creatorName,
                creatorAddress: self.owner!.address,
                limit: limit,
                license: license,
                royalties: royalties,
                extraMetadata: extraMetadata,
            )
            let id = item.id
            self.items[id] <-! item
            return id
        }

        pub fun getItemIDs(): [UInt64] {
            return self.items.keys
        }

        pub fun borrowItem(itemID: UInt64): &Item? {
            return &self.items[itemID] as &Item?
        }

        pub fun updateItemName(itemID: UInt64, name: String, itemReviewer: &ItemReviewer?) {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateName(name: name)
        }

        pub fun updateItemDescription(itemID: UInt64, description: String, itemReviewer: &ItemReviewer?) {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateDescription(description: description)
        }

        pub fun updateItemImageUrls(itemID: UInt64, imageUrls: [String], itemReviewer: &ItemReviewer?) {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateImageUrls(imageUrls: imageUrls)
        }

        pub fun updateItemCreatorName(itemID: UInt64, creatorName: String, itemReviewer: &ItemReviewer?) {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateCreatorName(creatorName: creatorName)
        }

        pub fun updateItemRoyalties(itemID: UInt64, royalties: [MetadataViews.Royalty], itemReviewer: &ItemReviewer?) {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateRoyalties(royalties: royalties)
        }

        pub fun updateItemLimit(itemID: UInt64, limit: UInt32, itemReviewer: &ItemReviewer?) {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateLimit(limit: limit)
        }

        pub fun updateItemExtraMetadata(itemID: UInt64, extraMetadata: {String: AnyStruct}, itemReviewer: &ItemReviewer?) {
            pre {
                self.validateItemReviewer(itemReviewer): "Invalid itemReviewer"
            }
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateExtraMetadata(extraMetadata: extraMetadata)
        }

        pub fun destroyItem(itemID: UInt64) {
            let item <- self.items.remove(key: itemID) ?? panic("Missing Item")
            destroy item
            emit ItemDestroyed(id: itemID)
        }

        priv fun validateItemReviewer(_ itemReviewer: &ItemReviewer?,): Bool {
            if !TobiratoryDigitalItems.itemReviewEnabled {
                return true
            }
            return itemReviewer!.ownerAddress == itemReviewer!.owner!.address
        }

        destroy() {
            destroy self.items
        }
    }

    pub fun createItems(): @TobiratoryDigitalItems.Items {
        return <- create Items()
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

        pub fun attachNFT(parentID: UInt64, nft: @NonFungibleToken.NFT) {
            let nftRef = self.borrowTobiratoryNFT(id: parentID)!
            nftRef.attachNFT(nft: <- nft)
        }

        pub fun detachNFT(parentID: UInt64, id: UInt64): @NonFungibleToken.NFT {
            let nftRef = self.borrowTobiratoryNFT(id: parentID)!
            return <- nftRef.detachNFT(id: id)
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return nft as! &TobiratoryDigitalItems.NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource Admin {
        pub fun setItemReviewEnabled(itemReviewEnabled: Bool) {
            TobiratoryDigitalItems.itemReviewEnabled = itemReviewEnabled
        }

        pub fun setBaseExternalURL(baseExternalURL: String) {
            TobiratoryDigitalItems.baseExternalURL = baseExternalURL
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

        pub fun mint(
            itemCreatorAddress: Address,
            itemID: UInt64,
            purchasePrice: UFix64,
            purchasePriceCurrency: String,
            regularPrice: UFix64,
            regularPriceCurrency: String,
            extraMetadata: {String: AnyStruct},
        ): @NFT {
            pre {
                self.ownerAddress == self.owner!.address: "Invalid minter"
            }
            let itemsCapability = getAccount(itemCreatorAddress).getCapability<&Items{ItemsPublic}>(TobiratoryDigitalItems.ItemsPublicPath)
            let itemsRef = itemsCapability.borrow() ?? panic("Not found")
            let itemRef = itemsRef.borrowItem(itemID: itemID) ?? panic("Missing Item")
            assert(itemRef.limit == nil || itemRef.mintedCount < itemRef.limit!, message: "Limit over")
            itemRef.incrementMintedCount()
            return <- create NFT(
                itemID: itemID,
                itemsCapability: itemsCapability,
                serialNumber: itemRef.mintedCount,
                purchasePrice: purchasePrice,
                purchasePriceCurrency: purchasePriceCurrency,
                regularPrice: regularPrice,
                regularPriceCurrency: regularPriceCurrency,
                extraMetadata: extraMetadata,
            )
        }

        init(ownerAddress: Address) {
            self.ownerAddress = ownerAddress
        }
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
        switch view {
            case Type<MetadataViews.NFTCollectionData>():
                return MetadataViews.NFTCollectionData(
                    storagePath: TobiratoryDigitalItems.CollectionStoragePath,
                    publicPath: TobiratoryDigitalItems.CollectionPublicPath,
                    providerPath: /private/TobiratoryDigitalItemsCollection,
                    publicCollection: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic}>(),
                    publicLinkedType: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                    providerLinkedType: Type<&TobiratoryDigitalItems.Collection{TobiratoryDigitalItems.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                    createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                        return <-TobiratoryDigitalItems.createEmptyCollection()
                    })
                )
            case Type<MetadataViews.NFTCollectionDisplay>():
                return MetadataViews.NFTCollectionDisplay(
                    name: "Tobiratory Digital Items",
                    description: "Tobiratory is a service that issues digital items as NFTs, allowing users to create, collect and decorate them.",
                    externalURL: MetadataViews.ExternalURL("https://www.tobiratory.com"),
                    squareImage: MetadataViews.Media(
                        file: MetadataViews.HTTPFile(url: ""),
                        mediaType: "image/png"
                    ),
                    bannerImage: MetadataViews.Media(
                        file: MetadataViews.HTTPFile(url: ""),
                        mediaType: "image/png"
                    ),
                    socials: {
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/Tobiratory")
                    }
                )
        }
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
        self.baseExternalURL = "https://www.tobiratory.com/?item="

        self.CollectionStoragePath = /storage/TobiratoryDigitalItemsCollection
        self.CollectionPublicPath = /public/TobiratoryDigitalItemsCollection
        self.ItemsStoragePath = /storage/TobiratoryDigitalItemsItems
        self.ItemsPublicPath = /public/TobiratoryDigitalItemsItems
        self.AdminStoragePath = /storage/TobiratoryDigitalItemsAdmin
        self.ItemReviewerStoragePath = /storage/TobiratoryDigitalItemsItemReviewer
        self.MinterStoragePath = /storage/TobiratoryDigitalItemsMinter

        self.account.save(<- create Collection(), to: self.CollectionStoragePath)
        self.account.link<&TobiratoryDigitalItems.Collection{NonFungibleToken.CollectionPublic, TobiratoryDigitalItems.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        self.account.save(<- create Items(), to: self.ItemsStoragePath)
        self.account.link<&{TobiratoryDigitalItems.ItemsPublic}>(
            self.ItemsPublicPath,
            target: self.ItemsStoragePath
        )

        let admin <- create Admin()
        let itemReviewer <- admin.createItemReviewer(ownerAddress: self.account.address)
        let minter <- admin.createMinter(ownerAddress: self.account.address)
        self.account.save(<- admin, to: self.AdminStoragePath)
        self.account.save(<- itemReviewer, to: self.ItemReviewerStoragePath)
        self.account.save(<- minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}
