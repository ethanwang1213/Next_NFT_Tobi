import { UnitySceneType } from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";

export const useWorkspaceUnityContext = () => {
  const processLoadData = (loadData: any) => {
    if (loadData == null) return null;

    var result = loadData; // TODO(toruto): process data
    return result;
  };

  const { unityProvider, postMessageToUnity, postMessageToLoadData } =
    useSaidanLikeUnityContextBase({
      sceneType: UnitySceneType.Workspace,
    });

  // TODO(toruto): const requestItemThumbnail = () => {};

  const customUnityProvider = {
    unityProvider,
    processLoadData,
    postMessageToLoadData,
  };

  return { customUnityProvider };
};

export const useShowcaseEditUnityContext = () => {
  const processLoadData = (loadData: any) => {
    if (loadData == null) return null;

    var result = loadData; // TODO(toruto): process data
    return result;
  };

  const { unityProvider, postMessageToLoadData } =
    useSaidanLikeUnityContextBase({
      sceneType: UnitySceneType.ShowcaseEdit,
    });

  const customUnityProvider = {
    unityProvider,
    processLoadData,
    postMessageToLoadData,
  };

  return { customUnityProvider };
};
