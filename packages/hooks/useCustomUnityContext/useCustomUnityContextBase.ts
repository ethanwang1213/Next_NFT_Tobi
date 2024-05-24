import { useCallback, useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";
import { UnityMessageJson, UnitySceneType } from "./types";

type MessageDestination =
  | "SwitchSceneMessageReceiver"
  | "LoadSaidanDataMessageReceiver"
  | "SaveSaidanDataMessageReceiver"
  | "ItemThumbnailGenerationMessageReceiver"
  | "NewItemMessageReceiver"
  | "RemoveSingleItemMessageReceiver"
  | "RemoveItemsByIdMessageReceiver";

export const useCustomUnityContextBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  const buildFilePath = "/admin/unity/build/webgl";
  const {
    unityProvider,
    isLoaded,
    addEventListener,
    removeEventListener,
    sendMessage,
  } = useUnityContext({
    loaderUrl: `${buildFilePath}.loader.js`,
    dataUrl: `${buildFilePath}.data`,
    frameworkUrl: `${buildFilePath}.framework.js`,
    codeUrl: `${buildFilePath}.wasm`,
  });

  const handleSimpleMessage = (msgObj: UnityMessageJson) => {
    console.log(
      `Unity: SimpleMessage, ${msgObj.sceneType}, ${msgObj.messageBody}`,
    );
  };

  const postMessageToUnity = useCallback(
    (gameObject: MessageDestination, message: string) => {
      if (!isLoaded) return;
      sendMessage(gameObject, "OnMessageReceived", message);
    },
    [isLoaded, sendMessage],
  );

  const postMessageToSwitchScene = useCallback(
    (destSceneType: UnitySceneType) => {
      const json = JSON.stringify({
        sceneType: destSceneType,
      });
      postMessageToUnity("SwitchSceneMessageReceiver", json);
    },
    [postMessageToUnity],
  );

  useEffect(() => {
    if (!isLoaded) return;
    postMessageToSwitchScene(sceneType);
  }, [isLoaded, sceneType, postMessageToSwitchScene]);

  return {
    unityProvider,
    isLoaded,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    handleSimpleMessage,
  };
};
