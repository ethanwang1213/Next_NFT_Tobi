import AchievementBadge from "../../contracts/AchievementBadge.cdc"

pub fun main(): UInt64 {
    return AchievementBadge.totalSupply
}
