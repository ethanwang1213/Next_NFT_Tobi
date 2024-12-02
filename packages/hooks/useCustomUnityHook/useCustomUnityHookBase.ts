import { useCallback, useEffect, useRef } from "react";
import { useUnityContext } from "react-unity-webgl";
import {
  CustomUnityContextType,
  MessageDestination,
  UnityMessageJson,
  UnitySceneType,
} from "./types";

export const useCustomUnityHookBase = ({
  unityContext,
  sceneType,
}: {
  unityContext: CustomUnityContextType;
  sceneType: UnitySceneType;
}) => {
  const {
    // functions
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handler
    handleSimpleMessage,
  } = usePrivateHook({ unityContext, sceneType });

  return {
    // functions
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handlers
    handleSimpleMessage,
  };
};

export const useSecondaryCustomUnityHookBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  // const buildFilePath = "/admin/unity/build/webgl";
  const buildFilePath =
    "https://storage.googleapis.com/tobiratory-dev_media/unity-builds/admin/webgl";

  const unityContext = useUnityContext({
    loaderUrl: `${buildFilePath}.loader.js`,
    dataUrl: `${buildFilePath}.data`,
    frameworkUrl: `${buildFilePath}.framework.js`,
    codeUrl: `${buildFilePath}.wasm`,
  });

  const { unityProvider, isLoaded, unload } = unityContext;

  const {
    // states
    isLoadedRef,
    isUnloadedRef,
    // functions
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handler
    handleSimpleMessage,
  } = usePrivateHook({ unityContext, sceneType });

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
      console.log("wrapped unload: " + isLoadedRef.current);
      if (!isLoadedRef.current) return;
      console.log("wrapped unload run");
      isUnloadedRef.current = true;
      await unload();
    },
    // event handler
    handleSimpleMessage,
  };
};

const usePrivateHook = ({
  unityContext,
  sceneType,
}: {
  unityContext: CustomUnityContextType;
  sceneType: UnitySceneType;
}) => {
  const isLoadedRef = useRef<boolean>(false);
  isLoadedRef.current = unityContext.isLoaded;
  const isUnloadedRef = useRef<boolean>(false);

  const handleSimpleMessage = (msgObj: UnityMessageJson) => {
    // console.log(
    //   `Unity: SimpleMessage, ${msgObj.sceneType}, ${msgObj.messageBody}`,
    // );
  };

  const postMessageToUnity = useCallback(
    (gameObject: MessageDestination, message: string) => {
      if (!isLoadedRef.current || isUnloadedRef.current) return;
      unityContext.sendMessage(gameObject, "OnMessageReceived", message);
    },
    [isLoadedRef.current, isUnloadedRef.current, unityContext.sendMessage],
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
    // states
    isLoadedRef,
    isUnloadedRef,
    // functions
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handlers
    handleSimpleMessage,
  };
};
