import { UnitySceneType } from "../types";
import { useSecondaryCustomUnityHookBase } from "../useCustomUnityHookBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useLoadPreviewItem } from "./useLoadPreviewItem";

export const useItemPreviewUnityHook = () => {
  const {
    // states
    unityProvider,
    isLoaded,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    unload,
    // event handler
    handleSimpleMessage,
  } = useSecondaryCustomUnityHookBase({
    sceneType: UnitySceneType.ItemPreview,
  });

  const { isSceneOpen, setLoadData, handleSceneIsLoaded } = useLoadPreviewItem({
    isLoaded,
    postMessageToUnity,
  });

  useUnityMessageHandler({
    sceneType: UnitySceneType.ItemPreview,
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
  });

  return {
    isSceneOpen,
    unityProvider,
    setLoadData,
    pauseUnityInputs,
    resumeUnityInputs,
    unload,
  };
};
