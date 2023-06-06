import { ThreeEvent } from "@react-three/fiber";
import { RefObject } from "react";
import { Group } from "three";

export type DirectMoveDownType = (
  ev: ThreeEvent<PointerEvent>,
  itemId: string
) => void;


export type DirectScaleDownType = (
  ev: ThreeEvent<PointerEvent>,
  itemId: string
) => void;

export type DirectControlType = {
  handleDirectMoveDown: DirectMoveDownType,
  handleDirectScaleDown: DirectScaleDownType,
  scalePointerTargetRef: RefObject<Group>
}

