import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

transaction(address: Address) {
    prepare(acct: AuthAccount) {
        let collection = getAccount(address)
            .getCapability(HouseBadge.collectionPublicPath)
            .borrow<&{HouseBadge.CollectionPublic,MetadataViews.ResolverCollection}>()
            ?? panic("NFT Collection not found")
    
        let renameable = acct
            .getCapability(HouseBadge.adminPrivatePath)
            .borrow<&{HouseBadge.Renameable}>()
            ?? panic("NFT Collection not found")

        var i: UInt64 = 0
        while i < HouseBadge.totalSupply {
            let nft = collection.borrowViewResolver(id: UInt64.fromString(i.toString())!)
            let display = MetadataViews.getDisplay(nft)
            let badgeName = display!.name

            if (badgeName == "HYDOR Badge") {
                renameable.rename(id: i, newName: "HUDOR Badge")
            } else if (badgeName == "ARISMOS Badge") {
                renameable.rename(id: i, newName: "ARITHMOS Badge")
            }
            i = i + 1
        }
    }
}
