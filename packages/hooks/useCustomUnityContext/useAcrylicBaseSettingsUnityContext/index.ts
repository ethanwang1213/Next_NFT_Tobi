import { UnitySceneType } from "../types";
import { useCustomUnityContextBase } from "../useCustomUnityContextBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useLoadAcrylicStand } from "./useLoadAcrylicStand";
import { useUpdateAcrylicBaseScaleRatio } from "./useUpdateAcrylicBaseScaleRatio";

export const useAcrylicBaseSettingsUnityContext = () => {
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
  } = useCustomUnityContextBase({
    sceneType: UnitySceneType.AcrylicBaseSettings,
  });

  const { isSceneLoaded, defaultItemData, setLoadData, handleSceneIsLoaded } =
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
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
  });

  return {
    isLoaded: isSceneLoaded,
    unityProvider,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData,
    updateAcrylicBaseScaleRatio,
    resetAcrylicBaseScaleRatio,
  };
};
