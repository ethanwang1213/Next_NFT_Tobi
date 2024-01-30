import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction {
    prepare(adminAccount: AuthAccount, newItemReviewerAccount: AuthAccount) {
        if newItemReviewerAccount.borrow<&TobiratoryDigitalItems.ItemReviewer>(from: TobiratoryDigitalItems.ItemReviewerStoragePath) == nil {
            let adminRef: &TobiratoryDigitalItems.Admin = adminAccount.borrow<&TobiratoryDigitalItems.Admin>(from: TobiratoryDigitalItems.AdminStoragePath) ?? panic("Not found")
            let itemReviewer <- adminRef.createItemReviewer(ownerAddress: newItemReviewerAccount.address)
            newItemReviewerAccount.save(<- itemReviewer, to: TobiratoryDigitalItems.ItemReviewerStoragePath)
        }
    }
}
