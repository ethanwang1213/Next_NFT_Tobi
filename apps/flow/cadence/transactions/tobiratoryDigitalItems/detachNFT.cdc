import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(parentID: UInt64, childID: UInt64) {
    let collectionRef: auth(TobiratoryDigitalItems.DetachNFT) &TobiratoryDigitalItems.Collection

    prepare(acct: auth(BorrowValue) &Account) {
        self.collectionRef = acct.storage.borrow<auth(TobiratoryDigitalItems.DetachNFT) &TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath) ?? panic("Not found")
    }

    execute {
        let nft <- self.collectionRef.detachNFT(parentID: parentID, id: childID)
        self.collectionRef.deposit(token: <- nft)
    }
}
