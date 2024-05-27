import { ItemType, ModelType } from "./adminTypes";


export const UnityStageType = {
  Floor: 0,
  BackWall: 1,
  LeftWall: 2,
  RightWall: 3,
} as const;
export type UnityStageType =
  (typeof UnityStageType)[keyof typeof UnityStageType];

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type ItemBaseData = {
  itemType: ItemType;
  itemId: number;
  modelType: ModelType;
  modelUrl: string;
  imageUrl: string;
};

export type SaidanItemData = ItemBaseData & {
  tableId: number;
  stageType: UnityStageType;
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export type WorkspaceItemData = Omit<SaidanItemData, "itemType">;

export type ShowcaseItemData = Omit<SaidanItemData, "itemType">;
