import { UnitySceneType } from "./unityType";
import { useCustomUnityContextBase } from "./useCustomUnityContextBase";

export const useSaidanLikeUnityContextBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  const { unityProvider, postMessageToUnity, postMessageToLoadData } =
    useCustomUnityContextBase({
      sceneType,
    });

  // TODO(toruto): const placeNewItem = () => {};
  // TODO(toruto): const removeItems = () => {};
  // TODO(toruto): const requestSaveData = () => {};
  // TODO(toruto): const processLoadData = () => {};

  return {
    unityProvider,
    postMessageToUnity,
    postMessageToLoadData,
  };
};
