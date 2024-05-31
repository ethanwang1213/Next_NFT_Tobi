import { useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { UnityMessageJson, UnityMessageType } from "./types";

type EventListener = (
  eventName: string,
  callback: (
    ...parameters: ReactUnityEventParameter[]
  ) => ReactUnityEventParameter,
) => void;

type MessageHandler = (msgObj: UnityMessageJson) => void;

type Props = {
  addEventListener: EventListener;
  removeEventListener: EventListener;
  handleSimpleMessage: MessageHandler;
  handleSceneIsLoaded: () => void;
  handleSaveDataGenerated?: MessageHandler;
  handleItemThumbnailGenerated?: MessageHandler;
  handleRemoveItemEnabled?: () => void;
  handleRemoveItemDisabled?: () => void;
  handleRemoveItemRequested?: MessageHandler;
  handleItemMenuXRequested?: () => void;
};

export const useUnityMessageHandler = ({
  addEventListener,
  removeEventListener,
  handleSimpleMessage,
  handleSceneIsLoaded,
  handleSaveDataGenerated,
  handleItemThumbnailGenerated,
  handleRemoveItemEnabled,
  handleRemoveItemDisabled,
  handleRemoveItemRequested,
  handleItemMenuXRequested,
}: Props) => {
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
          if (handleItemThumbnailGenerated) {
            handleItemThumbnailGenerated(msgObj);
          }
          return;
        case UnityMessageType.RemoveItemEnabled:
          if (handleRemoveItemEnabled) {
            handleRemoveItemEnabled();
          }
          return;
        case UnityMessageType.RemoveItemDisabled:
          if (handleRemoveItemDisabled) {
            handleRemoveItemDisabled();
          }
          return;
        case UnityMessageType.RemoveItemRequested:
          if (handleRemoveItemRequested) {
            handleRemoveItemRequested(msgObj);
          }
          return;
        case UnityMessageType.ItemMenuXRequested:
          if (handleItemMenuXRequested) {
            handleItemMenuXRequested();
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
      handleRemoveItemEnabled,
      handleRemoveItemDisabled,
      handleRemoveItemRequested,
      handleItemMenuXRequested,
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
