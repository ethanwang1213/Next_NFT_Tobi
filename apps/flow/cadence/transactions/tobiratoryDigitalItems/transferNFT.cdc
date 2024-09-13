import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(recipient: Address, withdrawID: UInt64) {
    let senderCollectionRef: auth(NonFungibleToken.Withdraw) &TobiratoryDigitalItems.Collection
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    prepare(acct: auth(BorrowValue, GetStorageCapabilityController) &Account) {
        self.senderCollectionRef = acct
            .storage.borrow<auth(NonFungibleToken.Withdraw) &TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath)
            ?? panic("Not found")

        self.recipientCollectionRef = getAccount(recipient)
            .capabilities.get<&{NonFungibleToken.CollectionPublic}>(TobiratoryDigitalItems.CollectionPublicPath)
            .borrow()
            ?? panic("Not found")
    }

    execute {
        let nft <- self.senderCollectionRef.withdraw(withdrawID: withdrawID)
        self.recipientCollectionRef.deposit(token: <-nft)
    }
}
