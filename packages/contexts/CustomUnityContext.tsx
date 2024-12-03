import {
  CustomUnityContextType,
  MessageDestination,
  UnitySceneType,
} from "hooks/useCustomUnityHook/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUnityContext } from "react-unity-webgl";
import { CustomUnity, UnityIn } from "ui/molecules/CustomUnity";

const CustomUnityContext = createContext<CustomUnityContextType>(
  {} as CustomUnityContextType,
);

export const CustomUnityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const buildFilePath = "/admin/unity/build/webgl";
  const buildFilePath =
    "https://storage.googleapis.com/tobiratory-dev_media/unity-builds/admin/webgl";

  const unityContext = useUnityContext({
    loaderUrl: `${buildFilePath}.loader.js`,
    dataUrl: `${buildFilePath}.data`,
    frameworkUrl: `${buildFilePath}.framework.js`,
    codeUrl: `${buildFilePath}.wasm`,
  });

  const [mountedSceneList, setMountedSceneList] = useState<UnitySceneType[]>(
    [],
  );

  const postMessageToUnity = useCallback(
    (gameObject: MessageDestination, message: string) => {
      if (!unityContext.isLoaded) return;
      unityContext.sendMessage(gameObject, "OnMessageReceived", message);
    },
    [unityContext],
  );

  useEffect(() => {
    if (mountedSceneList.length === 0 && unityContext.isLoaded) {
      const json = JSON.stringify({
        sceneType: UnitySceneType.Standby,
      });
      postMessageToUnity("SwitchSceneMessageReceiver", json);
    }
  }, [unityContext, mountedSceneList, postMessageToUnity]);

  const contextValue: CustomUnityContextType = {
    ...unityContext,
    setMountedSceneList,
  };

  return (
    <CustomUnityContext.Provider value={contextValue}>
      <UnityIn unityProvider={unityContext.unityProvider} />
      {mountedSceneList.length === 0 && (
        <div className="w-0 h-0 absolute opacity-0">
          <CustomUnity isSceneOpen={false} />
        </div>
      )}
      {children}
    </CustomUnityContext.Provider>
  );
};

export const useCustomUnityContext = () => useContext(CustomUnityContext);
