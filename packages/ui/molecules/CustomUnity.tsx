import { useEffect } from "react";
import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type Props = {
  customUnityProvider: {
    unityProvider: UnityProvider;
    postMessageToLoadData: (loadData: any) => void;
  };
  loadData: any; // TODO(toruto): define type
};

export const WorkspaceUnity = ({ customUnityProvider, loadData }: Props) => {
  return (
    <SaidanLikeUnityBase
      customUnityProvider={customUnityProvider}
      loadData={loadData}
    />
  );
};

export const ShowcaseEditUnity = ({ customUnityProvider, loadData }: Props) => {
  return (
    <SaidanLikeUnityBase
      customUnityProvider={customUnityProvider}
      loadData={loadData}
    />
  );
};

const SaidanLikeUnityBase = ({ customUnityProvider, loadData }: Props) => {
  useEffect(() => {
    customUnityProvider.postMessageToLoadData(loadData);
  }, []);

  return (
    <Unity
      unityProvider={customUnityProvider.unityProvider}
      className="w-full h-full"
    />
  );
};
