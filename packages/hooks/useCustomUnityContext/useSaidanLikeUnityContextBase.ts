import { UnitySceneType } from "./unityType";
import { useCustomUnityContextBase } from "./useCustomUnityContextBase";

export const useSaidanLikeUnityContextBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  const { unityProvider, postMessageToUnity } = useCustomUnityContextBase({
    sceneType,
  });

  // TODO(toruto): const placeNewItem = () => {};
  // TODO(toruto): const removeItems = () => {};
  // TODO(toruto): const requestSaveData = () => {};
  // TODO(toruto): const processLoadData = () => {};

  const postMessageToLoadData = (loadData: any) => {
    // TODO(toruto): post message to Unity side
  };

  return { unityProvider, postMessageToUnity, postMessageToLoadData };
};
