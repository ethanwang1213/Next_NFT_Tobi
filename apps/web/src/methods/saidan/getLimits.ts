import { WALL_OFFSET } from "@/constants/saidanConstants";

export const getFloorLeftLimit = (itemXHalf: number) => 2.45 - itemXHalf; // 微妙に埋まるので0.05
export const getFloorRightLimit = (itemXHalf: number) => -2.45 + itemXHalf;

export const getFloorDepthLimit = (
  itemHeight: number,
  itemOriginY: number,
  rotation: number,
  wallLength: number
) => WALL_OFFSET - (itemHeight - itemOriginY) * Math.abs(Math.sin(rotation)) - wallLength * 0.05

export const getFloorNearLimit = () => -4.8;

export const getWallBottomLimit = (itemOriginY: number, rotation: number) =>
  itemOriginY * Math.abs(Math.cos(rotation));

export const getWallTopLimit = (itemOriginY: number, itemHeight: number) =>
  5.15 - (itemHeight - itemOriginY); // 微妙に埋まるので0.05
