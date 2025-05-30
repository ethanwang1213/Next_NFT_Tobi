import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Unity } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

// Primary Unity
type Props = {
  isSceneOpen: boolean;
  handleMouseUp?: () => void;
};

const CustomUnity: React.FC<Props> = ({ isSceneOpen, handleMouseUp }) => {
  return <UnityOut isSceneOpen={isSceneOpen} handleMouseUp={handleMouseUp} />;
};

// Secondary Unity
type SecondaryProps = Props & {
  unityProvider: UnityProvider;
};

const SecondaryUnity: React.FC<SecondaryProps & Props> = ({
  unityProvider,
  isSceneOpen,
}) => {
  return (
    <SecondaryUnityBase
      unityProvider={unityProvider}
      isSceneOpen={isSceneOpen}
    />
  );
};

////////////////////////////////////////
/// Magic Portal
/// share one Unity component between multiple primary mount points with completely the same state.
/// reference: https://inside.pixiv.blog/2023/09/20/180000
type UnityProps = {
  unityProvider: UnityProvider;
};

type CustomUnityProps = {
  isSceneOpen: boolean;
  handleMouseUp?: () => void;
};

const magicPortal = {
  parent: null as Node | null,
  element: null as HTMLDivElement | null,
  placeholder: null as Node | null,
  setProps: null as Dispatch<SetStateAction<CustomUnityProps>> | null,
  // avoid hydration error
  ensureElement() {
    if (!this.element && typeof document !== "undefined") {
      this.element = document.createElement("div");
      this.element.className = "w-full h-full";
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

// portal element
const UnityIn: React.FC<UnityProps> = ({ unityProvider }) => {
  const [props, setProps] = useState<CustomUnityProps>({
    isSceneOpen: false,
    handleMouseUp: () => {},
  });

  useEffect(() => {
    Object.assign(magicPortal, { setProps });
    magicPortal.ensureElement();
  }, []);

  if (!magicPortal.element) return null;

  return createPortal(
    <CustomUnityBase unityProvider={unityProvider} {...props} />,
    magicPortal.element,
  );
};

// portal point
const UnityOut: React.FC<CustomUnityProps> = (props) => {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder?.parentNode) return;
    magicPortal.mount(placeholder.parentNode, placeholder);
    return () => {
      magicPortal.unmount(placeholder);
    };
  }, []);

  useEffect(() => {
    magicPortal.setProps(props);
  }, [props]);

  return <div ref={placeholderRef} />;
};

// Unity Base
type UnityId = {
  id: string;
};

const CustomUnityBase = ({
  unityProvider,
  isSceneOpen,
  handleMouseUp,
}: UnityProps & CustomUnityProps) => {
  return (
    <UnityBase
      unityProvider={unityProvider}
      isSceneOpen={isSceneOpen}
      id="custom-unity"
      handleMouseUp={handleMouseUp}
    />
  );
};

const SecondaryUnityBase = ({
  unityProvider,
  isSceneOpen,
}: UnityProps & CustomUnityProps) => {
  return (
    <UnityBase
      unityProvider={unityProvider}
      isSceneOpen={isSceneOpen}
      id="secondary-unity"
    />
  );
};

const UnityBase = ({
  unityProvider,
  isSceneOpen,
  id,
  handleMouseUp,
}: UnityProps & CustomUnityProps & UnityId) => {
  const { canvasRef } = useBlurUnity();

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

const useBlurUnity = () => {
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

  return { canvasRef };
};

export { CustomUnity, SecondaryUnity, UnityIn };
