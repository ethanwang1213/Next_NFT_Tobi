import { useEffect } from "react";
import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";
import { SaidanLikeData } from "types/adminTypes";

type WorkspaceProps = {
  customUnityProvider: {
    unityProvider: UnityProvider;
    processLoadData: (loadData: any) => SaidanLikeData | null;
    postMessageToLoadData: (processedLoadData: SaidanLikeData) => void;
  };
  loadData: any; // TODO(toruto): define type
};

type ShowcaseEditProps = {
  customUnityProvider: {
    unityProvider: UnityProvider;
    processLoadData: (loadData: any) => SaidanLikeData | null;
    postMessageToLoadData: (processedLoadData: SaidanLikeData) => void;
  };
  loadData: any; // TODO(toruto): define type
};

type SaidanLikeProps = {
  customUnityProvider: {
    unityProvider: UnityProvider;
    postMessageToLoadData: (loadData: any) => void;
  };
  processedLoadData?: SaidanLikeData;
};

export const WorkspaceUnity = ({
  customUnityProvider,
  loadData,
}: WorkspaceProps) => {
  return (
    <SaidanLikeUnityBase
      customUnityProvider={customUnityProvider}
      processedLoadData={customUnityProvider.processLoadData(loadData)}
    />
  );
};

export const ShowcaseEditUnity = ({
  customUnityProvider,
  loadData,
}: ShowcaseEditProps) => {
  return (
    <SaidanLikeUnityBase
      customUnityProvider={customUnityProvider}
      processedLoadData={customUnityProvider.processLoadData(loadData)}
    />
  );
};

const SaidanLikeUnityBase = ({
  customUnityProvider,
  processedLoadData,
}: SaidanLikeProps) => {
  useEffect(() => {
    customUnityProvider.postMessageToLoadData(processedLoadData);
  }, [customUnityProvider, processedLoadData]);

  return (
    <Unity
      unityProvider={customUnityProvider.unityProvider}
      className="w-full h-full"
    />
  );
};
