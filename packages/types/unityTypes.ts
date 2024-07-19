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
  CanBadge: 3,
  MessageCard: 4,
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

export type ItemTypeParam = {
  itemType: ItemType;
};

export type ItemBaseId = {
  itemId: number;
};

export type SampleBaseIdForLoading = {
  sampleItemId: number;
};
export type NftBaseIdForLoading = {
  nftId: number;
};

export type ParentId = {
  digitalItemId: number;
};

export type ModelParams = {
  modelType: ModelType;
  modelUrl: string;
};

export type TextureParam = {
  imageUrl?: string;
};

export type DebugFlag = {
  isDebug?: boolean;
};

export type ItemBaseData = ItemTypeParam &
  ItemBaseId &
  ModelParams &
  TextureParam &
  ParentId &
  DebugFlag;
export type SampleBaseData = Omit<ItemBaseData, "itemType">;
export type NftBaseData = Omit<ItemBaseData, "itemType" | "imageUrl">;

export type SampleBaseDataForLoading = SampleBaseIdForLoading &
  ModelParams &
  TextureParam &
  ParentId &
  DebugFlag;
export type NftBaseDataForLoading = NftBaseIdForLoading &
  ModelParams &
  TextureParam &
  ParentId &
  DebugFlag;

export type ItemId = {
  id: number;
};

export type ItemPosture = {
  stageType: UnityStageType;
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export type SaidanItemData = ItemBaseData &
  ItemId &
  ItemPosture & {
    canScale: boolean;
    itemMeterHeight: number;
  };

export type SampleLoadData = SampleBaseDataForLoading & ItemId & ItemPosture;
export type NftLoadData = NftBaseDataForLoading &
  ItemId &
  ItemPosture & {
    itemMeterHeight: number;
  };

export type ItemSaveData = ItemBaseId & ItemId & ItemPosture;

type RoomSurfaceParams = {
  tint: string;
};
type WallpaperSettings = RoomSurfaceParams;
type FloorSettings = RoomSurfaceParams;

type LightParams = {
  tint: string;
  brightness: number;
};
type LightSettings = {
  sceneLight: LightParams;
  pointLight: LightParams;
};

export type SaidanSettings = {
  wallpaper: WallpaperSettings;
  floor: FloorSettings;
  lighting: LightSettings;
};

export type ShowcaseSettigs = SaidanSettings;
