import { useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { UnitySceneType } from "types/adminTypes";

type Props = {
  sceneType: UnitySceneType;
  // add optional event handlers along with message type
};

type UnityMessageJson = {
  sceneType: UnitySceneType;
  messageType: UnityMessageType;
  messageBody: string;
};

const UnityMessageType = {
  SimpleMessage: 0,
  SceneIsLoaded: 1,
} as const;

type UnityMessageType =
  (typeof UnityMessageType)[keyof typeof UnityMessageType];

type MessageDestination = "SwitchSceneMessageReceiver";

export const useCustomUnityContextBase = ({ sceneType }: Props) => {
  const buildFilePath = "/admin/unity/build/webgl";
  const {
    unityProvider,
    isLoaded,
    addEventListener,
    removeEventListener,
    sendMessage,
  } = useUnityContext({
    loaderUrl: `${buildFilePath}.loader.js`,
    dataUrl: `${buildFilePath}.data`,
    frameworkUrl: `${buildFilePath}.framework.js`,
    codeUrl: `${buildFilePath}.wasm`,
  });

  useEffect(() => {
    if (!isLoaded) return;
    postMessageToSwitchScene(sceneType);
  }, [isLoaded]);

  // We use only `onUnityMessage` event to receive messages from Unity side.
  useEffect(() => {
    addEventListener("onUnityMessage", handleUnityMessage);
    return () => {
      removeEventListener("onUnityMessage", handleUnityMessage);
    };
  }, []);

  // `message` is JSON string formed in Unity side like following:
  // {
  //   "messageType": string,
  //   "sceneType": number,
  //   "messageBody": string or JSON string
  // }
  const handleUnityMessage = (message: ReactUnityEventParameter) => {
    if (typeof message !== "string") return;
    const msgObj = resolveUnityMessage(message);
    if (!msgObj) return;

    switch (msgObj.messageType) {
      case UnityMessageType.SimpleMessage:
        console.log(
          `Unity: SimpleMessage, ${msgObj.sceneType}, ${msgObj.messageBody}`,
        );
        return;
      // execute event handlers along with message type
      default:
        return;
    }
  };

  const resolveUnityMessage = (json: string) => {
    try {
      return JSON.parse(json) as UnityMessageJson;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const postMessageToSwitchScene = (destSceneType: UnitySceneType) => {
    const json = JSON.stringify({
      sceneType: destSceneType,
    });
    postMessageToUnity("SwitchSceneMessageReceiver", json);
  };

  const postMessageToUnity = (
    gameObject: MessageDestination,
    message: string,
  ) => {
    sendMessage(gameObject, "OnMessageReceived", message);
  };

  return { unityProvider };
};
