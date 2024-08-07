import JournalStampRally from "../../contracts/JournalStampRally.cdc"

access(all) fun main(): UInt64 {
    return JournalStampRally.totalSupply
}
