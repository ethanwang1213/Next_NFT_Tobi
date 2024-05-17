import { UnitySceneType } from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";

export const useWorkspaceUnityContext = () => {
  const { customUnityProvider, postMessageToUnity } =
    useSaidanLikeUnityContextBase({
      sceneType: UnitySceneType.Workspace,
    });

  // TODO(toruto): const requestItemThumbnail = () => {};

  return { customUnityProvider };
};

export const useShowcaseEditUnityContext = () => {
  const { customUnityProvider } = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.ShowcaseEdit,
  });

  return { customUnityProvider };
};
