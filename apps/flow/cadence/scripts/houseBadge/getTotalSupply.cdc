import HouseBadge from "../../contracts/HouseBadge.cdc"

pub fun main(): UInt64 {
    return HouseBadge.totalSupply
}
