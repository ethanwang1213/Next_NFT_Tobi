import {
  CustomUnityContextType,
  MessageDestination,
  UnitySceneType,
} from "hooks/useCustomUnityHook/types";
import { useMyUnityContext } from "hooks/useCustomUnityHook/useMyUnityContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CustomUnity, UnityIn } from "ui/molecules/CustomUnity";

const CustomUnityContext = createContext<CustomUnityContextType>(
  {} as CustomUnityContextType,
);

export const CustomUnityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const unityContext = useMyUnityContext();

  const [mountedScene, setMountedScene] = useState<UnitySceneType>(
    UnitySceneType.Standby,
  );

  const postMessageToUnity = useCallback(
    (gameObject: MessageDestination, message: string) => {
      if (!unityContext.isLoaded) return;
      unityContext.sendMessage(gameObject, "OnMessageReceived", message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unityContext.isLoaded, unityContext.sendMessage],
  );

  useEffect(() => {
    if (mountedScene === UnitySceneType.Standby) {
      const json = JSON.stringify({
        sceneType: UnitySceneType.Standby,
      });
      postMessageToUnity("SwitchSceneMessageReceiver", json);
    }
  }, [mountedScene, postMessageToUnity]);

  const contextValue: CustomUnityContextType = {
    ...unityContext,
    setMountedScene,
  };

  return (
    <CustomUnityContext.Provider value={contextValue}>
      <UnityIn unityProvider={unityContext.unityProvider} />
      {mountedScene === UnitySceneType.Standby && (
        <div className="w-0 h-0 absolute hidden">
          <CustomUnity isSceneOpen={true} />
        </div>
      )}
      {children}
    </CustomUnityContext.Provider>
  );
};

export const useCustomUnityContext = () => useContext(CustomUnityContext);
