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
  handleDragPlacingStarted?: () => void;
  handleDragPlacingEnded?: () => void;
  handleRemoveItemEnabled?: () => void;
  handleRemoveItemDisabled?: () => void;
  handleRemoveItemRequested?: MessageHandler;
  handleItemSelected?: MessageHandler;
  handleActionUndone?: MessageHandler;
  handleActionRedone?: MessageHandler;
};

export const useUnityMessageHandler = ({
  addEventListener,
  removeEventListener,
  handleSimpleMessage,
  handleSceneIsLoaded,
  handleSaveDataGenerated,
  handleItemThumbnailGenerated,
  handleDragPlacingStarted,
  handleDragPlacingEnded,
  handleRemoveItemEnabled,
  handleRemoveItemDisabled,
  handleRemoveItemRequested,
  handleItemSelected,
  handleActionUndone,
  handleActionRedone,
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
          handleSaveDataGenerated?.(msgObj);
          return;
        case UnityMessageType.ItemThumbnailIsGenerated:
          handleItemThumbnailGenerated?.(msgObj);
          return;
        case UnityMessageType.RemoveItemEnabled:
          handleRemoveItemEnabled?.();
          return;
        case UnityMessageType.RemoveItemDisabled:
          handleRemoveItemDisabled?.();
          return;
        case UnityMessageType.RemoveItemRequested:
          handleRemoveItemRequested?.(msgObj);
          return;
        case UnityMessageType.DragStarted:
          handleDragPlacingStarted?.();
          return;
        case UnityMessageType.DragEnded:
          handleDragPlacingEnded?.();
          return;
        case UnityMessageType.ItemIsSelected:
          handleItemSelected?.(msgObj);
          return;
        case UnityMessageType.ActionUndone:
          handleActionUndone?.(msgObj);
          return;
        case UnityMessageType.ActionRedone:
          handleActionRedone?.(msgObj);
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
      handleDragPlacingStarted,
      handleDragPlacingEnded,
      handleRemoveItemEnabled,
      handleRemoveItemDisabled,
      handleRemoveItemRequested,
      handleItemSelected,
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
