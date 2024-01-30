import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

transaction {
    prepare(adminAccount: AuthAccount, newMinterAccount: AuthAccount) {
        if newMinterAccount.borrow<&TobiratoryDigitalItems.Minter>(from: TobiratoryDigitalItems.MinterStoragePath) == nil {
            let adminRef: &TobiratoryDigitalItems.Admin = adminAccount.borrow<&TobiratoryDigitalItems.Admin>(from: TobiratoryDigitalItems.AdminStoragePath) ?? panic("Not found")
            let minter: @TobiratoryDigitalItems.Minter <- adminRef.createMinter(ownerAddress: newMinterAccount.address)
            newMinterAccount.save(<- minter, to: TobiratoryDigitalItems.MinterStoragePath)
        }
    }
}
