import { useEffect, useRef } from "react";
import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type ProviderParam = {
  unityProvider: UnityProvider;
  isSceneOpen: boolean;
  handleMouseUp?: () => void;
};

type IdParam = {
  id: string;
};

export const WorkspaceUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="workspace"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
  />
);

export const ShowcaseEditUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="showcaseEdit"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
  />
);

export const ItemPreviewUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="itemPreview"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
  />
);

export const AcrylicBaseSettingsUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="acrylicBaseSettings"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
  />
);

export const NftModelGeneratorUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
}: ProviderParam) => (
  <UnityBase
    id="nftModelGenerator"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
  />
);

const UnityBase = ({
  id,
  unityProvider,
  isSceneOpen,
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      canvasRef.current.blur();
    };
    canvasRef.current.addEventListener("mousedown", handleMouseDown);
    return () => {
      canvasRef.current?.removeEventListener("mousedown", handleMouseDown);
    };
  }, [canvasRef]);

  return (
    <div
      className="w-full h-full"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <Unity
        ref={canvasRef}
        id={id}
        unityProvider={unityProvider}
        className="w-full h-full"
        style={{ opacity: isSceneOpen ? 1 : 0 }}
        tabIndex={-1}
      />
    </div>
  );
};
