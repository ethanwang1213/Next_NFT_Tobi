import AchievementBadge from "../../contracts/AchievementBadge.cdc"

access(all) fun main(): UInt64 {
    return AchievementBadge.totalSupply
}
