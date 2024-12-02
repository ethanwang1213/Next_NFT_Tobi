import { useCustomUnityContext } from "contexts/CustomUnityContext";
import { UnitySceneType } from "../types";
import { useCustomUnityHookBase } from "../useCustomUnityHookBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useRequestNftModelGeneration } from "./useRequestNftModelGeneration";

export const useNftModelGeneratorUnityHook = ({
  onNftModelGenerated,
}: {
  onNftModelGenerated?: (itemId: number, nftModelBase64: string) => void;
}) => {
  const {
    // functions
    postMessageToUnity,
    // event handler
    handleSimpleMessage,
  } = useCustomUnityHookBase({
    sceneType: UnitySceneType.NftModelGenerator,
  });

  const { isLoaded } = useCustomUnityContext();

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
    isSceneOpen,
    requestNftModelGeneration,
  };
};
