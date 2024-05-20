export type UnityMessageJson = {
  sceneType: UnitySceneType;
  messageType: UnityMessageType;
  messageBody: string;
};

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

export type MessageDestination = "SwitchSceneMessageReceiver";
