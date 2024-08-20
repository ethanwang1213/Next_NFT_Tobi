import HouseBadge from "../../contracts/HouseBadge.cdc"

access(all) fun main(): UInt64 {
    return HouseBadge.totalSupply
}
