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

export type MessageDestination =
  | "SwitchSceneMessageReceiver"
  | "LoadSaidanDataMessageReceiver"
  | "SaveSaidanDataMessageReceiver"
  | "ItemThumbnailGenerationMessageReceiver"
  | "NewItemMessageReceiver"
  | "NewItemWithDragMessageReceiver"
  | "RemoveSingleItemMessageReceiver"
  | "RemoveItemsMessageReceiver"
  | "RemoveRecentItemMessageReceiver"
  | "RemovalResultMessageReceiver"
  | "ItemMenuXMessageReceiver"
  | "UpdateItemIdMessageReceiver"
  | "UpdateSettingsMessageReceiver"
  | "InputWasdMessageReceiver"
  | "UndoActionMessageReceiver"
  | "RedoActionMessageReceiver"
  | "DeleteAllActionHistoryMessageReceiver"
  | "PauseInputsMessageReceiver"
  | "ResumeInputsMessageReceiver";

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

/// NOTE(Toruto): All of Workspace, SAIDAN and Showcase views are handled almost the same way in Unity side.
/// So, having all types in a single enum makes them easier to handle.
///
/// And, a saidanType will be used as a value of enum such like SaidanType.SaidanFirst.
/// So, a number of a saidanType will be used only for communication between frontend (database) side and Unity side.
///
/// On database, there are types in each of the three views (saidan: 1, 2, 3, ..., showcase: 1, 2, 3, ...).
/// It is better on database, but there is difference in convenience from Unity side.
///
/// Therefore, I used saidanTypeOffset.

// export const saidanOffset = 10000;
export const showcaseOffset = 20000;
export const SaidanType = {
  // for Workspace
  Workspace: 0,
  // for SAIDAN
  SaidanOpenShelf: 10001,
  SaidanBookShelf: 10002,
  SaidanWallShelf: 10003,
  SaidanCollectionCase: 10004,
  // for Showcase
  ShowcaseWallShelf: 20001,
  ShowcaseOpenShelf: 20002,
  ShowcaseBookShelf: 20003,
  ShowcaseCollectionCase: 20004,
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
