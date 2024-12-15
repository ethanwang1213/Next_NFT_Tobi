import { useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import {
  UnityEventListener,
  UnityMessageJson,
  UnityMessageType,
  UnitySceneType,
} from "./types";

type MessageHandler = (msgObj: UnityMessageJson) => void;

type Props = {
  sceneType: UnitySceneType;
  unityAddEventListener: UnityEventListener;
  unityRemoveEventListener: UnityEventListener;
  handleSimpleMessage: MessageHandler;
  handleSceneIsLoaded: () => void;
  handleSaveDataGenerated?: MessageHandler;
  handleItemSelected?: MessageHandler;
  handleRemoveItemEnabled?: () => void;
  handleRemoveItemDisabled?: () => void;
  handleRemoveItemRequested?: MessageHandler;
  handleItemThumbnailGenerated?: MessageHandler;
  handleNftModelGenerated?: MessageHandler;
  handleDragPlacingStarted?: () => void;
  handleDragPlacingEnded?: () => void;
  handleActionRegistered?: () => void;
  handleActionUndone?: MessageHandler;
  handleActionRedone?: MessageHandler;
  handleItemTransformUpdated?: MessageHandler;
  handleSaidanDetailViewIsInitialized?: () => void;
  handleLoadingCompleted?: () => void;
  handleCheckConnection?: () => void;
};

export const useUnityMessageHandler = ({
  sceneType,
  unityAddEventListener,
  unityRemoveEventListener,
  handleSimpleMessage,
  handleSceneIsLoaded,
  handleSaveDataGenerated,
  handleItemSelected,
  handleRemoveItemEnabled,
  handleRemoveItemDisabled,
  handleRemoveItemRequested,
  handleItemThumbnailGenerated,
  handleNftModelGenerated,
  handleDragPlacingStarted,
  handleDragPlacingEnded,
  handleActionRegistered,
  handleActionUndone,
  handleActionRedone,
  handleItemTransformUpdated,
  handleSaidanDetailViewIsInitialized,
  handleLoadingCompleted,
  handleCheckConnection,
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
      if (!msgObj || msgObj.sceneType !== sceneType) return;

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
        case UnityMessageType.ItemIsSelected:
          handleItemSelected?.(msgObj);
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
        case UnityMessageType.ItemThumbnailIsGenerated:
          handleItemThumbnailGenerated?.(msgObj);
          return;
        case UnityMessageType.NftModelIsGenerated:
          handleNftModelGenerated?.(msgObj);
          return;
        case UnityMessageType.DragStarted:
          handleDragPlacingStarted?.();
          return;
        case UnityMessageType.DragEnded:
          handleDragPlacingEnded?.();
          return;
        case UnityMessageType.ActionRegistered:
          handleActionRegistered?.();
          return;
        case UnityMessageType.ActionUndone:
          handleActionUndone?.(msgObj);
          return;
        case UnityMessageType.ActionRedone:
          handleActionRedone?.(msgObj);
          return;
        case UnityMessageType.ItemTransformUpdated:
          handleItemTransformUpdated?.(msgObj);
          return;
        case UnityMessageType.SaidanDetailViewIsInitialized:
          handleSaidanDetailViewIsInitialized?.();
          return;
        case UnityMessageType.LoadingCompleted:
          handleLoadingCompleted?.();
          return;
        case UnityMessageType.CheckConnection:
          handleCheckConnection?.();
          return;
        default:
          return;
      }
    },
    [
      sceneType,
      resolveUnityMessage,
      handleSimpleMessage,
      handleSceneIsLoaded,
      handleSaveDataGenerated,
      handleItemSelected,
      handleRemoveItemEnabled,
      handleRemoveItemDisabled,
      handleRemoveItemRequested,
      handleItemThumbnailGenerated,
      handleNftModelGenerated,
      handleDragPlacingStarted,
      handleDragPlacingEnded,
      handleActionRegistered,
      handleActionUndone,
      handleActionRedone,
      handleItemTransformUpdated,
      handleSaidanDetailViewIsInitialized,
      handleLoadingCompleted,
      handleCheckConnection,
    ],
  );

  // We use only `onUnityMessage` event to receive messages from Unity side.
  useEffect(() => {
    unityAddEventListener("onUnityMessage", handleUnityMessage);
    return () => {
      unityRemoveEventListener("onUnityMessage", handleUnityMessage);
    };
  }, [unityAddEventListener, unityRemoveEventListener, handleUnityMessage]);

  return;
};
