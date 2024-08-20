import TobiratoryDigitalItems from "../../contracts/TobiratoryDigitalItems.cdc"

access(all) fun main(): UInt64 {
    return TobiratoryDigitalItems.totalSupply
}
