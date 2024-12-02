import { CustomUnityContextType } from "hooks/useCustomUnityHook/types";
import React, { createContext, useContext } from "react";
import { useUnityContext } from "react-unity-webgl";
import { UnityIn } from "ui/molecules/CustomUnity";

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

  const contextValue: CustomUnityContextType = {
    ...unityContext,
  };

  return (
    <CustomUnityContext.Provider value={contextValue}>
      <UnityIn unityProvider={unityContext.unityProvider} />
      {children}
    </CustomUnityContext.Provider>
  );
};

export const useCustomUnityContext = () => useContext(CustomUnityContext);
