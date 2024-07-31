import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

access(all) fun main(address: Address, itemID: UInt64): UInt32? {
    let items = getAccount(address)
        .capabilities.get<&TobiratoryDigitalItems.Items>(TobiratoryDigitalItems.ItemsPublicPath)
        .borrow()
        ?? panic("Could not borrow the NFT collection reference")
    let item = items.borrowItem(itemID: itemID)

    return item?.limit;
}
