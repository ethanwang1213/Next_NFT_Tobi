import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction(itemID: UInt64, name: String) {
    let itemsRef: auth(TobiratoryDigitalItems.UpdateItem) &TobiratoryDigitalItems.Items
    let itemReviewerRef: &TobiratoryDigitalItems.ItemReviewer

    prepare(creator: auth(BorrowValue) &Account, reviewer: auth(BorrowValue) &Account) {
        self.itemsRef = creator.storage.borrow<auth(TobiratoryDigitalItems.UpdateItem) &TobiratoryDigitalItems.Items>(from: TobiratoryDigitalItems.ItemsStoragePath) ?? panic("Not found")
        self.itemReviewerRef = reviewer.storage.borrow<&TobiratoryDigitalItems.ItemReviewer>(from: TobiratoryDigitalItems.ItemReviewerStoragePath) ?? panic("Not found")
    }

    execute {
        self.itemsRef.updateItemName(itemID: itemID, name: name, itemReviewer: self.itemReviewerRef)
    }
}
