import { UnitySceneType } from "../types";
import { useCustomUnityContextBase } from "../useCustomUnityContextBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useRequestNftModelGeneration } from "./useRequestNftModelGeneration";

export const useNftModelGeneratorUnityContext = ({
  onNftModelGenerated,
}: {
  onNftModelGenerated?: (itemId: number, nftModelBase64: string) => void;
}) => {
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
    sceneType: UnitySceneType.NftModelGenerator,
  });

  const {
    isSceneOpen,
    requestNftModelGeneration,
    handleSceneIsLoaded,
    handleNftModelGenerated,
  } = useRequestNftModelGeneration({
    isLoaded,
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
    unityProvider,
    isSceneOpen,
    requestNftModelGeneration,
  };
};
