import { useUnityContext } from "react-unity-webgl";

export const useMyUnityContext = () => {
  // const buildFilePath = "/admin/unity/build/webgl";
  const buildFilePath = `${process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_URL}/unity-builds/admin/webgl`;

  return useUnityContext({
    loaderUrl: `${buildFilePath}.loader.js`,
    dataUrl: `${buildFilePath}.data.gz`,
    frameworkUrl: `${buildFilePath}.framework.js.gz`,
    codeUrl: `${buildFilePath}.wasm.gz`,
  });
};
