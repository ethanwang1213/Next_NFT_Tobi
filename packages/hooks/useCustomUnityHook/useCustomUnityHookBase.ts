import { useCustomUnityContext } from "contexts/CustomUnityContext";
import { useCallback, useEffect, useRef } from "react";
import {
  CustomUnityContextType,
  MessageDestination,
  UnityMessageJson,
  UnitySceneType,
} from "./types";
import { useMyUnityContext } from "./useMyUnityContext";

export const useCustomUnityHookBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  const unityContext = useCustomUnityContext();

  const {
    // functions
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handler
    handleSimpleMessage,
  } = usePrivateHook({ unityContext, sceneType });

  useEffect(() => {
    unityContext.setMountedScene(sceneType);
    return () => {
      unityContext.setMountedScene(UnitySceneType.Standby);
    };
    // this effect should run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const unityContext = useMyUnityContext();

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

  const {
    unityProvider,
    isLoaded,
    addEventListener: unityAddEventListener,
    removeEventListener: unityRemoveEventListener,
    unload,
  } = unityContext;

  return {
    // states
    unityProvider,
    isLoaded,
    // functions
    unityAddEventListener,
    unityRemoveEventListener,
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
  unityContext: Omit<CustomUnityContextType, "setMountedScene">;
  sceneType: UnitySceneType;
}) => {
  const isLoadedRef = useRef<boolean>(false);
  isLoadedRef.current = unityContext.isLoaded;
  const isUnloadedRef = useRef<boolean>(false);

  const handleSimpleMessage = useCallback((msgObj: UnityMessageJson) => {
    // console.log(
    //   `Unity: SimpleMessage, ${msgObj.sceneType}, ${msgObj.messageBody}`,
    // );
  }, []);

  const postMessageToUnity = useCallback(
    (gameObject: MessageDestination, message: string) => {
      if (!isLoadedRef.current || isUnloadedRef.current) return;
      unityContext.sendMessage(gameObject, "OnMessageReceived", message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unityContext.sendMessage],
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
    if (!unityContext.isLoaded) return;
    postMessageToSwitchScene(sceneType);
  }, [unityContext.isLoaded, sceneType, postMessageToSwitchScene]);

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
