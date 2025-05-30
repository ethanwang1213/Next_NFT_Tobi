import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";
import {
  ActionType,
  DecorationId,
  FloorSettings,
  ItemBaseId,
  ItemTransform,
  ItemTypeParam,
  LightParams,
  ParentId,
  SaidanItemData,
  SaidanSettings,
  Vector3,
  WallpaperSettings,
} from "types/unityTypes";

export type UnityEventListener = (
  eventName: string,
  callback: (
    ...parameters: ReactUnityEventParameter[]
  ) => ReactUnityEventParameter,
) => void;

export type CustomUnityContextType = {
  unityProvider: UnityProvider;
  isLoaded: boolean;
  addEventListener: UnityEventListener;
  removeEventListener: UnityEventListener;
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: ReactUnityEventParameter,
  ) => void;
  setMountedScene: React.Dispatch<React.SetStateAction<UnitySceneType>>;
};

export const UnitySceneType = {
  Standby: 0,
  Workspace: 1,
  ShowcaseEdit: 2,
  ItemPreview: 3,
  AcrylicBaseSettings: 4,
  NftModelGenerator: 5,
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
  | "DuplicateSelectedItemMessageReceiver"
  | "RemoveSingleItemMessageReceiver"
  | "RemoveItemsMessageReceiver"
  | "RemoveRecentItemMessageReceiver"
  | "RemoveSelectedItemMessageReceiver"
  | "NotifyRemoveRequestResultMessageReceiver"
  | "ItemMenuXMessageReceiver"
  | "NotifyAddRequestResultMessageReceiver"
  | "UpdateSettingsMessageReceiver"
  | "InputWasdMessageReceiver"
  | "UndoActionMessageReceiver"
  | "RedoActionMessageReceiver"
  | "DeleteAllActionHistoryMessageReceiver"
  | "PauseInputsMessageReceiver"
  | "ResumeInputsMessageReceiver"
  | "UpdateItemTransformMessageReceiver"
  | "ViewItemModelMessageReceiver"
  | "LoadAcrylicStandMessageReceiver"
  | "UpdateAcrylicBaseScaleRatioMessageReceiver"
  | "NftModelGenerationMessageReceiver"
  | "ShowSmartphoneAreaMessageReceiver"
  | "MouseUpMessageReceiver"
  | "HighlightItemsMessageReceiver"
  | "ConnectionCheckedMessageReceiver";

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
  ItemTransformUpdated: 17,
  SaidanDetailViewIsInitialized: 18,
  SaidanDetailViewIsEnded: 19,
  SwitchDisplayFromThumbnail: 20,
  LoadingCompleted: 21,
  CheckConnection: 22,
  Vibration: 23,
  IntMaxActionHistory: 24,
} as const;
export type UnityMessageType =
  (typeof UnityMessageType)[keyof typeof UnityMessageType];

export type UnityMessageJson = {
  sceneType: UnitySceneType;
  messageType: UnityMessageType;
  messageBody: string;
};

export type NewItemInfo = ItemTypeParam &
  ItemBaseId &
  DecorationId & {
    apiRequestId: number;
  };

export type MessageBodyForSavingSaidanData = {
  saidanData: SaidanLikeData;
  fixedPointSaidanThumbnailBase64: string;
  lastPointSaidanThumbnailBase64: string;
  newItemInfo: NewItemInfo;
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
  SaidanSmallWallShelf: 10001,
  SaidanBoxWallShelf: 10002,
  SaidanOpenShelf: 10003,
  // for Showcase
  ShowcaseWallShelf: 20001,
} as const;
export type SaidanType = (typeof SaidanType)[keyof typeof SaidanType];

// Currently, only White will be used in admin.
export const SaidanTextureType = {
  White: 1,
  Wood: 2,
  Black: 3,
};
export type SaidanTextureType =
  (typeof SaidanTextureType)[keyof typeof SaidanTextureType];

export type SaidanLikeData = {
  saidanId: number;
  saidanType: SaidanType;
  saidanUrl: string;
  saidanTextureType: SaidanTextureType;
  saidanItemList: SaidanItemData[];
  saidanCameraData: {
    position: Vector3;
    rotation: Vector3;
  };
  saidanSettings: SaidanSettings;
  isDebug: boolean;
};

export type PositionOnPlane = {
  x: number;
  y: number;
};

export type SelectedItem = ItemTypeParam &
  ItemBaseId &
  ParentId &
  DecorationId & {
    positionOnPlane: PositionOnPlane;
    rotationAngle: number;
    scale: number;
    isUpdatedFromFrontend: boolean;
  };

export type UndoneRedoneResult = {
  item?: Partial<ItemTypeParam & ItemBaseId & ItemTransform>;
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
  item: ItemTypeParam & ItemBaseId & ItemTransform;
  settings: SaidanSettings;
};

export type UndoneOrRedoneHandler = (
  actionType: ActionType,
  text: string,
  result: UndoneRedoneResult,
) => void;

export type NftModelGeneratedHandler = (
  itemId: number,
  nftModelBase64: string,
) => void;
