import { SaidanItemData } from "types/adminTypes";

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
  RequestToDisplayClearingUI: 4,
  RequestToHideClearingUI: 5,
  RequestToClearItem: 6,
  RequestToFlipOperation: 7,
  ItemThumbnailIsGenerated: 8,
  NftModelIsGenerated: 9,
  RequestToOpenItemDetail: 10,
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

export type SaidanLikeData = {
  saidanId: number;
  saidanType: SaidanType;
  saidanUrl: string;
  saidanItemList: Array<SaidanItemData>;
};
