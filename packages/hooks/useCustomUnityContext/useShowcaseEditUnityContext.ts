import { useCallback } from "react";
import { ShowcaseLoadData, ShowcaseSaveData } from "types/adminTypes";
import { ItemType, SaidanItemData, ShowcaseItemData } from "types/unityTypes";
import {
  MessageBodyForSavingSaidanData,
  SaidanLikeData,
  SaidanType,
  UnityMessageJson,
  UnitySceneType,
} from "./types";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";
import { useUnityMessageHandler } from "./useUnityMessageHandler";

type Props = {
  onSaveDataGenerated?: (showcaseSaveData: ShowcaseSaveData) => void;
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

  const processLoadData: (loadData: ShowcaseLoadData) => SaidanLikeData =
    useCallback((loadData: ShowcaseLoadData) => {
      console.log(loadData);
      if (loadData == null) return null;

      const sampleList: SaidanItemData[] = loadData.sampleItemList.map((v) => {
        return {
          ...v,
          itemType: ItemType.Sample,
        };
      });
      const nftList: SaidanItemData[] = loadData.nftItemList.map((v) => {
        return {
          ...v,
          itemType: ItemType.DigitalItemNft,
        };
      });
      const saidanItemList = sampleList.concat(nftList);

      return {
        saidanId: loadData.showcaseId,
        saidanType: (loadData.showcaseType + 20000) as SaidanType,
        saidanUrl: loadData.showcaseUrl,
        saidanItemList,
      };
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
