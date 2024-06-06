export const ShowcaseType = {
  First: 1,
  Second: 2,
  Third: 3,
} as const;
export type ShowcaseType = (typeof ShowcaseType)[keyof typeof ShowcaseType];

export const ItemType = {
  Sample: 0,
  DigitalItemNft: 1,
} as const;
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export const ModelType = {
  Poster: 1,
  AcrylicStand: 2,
} as const;
export type ModelType = (typeof ModelType)[keyof typeof ModelType];

export const UnityStageType = {
  Floor: 0,
  BackWall: 1,
  LeftWall: 2,
  RightWall: 3,
} as const;
export type UnityStageType =
  (typeof UnityStageType)[keyof typeof UnityStageType];

export type Vector3 = {
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
  secondImageUrl?: string;
  isDebug?: boolean;
};

export type SaidanItemData = ItemBaseData & {
  id: number;
  stageType: UnityStageType;
  position: Vector3;
  rotation: Vector3;
  canScale: boolean;
  itemMeterHeight: number;
  scale: number;
};

export type SampleLoadData = Omit<
  SaidanItemData,
  "itemType" | "canScale" | "itemMeterHeight"
>;

export type NftLoadData = Omit<
  SaidanItemData,
  "itemType" | "canScale" | "imageUrl" | "secondImageUrl"
>;

export type ItemSaveData = Omit<
  SaidanItemData,
  | "itemType"
  | "modelType"
  | "modelUrl"
  | "imageUrl"
  | "secondImageUrl"
  | "canScale"
  | "itemMeterHeight"
  | "isDebug"
>;
