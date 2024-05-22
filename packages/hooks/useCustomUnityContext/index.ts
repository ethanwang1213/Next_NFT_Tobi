import { CustomUnityProvider } from "types/adminTypes";
import { UnitySceneType } from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";

export const useWorkspaceUnityContext = () => {
  const { unityProvider, postMessageToLoadData } =
    useSaidanLikeUnityContextBase({
      sceneType: UnitySceneType.Workspace,
    });

  // TODO(toruto): const requestItemThumbnail = () => {};

  const customUnityProvider: CustomUnityProvider = {
    unityProvider,
    postMessageToLoadData,
  };

  return { customUnityProvider };
};

export const useShowcaseEditUnityContext = () => {
  const { unityProvider, postMessageToLoadData } =
    useSaidanLikeUnityContextBase({
      sceneType: UnitySceneType.ShowcaseEdit,
    });

  const customUnityProvider: CustomUnityProvider = {
    unityProvider,
    postMessageToLoadData,
  };

  return { customUnityProvider };
};

export {
  useInternalShowcaseEditContext,
  useInternalUnityContext,
  useInternalWorkspaceContext,
} from "./useInternalUnityContext";
