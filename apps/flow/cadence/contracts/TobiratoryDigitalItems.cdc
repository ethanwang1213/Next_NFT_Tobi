import NonFungibleToken from "./core/NonFungibleToken.cdc"
import MetadataViews from "./core/MetadataViews.cdc"
import ViewResolver from "./core/ViewResolver.cdc"

access(all) contract TobiratoryDigitalItems: NonFungibleToken {

    access(all) var totalSupply: UInt64
    access(all) var itemTotalSupply: UInt64
    access(all) var itemReviewEnabled: Bool
    access(all) var baseExternalURL: String

    access(all) event ItemCreated(id: UInt64, type: String, creatorAddress: Address)
    access(all) event ItemDestroyed(id: UInt64)
    access(all) event Mint(id: UInt64, itemID: UInt64, serialNumber: UInt32)
    access(all) event Attach(id: UInt64, parentID: UInt64)
    access(all) event Detach(id: UInt64, parentID: UInt64)

    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let ItemsStoragePath: StoragePath
    access(all) let ItemsPublicPath: PublicPath
    access(all) let AdminStoragePath: StoragePath
    access(all) let ItemReviewerStoragePath: StoragePath
    access(all) let MinterStoragePath: StoragePath

    access(all) entitlement AttachNFT
    access(all) entitlement DetachNFT
    access(all) entitlement UpdateItem
    access(all) entitlement DeleteItem

    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let itemID: UInt64
        access(all) let itemsCapability: Capability<&Items>
        access(all) let serialNumber: UInt32
        access(contract) var extraMetadata: {String: AnyStruct}
        access(contract) var ownerHistory: {UFix64: Address}
        access(contract) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init(
            itemID: UInt64,
            itemsCapability: Capability<&Items>,
            serialNumber: UInt32,
            extraMetadata: {String: AnyStruct},
        ) {
            pre {
                itemsCapability.check(): "Invalid itemsCapability"
            }
            assert(itemsCapability.borrow()!.borrowItem(itemID: itemID) != nil, message: "Invalid itemsCapability")

            TobiratoryDigitalItems.totalSupply = TobiratoryDigitalItems.totalSupply + 1
            let id = TobiratoryDigitalItems.totalSupply
            self.id = id
            self.itemID = itemID
            self.itemsCapability = itemsCapability
            self.serialNumber = serialNumber
            self.extraMetadata = extraMetadata
            self.ownerHistory = {}
            self.ownedNFTs <- {}
            emit Mint(id: id, itemID: itemID, serialNumber: serialNumber)
        }

        access(all) fun getExtraMetadata(): {String: AnyStruct} {
            return self.extraMetadata
        }

        access(all) fun getOwnerHistory(): {UFix64: Address} {
            return self.ownerHistory
        }

        // Note: This function is called when an NFT is deposited into the Collection and records the owner of the NFT, 
        // but it cannot fully track the history. Users can hide the history of transfers. Please be careful when using this information.
        access(contract) fun recordOwnerHistory() {
            let owner = self.owner?.address
            if owner != nil {
                let now = getCurrentBlock().timestamp
                self.ownerHistory[now] = owner
                for id in self.ownedNFTs.keys {
                    let nftRef = self.borrowTobiratoryNFT(id)!
                    nftRef.recordOwnerHistory()
                }
            }
        }

        access(all) view fun getOwnedNFTsIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id] as &{NonFungibleToken.NFT}?
        }

        access(all) view fun borrowTobiratoryNFT(_ id: UInt64): &TobiratoryDigitalItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as &{NonFungibleToken.NFT}?)!
                return ref as! &TobiratoryDigitalItems.NFT
            }
            return nil
        }

        access(contract) fun attachNFT(nft: @{NonFungibleToken.NFT}) {
            let nft <- nft as! @TobiratoryDigitalItems.NFT
            let id: UInt64 = nft.id
            self.ownedNFTs[id] <-! nft
            emit Attach(id: id, parentID: self.id)
        }

        access(contract) fun detachNFT(id: UInt64): @{NonFungibleToken.NFT} {
            let nft <- self.ownedNFTs.remove(key: id) ?? panic("missing NFT")
            emit Detach(id: nft.id, parentID: self.id)
            return <- nft
        }

        access(all) view fun getViews(): [Type] {
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

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            let itemRef = self.itemsCapability.borrow()!.borrowItem(itemID: self.itemID)!
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: itemRef.name ?? "",
                        description: itemRef.description ?? "",
                        thumbnail: MetadataViews.HTTPFile(
                            url: itemRef.thumbnailUrl
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
                        itemRef.getRoyalties()
                    )
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://www.tobiratory.com/?item=".concat(self.id.toString()))
                case Type<MetadataViews.NFTCollectionData>():
                    return TobiratoryDigitalItems.resolveContractView(resourceType: Type<@TobiratoryDigitalItems.NFT>(), viewType: Type<MetadataViews.NFTCollectionData>())
                case Type<MetadataViews.NFTCollectionDisplay>():
                    return TobiratoryDigitalItems.resolveContractView(resourceType: Type<@TobiratoryDigitalItems.NFT>(), viewType: Type<MetadataViews.NFTCollectionDisplay>())
                case Type<MetadataViews.Traits>():
                    let traits = MetadataViews.Traits([
                        MetadataViews.Trait(name: "name", value: itemRef.name, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "description", value: itemRef.description, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "thumbnail", value: itemRef.thumbnailUrl, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "serialNumber", value: self.serialNumber, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "creatorName", value: itemRef.creatorName, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "creatorAddress", value: itemRef.creatorAddress.toString(), displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "limit", value: itemRef.limit ?? 0, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "license", value: itemRef.license, displayType: nil, rarity: nil),
                        MetadataViews.Trait(name: "copyrightHolders", value: self.getCopyrightHolders(itemRef: itemRef), displayType: nil, rarity: nil)
                    ])
                    return traits
            }
            return nil
        }

        access(self) fun getCopyrightHolders(itemRef: &Item): String {
            var copyrightHolders = ""
            for holder in itemRef.copyrightHolders {
                copyrightHolders = copyrightHolders.concat(holder).concat(", ")
            }
            return copyrightHolders
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
        }
    }

    access(all) resource Item {
        access(all) let id: UInt64
        access(all) let type: String
        access(all) var name: String?
        access(all) var description: String?
        access(all) var thumbnailUrl: String
        access(all) var modelUrl: String?
        access(all) var creatorName: String
        access(all) let creatorAddress: Address
        access(all) let createdAt: UFix64
        access(all) var limit: UInt32?
        access(all) var license: String?
        access(all) var copyrightHolders: [String]
        access(all) var royalties: [MetadataViews.Royalty]
        access(all) var extraMetadata: {String: AnyStruct}
        access(all) var mintedCount: UInt32

        init (
            type: String,
            name: String?,
            description: String?,
            thumbnailUrl: String,
            modelUrl: String?,
            creatorName: String,
            creatorAddress: Address,
            limit: UInt32?,
            license: String?,
            copyrightHolders: [String],
            royalties: [MetadataViews.Royalty],
            extraMetadata: {String: AnyStruct},
        ) {
            TobiratoryDigitalItems.itemTotalSupply = TobiratoryDigitalItems.itemTotalSupply + 1
            let id: UInt64 = TobiratoryDigitalItems.itemTotalSupply
            self.id = id
            self.type = type
            self.name = name
            self.description = description
            self.thumbnailUrl = thumbnailUrl
            self.modelUrl = modelUrl
            self.creatorName = creatorName
            self.creatorAddress = creatorAddress
            self.createdAt = getCurrentBlock().timestamp
            self.limit = limit
            self.license = license
            self.copyrightHolders = copyrightHolders
            self.royalties = royalties
            self.extraMetadata = extraMetadata
            self.mintedCount = 0
            emit ItemCreated(id: id, type: type, creatorAddress: creatorAddress)
        }

        access(contract) fun updateName(name: String?) {
            self.name = name
        }

        access(contract) fun updateDescription(description: String?) {
            self.description = description
        }

        access(contract) fun updateThumbnailUrl(thumbnailUrl: String) {
            self.thumbnailUrl = thumbnailUrl
        }

        access(contract) fun updateModelUrl(modelUrl: String?) {
            self.modelUrl = modelUrl
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

        access(contract) fun updateLicense(license: String?) {
            self.license = license
        }

        access(contract) fun updateCopyrightHolders(copyrightHolders: [String]) {
            self.copyrightHolders = copyrightHolders
        }

        access(contract) fun updateExtraMetadata(extraMetadata: {String: AnyStruct}) {
            self.extraMetadata = extraMetadata
        }

        access(contract) fun incrementMintedCount() {
            self.mintedCount = self.mintedCount + 1
        }

        access(all) view fun getCopyrightHolders(): [String] {
            return self.copyrightHolders
        }

        access(all) view fun getRoyalties(): [MetadataViews.Royalty] {
            return self.royalties
        }

        access(all) view fun getExtraMetadata(): {String: AnyStruct} {
            return self.extraMetadata
        }
    }

    access(all) resource interface ItemsPublic {
        access(all) fun getItemIDs(): [UInt64]

        access(all) fun borrowItem(itemID: UInt64): &Item?
    }

    access(all) resource Items: ItemsPublic {
        access(all) var items: @{UInt64: Item}

        init () {
            self.items <- {}
        }

        access(all) fun createItem(
            type: String,
            name: String?,
            description: String?,
            thumbnailUrl: String,
            modelUrl: String?,
            creatorName: String,
            limit: UInt32?,
            license: String?,
            copyrightHolders: [String],
            royalties: [MetadataViews.Royalty],
            extraMetadata: {String: AnyStruct},
            itemReviewer: &ItemReviewer?,
        ): UInt64 {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")

            let item <- create Item(
                type: type,
                name: name,
                description: description,
                thumbnailUrl: thumbnailUrl,
                modelUrl: modelUrl,
                creatorName: creatorName,
                creatorAddress: self.owner!.address,
                limit: limit,
                license: license,
                copyrightHolders: copyrightHolders,
                royalties: royalties,
                extraMetadata: extraMetadata,
            )
            let id = item.id
            self.items[id] <-! item
            return id
        }

        access(all) fun getItemIDs(): [UInt64] {
            return self.items.keys
        }

        access(all) fun borrowItem(itemID: UInt64): &Item? {
            return &self.items[itemID] as &Item?
        }

        access(UpdateItem) fun updateItemName(itemID: UInt64, name: String?, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateName(name: name)
        }

        access(UpdateItem) fun updateItemDescription(itemID: UInt64, description: String?, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateDescription(description: description)
        }

        access(UpdateItem) fun updateItemThumbnailUrl(itemID: UInt64, thumbnailUrl: String, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateThumbnailUrl(thumbnailUrl: thumbnailUrl)
        }

        access(UpdateItem) fun updateItemModelUrl(itemID: UInt64, modelUrl: String?, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateModelUrl(modelUrl: modelUrl)
        }

        access(UpdateItem) fun updateItemCreatorName(itemID: UInt64, creatorName: String, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateCreatorName(creatorName: creatorName)
        }

        access(UpdateItem) fun updateItemRoyalties(itemID: UInt64, royalties: [MetadataViews.Royalty], itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateRoyalties(royalties: royalties)
        }

        access(UpdateItem) fun updateItemLicense(itemID: UInt64, license: String?, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateLicense(license: license)
        }

        access(UpdateItem) fun updateItemCopyrightHolders(itemID: UInt64, copyrightHolders: [String], itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateCopyrightHolders(copyrightHolders: copyrightHolders)
        }

        access(UpdateItem) fun updateItemLimit(itemID: UInt64, limit: UInt32, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateLimit(limit: limit)
        }

        access(UpdateItem) fun updateItemExtraMetadata(itemID: UInt64, extraMetadata: {String: AnyStruct}, itemReviewer: &ItemReviewer?) {
            assert(self.validateItemReviewer(itemReviewer), message: "Invalid itemReviewer")
            let itemRef = self.borrowItem(itemID: itemID)!
            itemRef.updateExtraMetadata(extraMetadata: extraMetadata)
        }

        access(DeleteItem) fun destroyItem(itemID: UInt64) {
            let item <- self.items.remove(key: itemID) ?? panic("Missing Item")
            destroy item
            emit ItemDestroyed(id: itemID)
        }

        access(all) fun validateItemReviewer(_ itemReviewer: &ItemReviewer?,): Bool {
            if !TobiratoryDigitalItems.itemReviewEnabled {
                return true
            }
            return itemReviewer!.ownerAddress == itemReviewer!.owner!.address
        }
    }

    access(all) fun createItems(): @TobiratoryDigitalItems.Items {
        return <- create Items()
    }

    access(all) resource interface CollectionPublic {
        access(all) fun deposit(token: @{NonFungibleToken.NFT})
        access(all) view fun getIDs(): [UInt64]
        access(all) view fun getLength(): Int
        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}?
        access(all) view fun borrowTobiratoryNFT(_ id: UInt64): &TobiratoryDigitalItems.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow TobiratoryDigitalItems reference: the ID of the returned reference is incorrect"
            }
        }
    }

    access(all) resource Collection: CollectionPublic, NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init () {
            self.ownedNFTs <- {}
        }

        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[Type<@TobiratoryDigitalItems.NFT>()] = true
            return supportedTypes
        }

        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@TobiratoryDigitalItems.NFT>()
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            return <- token
        }

        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let token <- token as! @TobiratoryDigitalItems.NFT
            token.recordOwnerHistory()
            let id: UInt64 = token.id
            self.ownedNFTs[id] <-! token
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

        access(all) view fun borrowTobiratoryNFT(_ id: UInt64): &TobiratoryDigitalItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as &{NonFungibleToken.NFT}?)!
                return ref as! &TobiratoryDigitalItems.NFT
            }
            return nil
        }

        access(AttachNFT) fun attachNFT(parentID: UInt64, nft: @{NonFungibleToken.NFT}) {
            let nftRef = self.borrowTobiratoryNFT(parentID)!
            nftRef.attachNFT(nft: <- nft)
        }

        access(DetachNFT) fun detachNFT(parentID: UInt64, id: UInt64): @{NonFungibleToken.NFT} {
            let nftRef = self.borrowTobiratoryNFT(parentID)!
            return <- nftRef.detachNFT(id: id)
        }

        access(all) view fun borrowViewResolver(id: UInt64): &{ViewResolver.Resolver}? {
            if let nft = &self.ownedNFTs[id] as &{NonFungibleToken.NFT}? {
                return nft as &{ViewResolver.Resolver}
            }
            return nil
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
        }
    }

    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    access(all) resource Admin {
        access(all) fun setItemReviewEnabled(itemReviewEnabled: Bool) {
            TobiratoryDigitalItems.itemReviewEnabled = itemReviewEnabled
        }

        access(all) fun setBaseExternalURL(baseExternalURL: String) {
            TobiratoryDigitalItems.baseExternalURL = baseExternalURL
        }

        access(all) fun createItemReviewer(ownerAddress: Address): @ItemReviewer {
            return <- create ItemReviewer(ownerAddress: ownerAddress)
        }

        access(all) fun createMinter(ownerAddress: Address): @Minter {
            return <- create Minter(ownerAddress: ownerAddress)
        }
    }

    access(all) resource ItemReviewer {
        access(all) let ownerAddress: Address

        init(ownerAddress: Address) {
            self.ownerAddress = ownerAddress
        }
    }

    access(all) resource Minter {
        access(all) let ownerAddress: Address

        access(all) fun mint(
            itemCreatorAddress: Address,
            itemID: UInt64,
            extraMetadata: {String: AnyStruct},
        ): @NFT {
            pre {
                self.ownerAddress == self.owner!.address: "Invalid minter"
            }
            let itemsCapability = getAccount(itemCreatorAddress).capabilities.get<&Items>(TobiratoryDigitalItems.ItemsPublicPath)
            let itemsRef = itemsCapability.borrow() ?? panic("Not found")
            let itemRef = itemsRef.borrowItem(itemID: itemID) ?? panic("Missing Item")
            assert(itemRef.limit == nil || itemRef.mintedCount < itemRef.limit!, message: "Limit over")
            itemRef.incrementMintedCount()
            return <- create NFT(
                itemID: itemID,
                itemsCapability: itemsCapability,
                serialNumber: itemRef.mintedCount,
                extraMetadata: extraMetadata,
            )
        }

        init(ownerAddress: Address) {
            self.ownerAddress = ownerAddress
        }
    }

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
    }

    access(all) view fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<MetadataViews.NFTCollectionData>():
                let collectionData = MetadataViews.NFTCollectionData(
                    storagePath: self.CollectionStoragePath,
                    publicPath: self.CollectionPublicPath,
                    publicCollection: Type<&TobiratoryDigitalItems.Collection>(),
                    publicLinkedType: Type<&TobiratoryDigitalItems.Collection>(),
                    createEmptyCollectionFunction: (fun(): @{NonFungibleToken.Collection} {
                        return <- TobiratoryDigitalItems.createEmptyCollection(nftType: Type<@TobiratoryDigitalItems.NFT>())
                    })
                )
                return collectionData
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
                        "twitter": MetadataViews.ExternalURL("https://x.com/Tobiratory")
                    }
                )
        }
        return nil
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

        self.account.storage.save(<- create Collection(), to: self.CollectionStoragePath)
        let collectionCapability = self.account.capabilities.storage.issue<&Collection>(self.CollectionStoragePath)
        self.account.capabilities.publish(collectionCapability, at: self.CollectionPublicPath)

        self.account.storage.save(<- create Items(), to: self.ItemsStoragePath)
        let itemsCapability = self.account.capabilities.storage.issue<&Items>(self.ItemsStoragePath)
        self.account.capabilities.publish(itemsCapability, at: self.ItemsPublicPath)

        let admin <- create Admin()
        let itemReviewer <- admin.createItemReviewer(ownerAddress: self.account.address)
        let minter <- admin.createMinter(ownerAddress: self.account.address)
        self.account.storage.save(<- admin, to: self.AdminStoragePath)
        self.account.storage.save(<- itemReviewer, to: self.ItemReviewerStoragePath)
        self.account.storage.save(<- minter, to: self.MinterStoragePath)
    }
}
