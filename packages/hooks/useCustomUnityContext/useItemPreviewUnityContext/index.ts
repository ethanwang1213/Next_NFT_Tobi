import { UnitySceneType } from "../types";
import { useCustomUnityContextBase } from "../useCustomUnityContextBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useLoadPreviewItem } from "./useLoadPreviewItem";

export const useItemPreviewUnityContext = () => {
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
    // event handler
    handleSimpleMessage,
  } = useCustomUnityContextBase({
    sceneType: UnitySceneType.ItemPreview,
  });

  const { isSceneLoaded, setLoadData, handleSceneIsLoaded } =
    useLoadPreviewItem({
      isLoaded,
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
    setLoadData,
    pauseUnityInputs,
    resumeUnityInputs,
  };
};
