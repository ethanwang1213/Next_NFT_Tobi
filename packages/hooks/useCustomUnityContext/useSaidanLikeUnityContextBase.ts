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

  const processLoadData = (loadData: any) => {
    var result = loadData; // TODO(toruto): process data
    return result;
  };
  const postMessageToLoadData = (loadData: any) => {
    const processedLoadData = processLoadData(loadData);
    // TODO(toruto): post message to Unity side
  };

  const customUnityProvider = {
    unityProvider,
    postMessageToLoadData,
  };

  return { customUnityProvider, postMessageToUnity };
};
