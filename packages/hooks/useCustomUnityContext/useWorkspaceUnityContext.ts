import { useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { WorkspaceItemData, WorkspaceSaveData } from "types/adminTypes";
import { dummyLoadData } from "./dummyData";
import {
  MessageBodyForSavingSaidanData,
  UnityMessageJson,
  UnityMessageType,
  UnitySceneType,
} from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";

type Props = {
  onSaveDataGenerated?: (workspaceSaveData: WorkspaceSaveData) => void;
};

export const useWorkspaceUnityContext = ({ onSaveDataGenerated }: Props) => {
  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    resolveUnityMessage,
    setLoadData,
    requestSaveData,
    handleSimpleMessage,
    handleSceneIsLoaded,
  } = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.Workspace,
  });

  const processLoadData = useCallback((loadData: any) => {
    console.log(loadData);
    if (loadData == null) return null;

    // TODO(toruto): implement to process loadData
    // return dummy data
    if (loadData === 0) {
      return dummyLoadData[0];
    } else if (loadData === 1 || loadData === 2) {
      return dummyLoadData[1];
    } else {
      return null;
    }
  }, []);

  const processAndSetLoadData = useCallback(
    (loadData: any) => {
      setLoadData(processLoadData(loadData));
    },
    [setLoadData, processLoadData],
  );

  // TODO(toruto): const requestItemThumbnail = () => {};

  const handleSaveDataGenerated = (
    msgObj: UnityMessageJson,
    onSaveDataGenerated: (workspaceSaveData: WorkspaceSaveData) => void,
  ) => {
    const messageBody = JSON.parse(
      msgObj.messageBody,
    ) as MessageBodyForSavingSaidanData;
    if (!messageBody) return;

    var workspaceItemList =
      messageBody.saidanData.saidanItemList.map<WorkspaceItemData>((v) => {
        delete v.itemType;
        return v;
      });
    onSaveDataGenerated({ workspaceItemList });
  };

  // `message` is JSON string formed in Unity side like following:
  // {
  //   "messageType": string,
  //   "sceneType": number,
  //   "messageBody": string or JSON string
  // }
  const handleUnityMessage = useCallback(
    (message: ReactUnityEventParameter) => {
      if (typeof message !== "string") return;
      const msgObj = resolveUnityMessage(message);
      if (!msgObj) return;

      // execute event handlers along with message type
      switch (msgObj.messageType) {
        case UnityMessageType.SimpleMessage:
          handleSimpleMessage(msgObj);
          return;
        case UnityMessageType.SceneIsLoaded:
          handleSceneIsLoaded();
          return;
        case UnityMessageType.SavingSaidanData:
          handleSaveDataGenerated(msgObj, onSaveDataGenerated);
          return;
        default:
          return;
      }
    },
    [resolveUnityMessage, handleSimpleMessage, handleSceneIsLoaded],
  );

  // We use only `onUnityMessage` event to receive messages from Unity side.
  useEffect(() => {
    addEventListener("onUnityMessage", handleUnityMessage);
    return () => {
      removeEventListener("onUnityMessage", handleUnityMessage);
    };
  }, [addEventListener, removeEventListener, handleUnityMessage]);

  return { unityProvider, setLoadData: processAndSetLoadData, requestSaveData };
};
