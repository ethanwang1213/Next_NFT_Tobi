import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/core/MetadataViews.cdc"
import HouseBadge from "../../contracts/HouseBadge.cdc"

transaction(address: Address) {

    let admin: &HouseBadge.Admin
    let collection: &HouseBadge.Collection

    prepare(acct: AuthAccount) {
        if acct.borrow<&HouseBadge.Admin>(from: HouseBadge.adminStoragePath) == nil {
            let admin <- HouseBadge.createAdmin() as! @HouseBadge.Admin
            acct.save(<- admin, to: HouseBadge.adminStoragePath)
        }
        self.admin = acct.borrow<&HouseBadge.Admin>(from: HouseBadge.adminStoragePath)
            ?? panic("Could not borrow Admin")
        self.collection = acct.borrow<&HouseBadge.Collection>(from: HouseBadge.collectionStoragePath)
            ?? panic("Could not borrow Collection")
    }

    execute {
        var i: UInt64 = 0
        while i < HouseBadge.totalSupply {
            let nft = self.collection.borrow(id: UInt64.fromString(i.toString())!)
                ?? panic("Could not borrow NFT")
            let badgeName = nft.getMetadata()["name"]

            if (badgeName == "HYDOR Badge") {
                self.admin.rename(nft: nft, newName: "HUDOR Badge")
            } else if (badgeName == "ARISMOS Badge") {
                self.admin.rename(nft: nft, newName: "ARITHMOS Badge")
            }
            i = i + 1
        }
    }

}
