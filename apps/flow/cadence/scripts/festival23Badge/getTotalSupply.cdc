import Festival23 from "../../contracts/Festival23.cdc"

access(all) fun main(): UInt64 {
    return Festival23.totalSupply
}
