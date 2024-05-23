import { useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import {
  ItemType,
  ShowcaseItemData,
  ShowcaseSaveDataFromUnity,
} from "types/adminTypes";
import { dummyLoadData } from "./dummyData";
import {
  MessageBodyForSavingSaidanData,
  UnityMessageJson,
  UnityMessageType,
  UnitySceneType,
} from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";

type Props = {
  onSaveDataGenerated?: (showcaseSaveData: ShowcaseSaveDataFromUnity) => void;
};

export const useShowcaseEditUnityContext = ({ onSaveDataGenerated }: Props) => {
  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    resolveUnityMessage,
    setLoadData,
    requestSaveData,
    placeNewItem,
    handleSimpleMessage,
    handleSceneIsLoaded,
  } = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.ShowcaseEdit,
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

  const handleSaveDataGenerated = useCallback(
    (
      msgObj: UnityMessageJson,
      onSaveDataGenerated: (
        showcaseSaveData: ShowcaseSaveDataFromUnity,
      ) => void,
    ) => {
      const messageBody = JSON.parse(
        msgObj.messageBody,
      ) as MessageBodyForSavingSaidanData;
      if (!messageBody) return;

      var sampleItemList = messageBody.saidanData.saidanItemList
        .filter((v) => v.itemType === ItemType.Sample)
        .map<ShowcaseItemData>((v) => {
          delete v.itemType;
          return v;
        });

      var nftItemList = messageBody.saidanData.saidanItemList
        .filter((v) => v.itemType === ItemType.DigitalItemNft)
        .map<ShowcaseItemData>((v) => {
          delete v.itemType;
          return v;
        });

      onSaveDataGenerated({
        sampleItemList,
        nftItemList,
        thumbnailImageBase64: messageBody.saidanThumbnailBase64,
      });
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
    placeNewItem,
  };
};
