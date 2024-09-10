import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type ProviderParam = {
  unityProvider: UnityProvider;
};

type IdParam = {
  id: string;
};

export const WorkspaceUnity = ({ unityProvider }: ProviderParam) => (
  <UnityBase id="workspace" unityProvider={unityProvider} />
);

export const ShowcaseEditUnity = ({ unityProvider }: ProviderParam) => (
  <UnityBase id="showcaseEdit" unityProvider={unityProvider} />
);

export const ItemPreviewUnity = ({ unityProvider }: ProviderParam) => (
  <UnityBase id="itemPreview" unityProvider={unityProvider} />
);

const UnityBase = ({ id, unityProvider }: ProviderParam & IdParam) => (
  <Unity id={id} unityProvider={unityProvider} className="w-full h-full" />
);
