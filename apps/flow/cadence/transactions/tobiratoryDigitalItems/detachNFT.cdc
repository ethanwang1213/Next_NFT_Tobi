import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(parentID: UInt64, childID: UInt64) {
    let collectionRef: &TobiratoryDigitalItems.Collection

    prepare(acct: AuthAccount) {
        self.collectionRef = acct.borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) ?? panic("Not found")
    }

    execute {
        let nft <- self.collectionRef.detachNFT(parentID: parentID, id: childID)
        self.collectionRef.deposit(token: <- nft)
    }
}
