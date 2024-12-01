import { useCallback, useEffect, useRef } from "react";
import {
  CustomUnityProvider,
  MessageDestination,
  UnityMessageJson,
  UnitySceneType,
} from "./types";

export const useCustomUnityContextBase = ({
  unityProvider,
  sceneType,
}: {
  unityProvider: CustomUnityProvider;
  sceneType: UnitySceneType;
}) => {
  const isLoadedRef = useRef<boolean>(false);
  isLoadedRef.current = unityProvider.isLoaded;

  const handleSimpleMessage = (msgObj: UnityMessageJson) => {
    // console.log(
    //   `Unity: SimpleMessage, ${msgObj.sceneType}, ${msgObj.messageBody}`,
    // );
  };

  const postMessageToUnity = useCallback(
    (gameObject: MessageDestination, message: string) => {
      if (!isLoadedRef.current) return;
      unityProvider.sendMessage(gameObject, "OnMessageReceived", message);
    },
    [isLoadedRef.current, unityProvider.sendMessage],
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

  // pause events
  const pauseUnityInputs = useCallback(() => {
    postMessageToUnity("PauseInputsMessageReceiver", "");
  }, [postMessageToUnity]);

  const resumeUnityInputs = useCallback(() => {
    postMessageToUnity("ResumeInputsMessageReceiver", "");
  }, [postMessageToUnity]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    postMessageToSwitchScene(sceneType);
  }, [isLoadedRef.current, sceneType, postMessageToSwitchScene]);

  return {
    // functions
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handlers
    handleSimpleMessage,
  };
};
