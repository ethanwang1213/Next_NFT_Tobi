///////////////////////////////////////
// types for 3D space
export const ShowcaseType = {
  First: 1,
  Second: 2,
  Third: 3,
} as const;
export type ShowcaseType = (typeof ShowcaseType)[keyof typeof ShowcaseType];

///////////////////////////////////////
// partial types for item
export const ItemType = {
  Sample: 0,
  DigitalItemNft: 1,
  DefaultItem: 2,
} as const;
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export const ModelType = {
  Poster: 1,
  AcrylicStand: 2,
  CanBadge: 3,
  MessageCard: 4,
  UserUploadedModel: 5,
} as const;
export type ModelType = (typeof ModelType)[keyof typeof ModelType];

export const UnityStageType = {
  Floor: 0,
  BackWall: 1,
  LeftWall: 2,
  RightWall: 3,
  FrontFloor: 4,
  FrontLeftWall: 5,
  FrontRightWall: 6,
  ShelfFloor: 7,
  ShelfBackWall: 8,
  ShelfLeftWall: 9,
  ShelfRightWall: 10,
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
  itemId: number;
};
export type NftBaseIdForLoading = {
  itemId: number;
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

export type TextureParamForLoading = {
  materialUrl?: string;
  croppedUrl?: string;
};

export type AcrylicBaseScaleRatio = {
  acrylicBaseScaleRatio?: number;
};

export type AcrylicBaseScaleRatioForLoading = {
  acrylicBaseScaleRatio?: number;
};

export type ItemName = {
  itemName: string;
};

type ItemNameForLoading = {
  name: string;
};

type SampleName = {
  sampleName: string;
};

type NftName = {
  nftName: string;
};

export type DebugFlag = {
  isDebug?: boolean;
};

///////////////////////////////////////
// types for item base data
export type ItemBaseData = ItemTypeParam &
  ItemBaseId &
  ModelParams &
  TextureParam &
  AcrylicBaseScaleRatio &
  ParentId &
  ItemName &
  DebugFlag;
export type SampleBaseData = Omit<ItemBaseData, "itemType">;
export type NftBaseData = Omit<
  ItemBaseData,
  "itemType" | "imageUrl" | "acrylicBaseScaleRatio"
>;

// sample base data for loading
export type WorkspaceSampleBaseDataForLoading = SampleBaseIdForLoading &
  ModelParams &
  TextureParamForLoading &
  AcrylicBaseScaleRatioForLoading &
  ParentId &
  ItemNameForLoading &
  DebugFlag;
export type ShowcaseSampleBaseDataForLoading = SampleBaseIdForLoading &
  ModelParams &
  TextureParamForLoading &
  AcrylicBaseScaleRatioForLoading &
  ParentId &
  ItemNameForLoading &
  DebugFlag;
export type SampleBaseDataForPlacing = SampleBaseIdForLoading &
  ModelParams &
  TextureParam &
  AcrylicBaseScaleRatio &
  ParentId &
  SampleName &
  DebugFlag;

// nft base data for loading
export type NftBaseDataForLoading = NftBaseIdForLoading &
  ModelParams &
  TextureParamForLoading &
  ParentId &
  ItemNameForLoading &
  DebugFlag;
export type NftBaseDataForPlacing = NftBaseIdForLoading &
  ModelParams &
  TextureParam &
  ParentId &
  NftName &
  DebugFlag;

///////////////////////////////////////
// types for additional item data for arrangement

export type DecorationId = {
  id: number;
};

export type ItemTransform = {
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

type ItemStageType = {
  stageType: UnityStageType;
};

type ItemShelfSectionIndex = {
  shelfSectionIndex: number;
};

export type SaidanItemData = ItemBaseData &
  DecorationId &
  ItemTransform &
  ItemStageType &
  ItemShelfSectionIndex;

///////////////////////////////////////
// types for load data with arrangement
export type WorkspaceSampleLoadData = WorkspaceSampleBaseDataForLoading &
  DecorationId &
  ItemTransform &
  ItemStageType;
export type ShowcaseSampleLoadData = ShowcaseSampleBaseDataForLoading &
  DecorationId &
  ItemTransform &
  ItemStageType &
  ItemShelfSectionIndex;

// nft load data
export type NftLoadData = NftBaseDataForLoading &
  DecorationId &
  ItemTransform &
  ItemStageType &
  ItemShelfSectionIndex;

///////////////////////////////////////
// types for item save data
export type SampleSaveData = ItemBaseId &
  DecorationId &
  ItemTransform &
  ItemStageType &
  ItemShelfSectionIndex &
  AcrylicBaseScaleRatio;
export type NftSaveData = ItemBaseId &
  DecorationId &
  ItemTransform &
  ItemStageType &
  ItemShelfSectionIndex;

///////////////////////////////////////
// types for settings data
export type RoomSurfaceParams = {
  tint: string;
};
export type WallpaperSettings = RoomSurfaceParams;
export type FloorSettings = RoomSurfaceParams;

export type LightParams = {
  tint: string;
  brightness: number;
};
export type LightSettings = {
  sceneLight: LightParams;
  pointLight: LightParams;
};

export type SaidanSettings = {
  wallpaper: WallpaperSettings;
  floor: FloorSettings;
  lighting: LightSettings;
};

///////////////////////////////////////
// types for update settings
const SliderUpdatePhase = {
  Updating: 0,
  Ended: 1,
} as const;
type SliderUpdatePhase =
  (typeof SliderUpdatePhase)[keyof typeof SliderUpdatePhase];

export const SettingsUpdatePhase = SliderUpdatePhase;
export type SettingsUpdatePhase =
  (typeof SettingsUpdatePhase)[keyof typeof SettingsUpdatePhase];

export type UpdatingSaidanSettings = SaidanSettings & {
  phase: SettingsUpdatePhase;
};

export type ShowcaseSettings = SaidanSettings;

///////////////////////////////////////
// types for update item transform
export const ItemTransformUpdatePhase = SliderUpdatePhase;
export type ItemTransformUpdatePhase =
  (typeof ItemTransformUpdatePhase)[keyof typeof ItemTransformUpdatePhase];

///////////////////////////////////////
// types for undo redo
export const ActionType = {
  AddItem: 0,
  RemoveItem: 1,
  TranslateItem: 2,
  RotateItem: 3,
  ScaleItem: 4,
  ChangeWallpaperColor: 5,
  ChangeFloorColor: 6,
  ChangeSceneLightColor: 7,
  ChangeSceneLightBrightness: 8,
  ChangePointLightColor: 9,
  ChangePointLightBrightness: 10,
} as const;
export type ActionType = (typeof ActionType)[keyof typeof ActionType];
