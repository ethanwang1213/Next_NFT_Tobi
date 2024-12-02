import { CustomUnityContextType, UnitySceneType } from "../types";
import { useCustomUnityHookBase } from "../useCustomUnityHookBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useRequestNftModelGeneration } from "./useRequestNftModelGeneration";

export const useNftModelGeneratorUnityHook = ({
  unityContext,
  onNftModelGenerated,
}: {
  unityContext: CustomUnityContextType;
  onNftModelGenerated?: (itemId: number, nftModelBase64: string) => void;
}) => {
  const {
    // functions
    postMessageToUnity,
    // event handler
    handleSimpleMessage,
  } = useCustomUnityHookBase({
    unityContext,
    sceneType: UnitySceneType.NftModelGenerator,
  });

  const {
    isSceneOpen,
    requestNftModelGeneration,
    handleSceneIsLoaded,
    handleNftModelGenerated,
  } = useRequestNftModelGeneration({
    isLoaded: unityContext.isLoaded,
    postMessageToUnity,
    onNftModelGenerated,
  });

  useUnityMessageHandler({
    sceneType: UnitySceneType.NftModelGenerator,
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleNftModelGenerated,
  });

  return {
    isSceneOpen,
    requestNftModelGeneration,
  };
};
