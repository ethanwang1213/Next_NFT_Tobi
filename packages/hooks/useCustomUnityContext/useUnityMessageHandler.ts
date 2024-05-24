import { useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { UnityMessageJson, UnityMessageType } from "./unityType";

export const useUnityMessageHandler = ({
  addEventListener,
  removeEventListener,
  handleSimpleMessage,
  handleSceneIsLoaded,
  handleSaveDataGenerated,
  handleItemThumbnailGenerated,
}: {
  addEventListener: (
    eventName: string,
    callback: (
      ...parameters: ReactUnityEventParameter[]
    ) => ReactUnityEventParameter,
  ) => void;
  removeEventListener: (
    eventName: string,
    callback: (
      ...parameters: ReactUnityEventParameter[]
    ) => ReactUnityEventParameter,
  ) => void;
  handleSimpleMessage: (msgObj: UnityMessageJson) => void;
  handleSceneIsLoaded: () => void;
  handleSaveDataGenerated?: (msgObj: UnityMessageJson) => void;
  handleItemThumbnailGenerated?: (msgObj: UnityMessageJson) => void;
}) => {
  const resolveUnityMessage = useCallback((json: string) => {
    try {
      return JSON.parse(json) as UnityMessageJson;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, []);

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

      // execute event handlers along with message type
      switch (msgObj.messageType) {
        case UnityMessageType.SimpleMessage:
          handleSimpleMessage(msgObj);
          return;
        case UnityMessageType.SceneIsLoaded:
          handleSceneIsLoaded();
          return;
        case UnityMessageType.SaidanSaveDataIsGenerated:
          if (handleSaveDataGenerated) {
            handleSaveDataGenerated(msgObj);
          }
          return;
        case UnityMessageType.ItemThumbnailIsGenerated:
          if (!handleItemThumbnailGenerated) {
            handleItemThumbnailGenerated(msgObj);
          }
          return;
        default:
          return;
      }
    },
    [
      resolveUnityMessage,
      handleSimpleMessage,
      handleSceneIsLoaded,
      handleSaveDataGenerated,
      handleItemThumbnailGenerated,
    ],
  );

  // We use only `onUnityMessage` event to receive messages from Unity side.
  useEffect(() => {
    addEventListener("onUnityMessage", handleUnityMessage);
    return () => {
      removeEventListener("onUnityMessage", handleUnityMessage);
    };
  }, [addEventListener, removeEventListener, handleUnityMessage]);

  return;
};
