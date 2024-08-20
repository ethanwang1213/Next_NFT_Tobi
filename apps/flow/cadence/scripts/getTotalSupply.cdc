import TobiraNeko from "../contracts/TobiraNeko.cdc"

access(all) fun main(): UInt64 {
    return TobiraNeko.totalSupply
}
