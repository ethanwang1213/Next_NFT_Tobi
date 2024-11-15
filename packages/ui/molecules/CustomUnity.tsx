import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type ProviderParam = {
  unityProvider: UnityProvider;
  isLoaded: boolean;
};

type IdParam = {
  id: string;
};

export const WorkspaceUnity = ({ unityProvider, isLoaded }: ProviderParam) => (
  <UnityBase id="workspace" unityProvider={unityProvider} isLoaded={isLoaded} />
);

export const ShowcaseEditUnity = ({
  unityProvider,
  isLoaded,
}: ProviderParam) => (
  <UnityBase
    id="showcaseEdit"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
  />
);

export const ItemPreviewUnity = ({
  unityProvider,
  isLoaded,
}: ProviderParam) => (
  <UnityBase
    id="itemPreview"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
  />
);

export const AcrylicBaseSettingsUnity = ({
  unityProvider,
  isLoaded,
}: ProviderParam) => (
  <UnityBase
    id="acrylicBaseSettings"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
  />
);

export const NftModelGeneratorUnity = ({
  unityProvider,
  isLoaded,
}: ProviderParam) => (
  <UnityBase
    id="nftModelGenerator"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
  />
);

const UnityBase = ({
  id,
  unityProvider,
  isLoaded,
}: ProviderParam & IdParam) => (
  <Unity
    id={id}
    unityProvider={unityProvider}
    className="w-full h-full"
    style={{ opacity: isLoaded ? 1 : 0 }}
    tabIndex={-1}
  />
);
