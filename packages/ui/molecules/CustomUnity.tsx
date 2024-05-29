import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type SaidanLikeProps = {
  id: string;
  unityProvider: UnityProvider;
};

export const WorkspaceUnity = ({
  unityProvider,
}: {
  unityProvider: UnityProvider;
}) => <SaidanLikeUnityBase id="workspace" unityProvider={unityProvider} />;

export const ShowcaseEditUnity = ({
  unityProvider,
}: {
  unityProvider: UnityProvider;
}) => <SaidanLikeUnityBase id="showcaseEdit" unityProvider={unityProvider} />;

const SaidanLikeUnityBase = ({ id, unityProvider }: SaidanLikeProps) => (
  <Unity id={id} unityProvider={unityProvider} className="w-full h-full" />
);
