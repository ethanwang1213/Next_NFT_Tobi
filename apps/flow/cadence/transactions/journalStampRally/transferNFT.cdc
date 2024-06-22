import NonFungibleToken from "../../contracts/core/NonFungibleToken.cdc"
import JournalStampRally from "../../contracts/JournalStampRally.cdc"

transaction(recipient: Address, withdrawID: UInt64) {
    let withdrawRef: &JournalStampRally.Collection
    let depositRef: &{NonFungibleToken.CollectionPublic}

    prepare(acct: AuthAccount) {
        self.withdrawRef = acct
            .borrow<&JournalStampRally.Collection>(from: JournalStampRally.collectionStoragePath)
            ?? panic("Account does not store an object at the specified path")
        let recipient = getAccount(recipient)
        self.depositRef = recipient
            .getCapability(JournalStampRally.collectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow a reference to the receiver's collection")
    }
    execute {
        let nft <- self.withdrawRef.withdraw(withdrawID: withdrawID)
        self.depositRef.deposit(token: <-nft)
    }
    post {
        !self.withdrawRef.getIDs().contains(withdrawID): "Original owner should not have the NFT anymore"
        self.depositRef.getIDs().contains(withdrawID): "The reciever should now own the NFT"
    }
}
