import { useCallback, useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import {
  MessageDestination,
  UnityMessageJson,
  UnityMessageType,
  UnitySceneType,
} from "./unityType";

export const useCustomUnityContextBase = ({
  sceneType,
  postMessageToLoadData,
}: {
  sceneType: UnitySceneType;
  // add optional event handlers along with message type
  postMessageToLoadData: (loadData: any) => void;
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

  const resolveUnityMessage = (json: string) => {
    try {
      return JSON.parse(json) as UnityMessageJson;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  // `message` is JSON string formed in Unity side like following:
  // {
  //   "messageType": string,
  //   "sceneType": number,
  //   "messageBody": string or JSON string
  // }
  const handleUnityMessage = useCallback(
    (message: ReactUnityEventParameter) => {
      if (typeof message !== "string") return;
      const msgObj = resolveUnityMessage(message);
      if (!msgObj) return;

      switch (msgObj.messageType) {
        case UnityMessageType.SimpleMessage:
          console.log(
            `Unity: SimpleMessage, ${msgObj.sceneType}, ${msgObj.messageBody}`,
          );
          return;
        // execute event handlers along with message type
        default:
          return;
      }
    },
    [],
  );

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

  // We use only `onUnityMessage` event to receive messages from Unity side.
  useEffect(() => {
    addEventListener("onUnityMessage", handleUnityMessage);
    return () => {
      removeEventListener("onUnityMessage", handleUnityMessage);
    };
  }, [addEventListener, removeEventListener, handleUnityMessage]);

  return { unityProvider, isLoaded, postMessageToUnity };
};
