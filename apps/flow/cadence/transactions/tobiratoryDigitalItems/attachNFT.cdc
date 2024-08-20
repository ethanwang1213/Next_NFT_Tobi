import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(parentID: UInt64, childID: UInt64) {
    let collectionRef: auth(NonFungibleToken.Withdraw, TobiratoryDigitalItems.AttachNFT) &TobiratoryDigitalItems.Collection

    prepare(acct: auth(BorrowValue) &Account) {
        self.collectionRef = acct.storage.borrow<auth(NonFungibleToken.Withdraw, TobiratoryDigitalItems.AttachNFT) &TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) ?? panic("Not found")
    }

    execute {
        let childNFT <- self.collectionRef.withdraw(withdrawID: childID)
        self.collectionRef.attachNFT(parentID: parentID, nft: <- childNFT)
    }
}
