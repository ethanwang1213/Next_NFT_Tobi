import TobiraNeko from "../contracts/TobiraNeko.cdc"

pub fun main(): UInt64 {
    return TobiraNeko.totalSupply
}
