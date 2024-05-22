import {
  useInternalShowcaseEditContext,
  useInternalUnityContext,
  useInternalWorkspaceContext,
} from "hooks/useCustomUnityContext";
import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";
import { CustomUnityProvider, SaidanLikeData } from "types/adminTypes";

type WorkspaceProps = {
  customUnityProvider: CustomUnityProvider;
  loadData: any; // TODO(toruto): define type
};

type ShowcaseEditProps = {
  customUnityProvider: CustomUnityProvider;
  loadData: any; // TODO(toruto): define type
};

type SaidanLikeProps = {
  id: string;
  unityProvider: UnityProvider;
  loadData: SaidanLikeData | null;
  postMessageToLoadData: (loadData: SaidanLikeData) => void;
};

export const WorkspaceUnity = ({
  customUnityProvider,
  loadData,
}: WorkspaceProps) => {
  const { processedLoadData } = useInternalWorkspaceContext({ loadData });
  return (
    <SaidanLikeUnityBase
      id="workspace"
      unityProvider={customUnityProvider.unityProvider}
      loadData={processedLoadData}
      postMessageToLoadData={customUnityProvider.postMessageToLoadData}
    />
  );
};

export const ShowcaseEditUnity = ({
  customUnityProvider,
  loadData,
}: ShowcaseEditProps) => {
  const { processedLoadData } = useInternalShowcaseEditContext({ loadData });
  return (
    <SaidanLikeUnityBase
      id="showcaseEdit"
      unityProvider={customUnityProvider.unityProvider}
      postMessageToLoadData={customUnityProvider.postMessageToLoadData}
      loadData={processedLoadData}
    />
  );
};

const SaidanLikeUnityBase = ({
  id,
  unityProvider,
  loadData,
  postMessageToLoadData,
}: SaidanLikeProps) => {
  useInternalUnityContext({ loadData, postMessageToLoadData });
  return (
    <Unity id={id} unityProvider={unityProvider} className="w-full h-full" />
  );
};
