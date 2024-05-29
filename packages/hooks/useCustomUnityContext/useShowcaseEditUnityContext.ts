import { useCallback } from "react";
import { ItemType, ShowcaseLoadData, ShowcaseSaveData } from "types/adminTypes";
import { SaidanItemData, ShowcaseItemData } from "types/unityTypes";
import {
  MessageBodyForSavingSaidanData,
  SaidanLikeData,
  SaidanType,
  showcaseOffset,
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

  const processLoadData: (loadData: ShowcaseLoadData) => SaidanLikeData | null =
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
        saidanType: (loadData.showcaseType + showcaseOffset) as SaidanType,
        saidanUrl: loadData.showcaseUrl,
        saidanItemList,
      };
    }, []);

  const processAndSetLoadData = useCallback(
    (loadData: ShowcaseLoadData) => {
      setLoadData(processLoadData(loadData));
    },
    [setLoadData, processLoadData],
  );

  const handleSaveDataGenerated = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onSaveDataGenerated) return;

      const messageBody = JSON.parse(
        msgObj.messageBody,
      ) as MessageBodyForSavingSaidanData;

      if (!messageBody) return;

      var sampleItemList: ShowcaseItemData[] =
        messageBody.saidanData.saidanItemList.filter(
          (v) => v.itemType === ItemType.Sample,
        );
      var nftItemList: ShowcaseItemData[] =
        messageBody.saidanData.saidanItemList.filter(
          (v) => v.itemType === ItemType.DigitalItemNft,
        );

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
