import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction {
    prepare(
        adminAccount: auth(BorrowValue) &Account,
        newMinterAccount: auth(BorrowValue, SaveValue) &Account
    ) {
        if newMinterAccount.storage.borrow<&TobiratoryDigitalItems.Minter>(from: TobiratoryDigitalItems.MinterStoragePath) == nil {
            let adminRef: &TobiratoryDigitalItems.Admin = adminAccount.storage.borrow<&TobiratoryDigitalItems.Admin>(from: TobiratoryDigitalItems.AdminStoragePath) ?? panic("Not found")
            let minter: @TobiratoryDigitalItems.Minter <- adminRef.createMinter(ownerAddress: newMinterAccount.address)
            newMinterAccount.storage.save(<- minter, to: TobiratoryDigitalItems.MinterStoragePath)
        }
    }
}
