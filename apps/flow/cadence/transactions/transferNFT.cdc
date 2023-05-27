import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import TobiraNeko from "../contracts/TobiraNeko.cdc"

transaction(recipient: Address, withdrawID: UInt64) {
    /// Reference to the withdrawer's collection
    let withdrawRef: &TobiraNeko.Collection

    /// Reference of the collection to deposit the NFT to
    let depositRef: &{NonFungibleToken.CollectionPublic}

    prepare(acct: AuthAccount) {
        self.withdrawRef = acct
            .borrow<&TobiraNeko.Collection>(from: TobiraNeko.collectionStoragePath)
            ?? panic("Account does not store an object at the specified path")

        // get the recipients public account object
        let recipient = getAccount(recipient)

        self.depositRef = recipient
            .getCapability(TobiraNeko.collectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow a reference to the receiver's collection")
    }
    execute {
        // withdraw the NFT from the owner's collection
        let nft <- self.withdrawRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        self.depositRef.deposit(token: <-nft)
    }
    post {
        !self.withdrawRef.getIDs().contains(withdrawID): "Original owner should not have the NFT anymore"
        self.depositRef.getIDs().contains(withdrawID): "The reciever should now own the NFT"
    }
}
