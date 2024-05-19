import { useEffect } from "react";
import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type WorkspaceProps = {
  customUnityProvider: {
    unityProvider: UnityProvider;
    postMessageToLoadData: (loadData: any) => void;
  };
  loadData: any; // TODO(toruto): define type
};

type ShowcaseEditProps = {
  customUnityProvider: {
    unityProvider: UnityProvider;
    postMessageToLoadData: (loadData: any) => void;
  };
  loadData: any; // TODO(toruto): define type
};

type SaidanLikeProps = {
  customUnityProvider: {
    unityProvider: UnityProvider;
    postMessageToLoadData: (loadData: any) => void;
  };
  loadData: any; // TODO(toruto): define type
};

export const WorkspaceUnity = ({
  customUnityProvider,
  loadData,
}: WorkspaceProps) => {
  useEffect(() => {
    customUnityProvider.postMessageToLoadData(loadData);
  }, [customUnityProvider, loadData]);

  return (
    <SaidanLikeUnityBase
      customUnityProvider={customUnityProvider}
      loadData={loadData}
    />
  );
};

export const ShowcaseEditUnity = ({
  customUnityProvider,
  loadData,
}: ShowcaseEditProps) => {
  useEffect(() => {
    customUnityProvider.postMessageToLoadData(loadData);
  }, [customUnityProvider, loadData]);

  return (
    <SaidanLikeUnityBase
      customUnityProvider={customUnityProvider}
      loadData={loadData}
    />
  );
};

const SaidanLikeUnityBase = ({ customUnityProvider }: SaidanLikeProps) => {
  return (
    <Unity
      unityProvider={customUnityProvider.unityProvider}
      className="w-full h-full"
    />
  );
};
