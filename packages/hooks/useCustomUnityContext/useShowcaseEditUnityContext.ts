import { useCallback } from "react";
import { ShowcaseLoadData, ShowcaseSaveData } from "types/adminTypes";
import { ItemSaveData, ItemType, SaidanItemData } from "types/unityTypes";
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

type ProcessLoadData = (loadData: ShowcaseLoadData) => SaidanLikeData | null;

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

  const processLoadData: ProcessLoadData = useCallback(
    (loadData: ShowcaseLoadData) => {
      console.log(loadData);
      if (loadData == null) return null;

      const sampleList: SaidanItemData[] = loadData.sampleItemList.map((v) => {
        return {
          ...v,
          itemType: ItemType.Sample,
          canScale: true,
          itemMeterHeight: 0.3,
          isDebug: false, // not used in loading
        };
      });
      const nftList: SaidanItemData[] = loadData.nftItemList.map((v) => {
        return {
          ...v,
          itemType: ItemType.DigitalItemNft,
          canScale: true,
          itemMeterHeight: 0.3,
          isDebug: false, // not used in loading
        };
      });
      const saidanItemList = sampleList.concat(nftList);

      return {
        saidanId: loadData.showcaseId,
        saidanType: (loadData.showcaseType + showcaseOffset) as SaidanType,
        // saidanUrl: loadData.showcaseUrl,
        saidanUrl: "dummy",
        saidanItemList,
        saidanCameraData: {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
        },
        isDebug: loadData.isDebug ? loadData.isDebug : false,
      };
    },
    [],
  );

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

      var sampleItemList: ItemSaveData[] = messageBody.saidanData.saidanItemList
        .filter((v) => v.itemType === ItemType.Sample)
        .map((v) => ({
          itemId: v.itemId,
          tableId: v.tableId,
          stageType: v.stageType,
          position: v.position,
          rotation: v.rotation,
          scale: v.scale,
        }));
      var nftItemList: ItemSaveData[] = messageBody.saidanData.saidanItemList
        .filter((v) => v.itemType === ItemType.DigitalItemNft)
        .map((v) => ({
          itemId: v.itemId,
          tableId: v.tableId,
          stageType: v.stageType,
          position: v.position,
          rotation: v.rotation,
          scale: v.scale,
        }));

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
