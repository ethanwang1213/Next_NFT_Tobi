import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type ProviderParam = {
  unityProvider: UnityProvider;
  isLoaded: boolean;
  handleMouseUp?: () => void;
};

type IdParam = {
  id: string;
};

export const WorkspaceUnity = ({
  unityProvider,
  isLoaded,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="workspace"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
    handleMouseUp={handleMouseUp}
  />
);

export const ShowcaseEditUnity = ({
  unityProvider,
  isLoaded,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="showcaseEdit"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
    handleMouseUp={handleMouseUp}
  />
);

export const ItemPreviewUnity = ({
  unityProvider,
  isLoaded,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="itemPreview"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
    handleMouseUp={handleMouseUp}
  />
);

export const AcrylicBaseSettingsUnity = ({
  unityProvider,
  isLoaded,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="acrylicBaseSettings"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
    handleMouseUp={handleMouseUp}
  />
);

export const NftModelGeneratorUnity = ({
  unityProvider,
  isLoaded,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="nftModelGenerator"
    unityProvider={unityProvider}
    isLoaded={isLoaded}
    handleMouseUp={handleMouseUp}
  />
);

const UnityBase = ({
  id,
  unityProvider,
  isLoaded,
  handleMouseUp,
}: ProviderParam & IdParam) => {
  // NOTE(toruto): After unmount ShowcaseEditUnity, screen will be freezed...
  // useEffect(() => {
  //   return () => {
  //     if (!!unload) {
  //       unload()
  //         .then(() => {
  //           console.log(`Unity ${id} is unloaded.`);
  //         })
  //         .catch((e) => {
  //           console.error(`Failed to unload Unity ${id}.`, e);
  //         });
  //     }
  //   };
  // }, [unload]);

  return (
    <div
      className="w-full h-full"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <Unity
        id={id}
        unityProvider={unityProvider}
        className="w-full h-full"
        style={{ opacity: isLoaded ? 1 : 0 }}
        tabIndex={-1}
      />
    </div>
  );
};
