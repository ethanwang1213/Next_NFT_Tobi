import { useEffect, useRef } from "react";
import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

type ProviderParam = {
  unityProvider: UnityProvider;
  isSceneOpen: boolean;
  handleMouseUp?: () => void;
  unload: () => Promise<void>;
};

type IdParam = {
  id: string;
};

export const WorkspaceUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
  unload,
}: ProviderParam) => (
  <UnityBase
    id="workspace"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
    unload={unload}
  />
);

export const ShowcaseEditUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
  unload,
}: ProviderParam) => (
  <UnityBase
    id="showcaseEdit"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
    unload={unload}
  />
);

export const ItemPreviewUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
  unload,
}: ProviderParam) => (
  <UnityBase
    id="itemPreview"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
    unload={unload}
  />
);

export const AcrylicBaseSettingsUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
  unload,
}: ProviderParam) => (
  <UnityBase
    id="acrylicBaseSettings"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
    unload={unload}
  />
);

export const NftModelGeneratorUnity = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
  unload,
}: ProviderParam) => (
  <UnityBase
    id="nftModelGenerator"
    unityProvider={unityProvider}
    isSceneOpen={isSceneOpen}
    handleMouseUp={handleMouseUp}
    unload={unload}
  />
);

const UnityBase = ({
  id,
  unityProvider,
  isSceneOpen,
  handleMouseUp,
  unload,
}: ProviderParam & IdParam) => {
  const initialMount = useRef(true);

  useEffect(() => {
    return () => {
      console.log("unload hoge: " + isSceneOpen);
      if (!!unload) {
        unload()
          .then(() => {
            console.log(`Unity ${id} is unloaded.`);
          })
          .catch((e) => {
            console.error(`Failed to unload Unity ${id}.`, e);
          });
      }
    };
    // This effect should only run once when the component is unmounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      canvas.blur();
    };
    canvas.addEventListener("mousedown", handleMouseDown);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

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
