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
  const sceneType = UnitySceneType.NftModelGenerator;
  const {
    // functions
    postMessageToUnity,
    // event handler
    handleSimpleMessage,
  } = useCustomUnityHookBase({
    sceneType,
  });

  const {
    isLoaded,
    addEventListener: unityAddEventListener,
    removeEventListener: unityRemoveEventListener,
  } = useCustomUnityContext();

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
    sceneType,
    unityAddEventListener,
    unityRemoveEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleNftModelGenerated,
  });

  return {
    isSceneOpen,
    requestNftModelGeneration,
  };
};
