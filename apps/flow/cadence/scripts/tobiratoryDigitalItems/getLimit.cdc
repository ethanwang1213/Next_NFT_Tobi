import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

pub fun main(address: Address, itemID: UInt64): UInt32? {
    let items = getAccount(address)
        .getCapability(TobiratoryDigitalItems.ItemsPublicPath)
        .borrow<&TobiratoryDigitalItems.Items{TobiratoryDigitalItems.ItemsPublic}>()
        ?? panic("Could not borrow the NFT collection reference")
    let item = items.borrowItem(itemID: itemID)

    return item?.limit;
}
