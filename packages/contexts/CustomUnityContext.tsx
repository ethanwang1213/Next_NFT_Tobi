// Reference: https://inside.pixiv.blog/2023/09/20/180000

import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

/// Custom Unity Context
type CustomUnityContextType = {
  unityProvider: UnityProvider;
};

const CustomUnityContext = createContext<CustomUnityContextType>(
  {} as CustomUnityContextType,
);

const CustomUnityProvider = ({ children }: { children: React.ReactNode }) => {
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
      {children}
      <UnityIn unityProvider={unityProvider} />
    </CustomUnityContext.Provider>
  );
};

const useCustomUnityContext = () => useContext(CustomUnityContext);

/// Magic Portal
const magicPortal = {
  parent: null as Node | null,
  element: null as HTMLDivElement | null,
  placeholder: null as Node | null,
  // avoid hydration error
  ensureElement() {
    if (!this.element && typeof document !== "undefined") {
      this.element = document.createElement("div");
    }
  },
  // mount new portal point
  mount(newParent: Node, newPlaceholder: HTMLDivElement) {
    this.ensureElement();
    if (!magicPortal.element) return;
    if (magicPortal.parent === newParent) return;
    magicPortal.unmount();
    newPlaceholder.replaceWith(magicPortal.element);
    magicPortal.parent = newParent;
    magicPortal.placeholder = newPlaceholder;
  },
  // unmount old portal point
  unmount(expectedPlaceholder?: Node) {
    if (expectedPlaceholder && expectedPlaceholder !== magicPortal.placeholder)
      return;
    if (!parent || !magicPortal.placeholder) return;
    magicPortal.element?.replaceWith(magicPortal.placeholder);
    magicPortal.parent = null;
    magicPortal.placeholder = null;
  },
};

/// Unity Components
type UnityProps = {
  unityProvider: UnityProvider;
};

// portal element
const UnityIn: React.FC<UnityProps> = ({ unityProvider }) => {
  useEffect(() => {
    magicPortal.ensureElement();
  }, []);

  if (!magicPortal.element) return null;

  return createPortal(
    <CustomUnity unityProvider={unityProvider} />,
    magicPortal.element,
  );
};

// portal point
const UnityOut: React.FC = () => {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const placeholder = placeholderRef.current;

    if (!placeholder?.parentNode) return;
    magicPortal.mount(placeholder.parentNode, placeholder);
    return () => {
      magicPortal.unmount(placeholder);
    };
  });

  return <div ref={placeholderRef} />;
};

const CustomUnity = memo(
  ({ unityProvider }: { unityProvider: UnityProvider }) => {
    return <Unity unityProvider={unityProvider} />;
  },
);

export { CustomUnityProvider, useCustomUnityContext, UnityOut };
