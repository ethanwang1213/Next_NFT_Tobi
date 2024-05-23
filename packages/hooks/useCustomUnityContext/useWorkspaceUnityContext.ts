import { useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import {
  ModelType,
  WorkspaceItemData,
  WorkspaceSaveData,
} from "types/adminTypes";
import { dummyLoadData } from "./dummyData";
import {
  MessageBodyForSavingSaidanData,
  UnityMessageJson,
  UnityMessageType,
  UnitySceneType,
} from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";

type ItemThumbnailParams = {
  modelType: ModelType;
  modelUrl: string;
  imageUrl: string;
};

type MessageBodyForGeneratingItemThumbnail = {
  thumbnailBase64: string;
};

type Props = {
  onSaveDataGenerated?: (workspaceSaveData: WorkspaceSaveData) => void;
  onItemThumbnailGenerated?: (thumbnailBase64: string) => void;
};

export const useWorkspaceUnityContext = ({
  onSaveDataGenerated,
  onItemThumbnailGenerated,
}: Props) => {
  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
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

  const requestItemThumbnail = useCallback(
    ({ modelType, modelUrl, imageUrl }: ItemThumbnailParams) => {
      const json = JSON.stringify({
        modelType,
        modelUrl,
        imageUrl,
      });
      postMessageToUnity("ItemThumbnailGenerationMessageReceiver", json);
    },
    [postMessageToUnity],
  );

  const handleSaveDataGenerated = useCallback(
    (
      msgObj: UnityMessageJson,
      onSaveDataGenerated?: (workspaceSaveData: WorkspaceSaveData) => void,
    ) => {
      if (!onSaveDataGenerated) return;

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
    },
    [],
  );

  const handleItemThumbnailGenerated = useCallback(
    (
      msgObj: UnityMessageJson,
      onItemThumbnailGenerated?: (thumbnailBase64: string) => void,
    ) => {
      if (!onItemThumbnailGenerated) return;

      const messageBody = JSON.parse(
        msgObj.messageBody,
      ) as MessageBodyForGeneratingItemThumbnail;
      if (!messageBody) return;

      onItemThumbnailGenerated(messageBody.thumbnailBase64);
    },
    [],
  );

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
        case UnityMessageType.SaidanSaveDataIsGenerated:
          handleSaveDataGenerated(msgObj, onSaveDataGenerated);
          return;
        case UnityMessageType.ItemThumbnailIsGenerated:
          handleItemThumbnailGenerated(msgObj, onItemThumbnailGenerated);
          return;
        default:
          return;
      }
    },
    [
      resolveUnityMessage,
      handleSimpleMessage,
      handleSceneIsLoaded,
      handleSaveDataGenerated,
      onSaveDataGenerated,
      handleItemThumbnailGenerated,
      onItemThumbnailGenerated,
    ],
  );

  // We use only `onUnityMessage` event to receive messages from Unity side.
  useEffect(() => {
    addEventListener("onUnityMessage", handleUnityMessage);
    return () => {
      removeEventListener("onUnityMessage", handleUnityMessage);
    };
  }, [addEventListener, removeEventListener, handleUnityMessage]);

  return {
    unityProvider,
    setLoadData: processAndSetLoadData,
    requestSaveData,
    requestItemThumbnail,
  };
};
