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
    unityAddEventListener,
    unityRemoveEventListener,
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
    unityAddEventListener,
    unityRemoveEventListener,
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
