import React, { createContext, useContext } from "react";
import { useUnityContext } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";
import { UnityIn } from "ui/molecules/CustomUnity";

/// Custom Unity Context
type CustomUnityContextType = {
  unityProvider: UnityProvider;
};

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

  const { unityProvider } = useUnityContext({
    loaderUrl: `${buildFilePath}.loader.js`,
    dataUrl: `${buildFilePath}.data`,
    frameworkUrl: `${buildFilePath}.framework.js`,
    codeUrl: `${buildFilePath}.wasm`,
  });

  const contextValue: CustomUnityContextType = { unityProvider };

  return (
    <CustomUnityContext.Provider value={contextValue}>
      <UnityIn unityProvider={unityProvider} />
      {children}
    </CustomUnityContext.Provider>
  );
};

export const useCustomUnityContext = () => useContext(CustomUnityContext);
