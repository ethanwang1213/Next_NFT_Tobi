import JournalStampRally from "../../contracts/JournalStampRally.cdc"

pub fun main(): UInt64 {
    return JournalStampRally.totalSupply
}
