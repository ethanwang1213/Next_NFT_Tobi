import { UnitySceneType } from "../types";
import { useSecondaryCustomUnityHookBase } from "../useCustomUnityHookBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useLoadAcrylicStand } from "./useLoadAcrylicStand";
import { useUpdateAcrylicBaseScaleRatio } from "./useUpdateAcrylicBaseScaleRatio";

export const useAcrylicBaseSettingsUnityHook = () => {
  const {
    // states
    unityProvider,
    isLoaded,
    // functions
    unityAddEventListener,
    unityRemoveEventListener,
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
    unityAddEventListener,
    unityRemoveEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
  });

  return {
    isSceneOpen,
    unityProvider,
    setLoadData,
    updateAcrylicBaseScaleRatio,
    resetAcrylicBaseScaleRatio,
  };
};
