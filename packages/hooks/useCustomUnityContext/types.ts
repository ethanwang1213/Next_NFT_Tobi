import {
  ActionType,
  FloorSettings,
  ItemBaseId,
  ItemPosture,
  ItemTypeParam,
  LightParams,
  SaidanItemData,
  SaidanSettings,
  Vector3,
  WallpaperSettings,
} from "types/unityTypes";

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
  SaidanSaveDataIsGenerated: 2,
  ItemIsSelected: 3,
  RemoveItemEnabled: 4,
  RemoveItemDisabled: 5,
  RemoveItemRequested: 6,
  RequestToFlipOperation: 7,
  ItemThumbnailIsGenerated: 8,
  NftModelIsGenerated: 9,
  RequestToOpenItemDetail: 10,
  DragStarted: 11,
  DragEnded: 12,
  ScreenshotTaken: 13,
  ActionRegistered: 14,
  ActionUndone: 15,
  ActionRedone: 16,
} as const;
export type UnityMessageType =
  (typeof UnityMessageType)[keyof typeof UnityMessageType];

export type UnityMessageJson = {
  sceneType: UnitySceneType;
  messageType: UnityMessageType;
  messageBody: string;
};

export type MessageBodyForSavingSaidanData = {
  saidanData: SaidanLikeData;
  saidanThumbnailBase64: string;
};

// export const saidanOffset = 10000;
export const showcaseOffset = 20000;
export const SaidanType = {
  Workspace: 0,
  SaidanFirst: 10001,
  SaidanSecond: 10002,
  SaidanThird: 10003,
  ShowcaseFirst: 20001,
  ShowcaseSecond: 20002,
  ShowcaseThird: 20003,
} as const;
export type SaidanType = (typeof SaidanType)[keyof typeof SaidanType];

export type SaidanLikeData = {
  saidanId: number;
  saidanType: SaidanType;
  saidanUrl: string;
  saidanItemList: SaidanItemData[];
  saidanCameraData: {
    position: Vector3;
    rotation: Vector3;
  };
  saidanSettings: SaidanSettings;
  isDebug: boolean;
};

export type UndoneRedoneResult = {
  item?: Partial<ItemTypeParam & ItemBaseId & Omit<ItemPosture, "stageType">>;
  settings?: Partial<{
    wallpaper?: Partial<WallpaperSettings>;
    floor?: Partial<FloorSettings>;
    lighting?: Partial<{
      sceneLight?: Partial<LightParams>;
      pointLight?: Partial<LightParams>;
    }>;
  }>;
};

export type RequiredUndoneRedoneResult = {
  item: ItemTypeParam & ItemBaseId & Omit<ItemPosture, "stageType">;
  settings: SaidanSettings;
};

export type UndoneOrRedone = (
  actionType: ActionType,
  text: string,
  result: UndoneRedoneResult,
) => void;
