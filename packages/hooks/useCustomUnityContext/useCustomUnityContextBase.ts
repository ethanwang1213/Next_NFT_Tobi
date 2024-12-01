import { useCallback, useEffect, useRef } from "react";
import { useUnityContext } from "react-unity-webgl";
import { MessageDestination, UnityMessageJson, UnitySceneType } from "./types";

export const useCustomUnityContextBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  // const buildFilePath = "/admin/unity/build/webgl";
  const buildFilePath =
    "https://storage.googleapis.com/tobiratory-dev_media/unity-builds/admin/webgl";
  const {
    unityProvider,
    isLoaded,
    addEventListener,
    removeEventListener,
    sendMessage,
    unload,
  } = useUnityContext({
    loaderUrl: `${buildFilePath}.loader.js`,
    dataUrl: `${buildFilePath}.data`,
    frameworkUrl: `${buildFilePath}.framework.js`,
    codeUrl: `${buildFilePath}.wasm`,
  });

  const isLoadedRef = useRef<boolean>(false);
  isLoadedRef.current = isLoaded;
  const isUnloadedRef = useRef<boolean>(false);

  const handleSimpleMessage = (msgObj: UnityMessageJson) => {
    // console.log(
    //   `Unity: SimpleMessage, ${msgObj.sceneType}, ${msgObj.messageBody}`,
    // );
  };

  const postMessageToUnity = useCallback(
    (gameObject: MessageDestination, message: string) => {
      if (!isLoadedRef.current || isUnloadedRef.current) return;
      sendMessage(gameObject, "OnMessageReceived", message);
    },
    [isLoadedRef.current, isUnloadedRef.current, sendMessage],
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
    if (!isLoaded) return;
    postMessageToSwitchScene(sceneType);
  }, [isLoaded, sceneType, postMessageToSwitchScene]);

  return {
    // states
    unityProvider,
    isLoaded,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    unload: async () => {
      console.log("wrapped unload: ", isLoadedRef.current);
      if (!isLoadedRef.current) return;
      console.log("wrapped unload run");
      isUnloadedRef.current = true;
      await unload();
    },
    // event handlers
    handleSimpleMessage,
  };
};
