import { UnitySceneType } from "../types";
import { useCustomUnityHookBase, useSecondaryCustomUnityHookBase } from "../useCustomUnityHookBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useLoadAcrylicStand } from "./useLoadAcrylicStand";
import { useUpdateAcrylicBaseScaleRatio } from "./useUpdateAcrylicBaseScaleRatio";

export const useAcrylicBaseSettingsUnityHook = () => {
  const {
    // states
    unityProvider,
    isLoaded,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    // event handler
    handleSimpleMessage,
  } = useSecondaryCustomUnityHookBase({
    sceneType: UnitySceneType.AcrylicBaseSettings,
  });

  const { isSceneOpen, defaultItemData, setLoadData, handleSceneIsLoaded } =
    useLoadAcrylicStand({
      isLoaded,
      postMessageToUnity,
    });

  const { updateAcrylicBaseScaleRatio, resetAcrylicBaseScaleRatio } =
    useUpdateAcrylicBaseScaleRatio({
      defaultItemData,
      postMessageToUnity,
    });

  useUnityMessageHandler({
    sceneType: UnitySceneType.AcrylicBaseSettings,
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
  });

  return {
    isSceneOpen,
    unityProvider,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData,
    updateAcrylicBaseScaleRatio,
    resetAcrylicBaseScaleRatio,
  };
};
