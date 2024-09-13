import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction {
    prepare(
        adminAccount: auth(BorrowValue) &Account,
        newItemReviewerAccount: auth(BorrowValue, SaveValue) &Account
    ) {
        if newItemReviewerAccount.storage.borrow<&TobiratoryDigitalItems.ItemReviewer>(from: TobiratoryDigitalItems.ItemReviewerStoragePath) == nil {
            let adminRef: &TobiratoryDigitalItems.Admin = adminAccount.storage.borrow<&TobiratoryDigitalItems.Admin>(from: TobiratoryDigitalItems.AdminStoragePath) ?? panic("Not found")
            let itemReviewer <- adminRef.createItemReviewer(ownerAddress: newItemReviewerAccount.address)
            newItemReviewerAccount.storage.save(<- itemReviewer, to: TobiratoryDigitalItems.ItemReviewerStoragePath)
        }
    }
}
