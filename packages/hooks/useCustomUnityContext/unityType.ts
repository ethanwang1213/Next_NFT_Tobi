export const UnitySceneType = {
  Standby: 0,
  Workspace: 1,
  ShowcaseEdit: 2,
} as const;

export type UnitySceneType =
  (typeof UnitySceneType)[keyof typeof UnitySceneType];

export const UnityMessageType = {
  SimpleMessage: 0,
  SceneIsLoaded: 1,
} as const;

export type UnityMessageType =
  (typeof UnityMessageType)[keyof typeof UnityMessageType];

export const SaidanType = {
  Workspace: 0,
  SaidanFirst: 1,
  SaidanSecond: 2,
  SaidanThird: 3,
  ShowcaseFirst: 4,
  ShowcaseSecond: 5,
  ShowcaseThird: 6,
} as const;
export type SaidanType = (typeof SaidanType)[keyof typeof SaidanType];

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

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

type SaidanItemData = {
  itemType: ItemType;
  itemId: number;
  modelType: ModelType;
  modelUrl: string;
  imageUrl: string;
  stageType: UnityStageType;
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export type SaidanLikeData = {
  saidanId: number;
  saidanType: SaidanType;
  saidanUrl: string;
  saidanItemList: Array<SaidanItemData>;
};
