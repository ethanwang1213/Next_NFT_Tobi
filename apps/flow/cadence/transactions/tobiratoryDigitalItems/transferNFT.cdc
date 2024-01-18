import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(recipient: Address, withdrawID: UInt64) {
    let senderCollectionRef: &TobiratoryDigitalItems.Collection
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    prepare(acct: AuthAccount) {
        self.senderCollectionRef = acct
            .borrow<&TobiratoryDigitalItems.Collection>(from: TobiratoryDigitalItems.CollectionStoragePath)
            ?? panic("Not found")

        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(TobiratoryDigitalItems.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Not found")
    }

    execute {
        let nft <- self.senderCollectionRef.withdraw(withdrawID: withdrawID)
        self.recipientCollectionRef.deposit(token: <-nft)
    }
}
