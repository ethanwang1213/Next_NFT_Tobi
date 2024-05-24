import { useCallback } from "react";
import {
  ItemType,
  ShowcaseItemData,
  ShowcaseSaveDataFromUnity,
} from "types/adminTypes";
import { dummyLoadData } from "./dummyData";
import {
  MessageBodyForSavingSaidanData,
  UnityMessageJson,
  UnitySceneType,
} from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";
import { useUnityMessageHandler } from "./useUnityMessageHandler";

type Props = {
  onSaveDataGenerated?: (showcaseSaveData: ShowcaseSaveDataFromUnity) => void;
};

export const useShowcaseEditUnityContext = ({ onSaveDataGenerated }: Props) => {
  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    setLoadData,
    requestSaveData,
    placeNewItem,
    removeItem,
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
    (msgObj: UnityMessageJson) => {
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
    [onSaveDataGenerated],
  );

  useUnityMessageHandler({
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleSaveDataGenerated,
  });

  return {
    unityProvider,
    setLoadData: processAndSetLoadData,
    requestSaveData,
    placeNewItem,
    removeItem,
  };
};
