import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

transaction(address: Address) {
    prepare(acct: AuthAccount) {
        let renameable = getAccount(address)
            .getCapability(HouseBadge.collectionPublicPath)
            .borrow<&{HouseBadge.Renameable}>()
            ?? panic("NFT Collection not found")
        renameable.fixBadgeName()
    }
}
