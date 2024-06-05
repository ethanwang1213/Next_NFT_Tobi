import { useCallback } from "react";
import {
  ShowcaseLoadData,
  ShowcaseSaveData,
  UpdateIdValues,
} from "types/adminTypes";
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
  itemMenuX?: number;
  onSaveDataGenerated?: (
    showcaseSaveData: ShowcaseSaveData,
    updateIdValues: UpdateIdValues,
  ) => void;
  onRemoveItemEnabled?: () => void;
  onRemoveItemDisabled?: () => void;
  onRemoveItemRequested?: (
    id: number,
    itemType: ItemType,
    itemId: number,
  ) => void;
};

type ProcessLoadData = (loadData: ShowcaseLoadData) => SaidanLikeData | null;

export const useShowcaseEditUnityContext = ({
  itemMenuX = -1,
  onSaveDataGenerated,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onRemoveItemRequested,
}: Props) => {
  const base = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.ShowcaseEdit,
    itemMenuX,
    onRemoveItemEnabled,
    onRemoveItemDisabled,
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
          imageUrl: "",
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
      base.setLoadData(processLoadData(loadData));
    },
    [base.setLoadData, processLoadData],
  );

  const removeRecentItem = useCallback(
    ({ itemType, itemId }) => {
      base.postMessageToUnity(
        "RemoveRecentItemMessageReceiver",
        JSON.stringify({
          itemType,
          itemId,
        }),
      );
    },
    [base.postMessageToUnity],
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
          id: v.id,
          itemId: v.itemId,
          stageType: v.stageType,
          position: v.position,
          rotation: v.rotation,
          scale: v.scale,
        }));
      var nftItemList: ItemSaveData[] = messageBody.saidanData.saidanItemList
        .filter((v) => v.itemType === ItemType.DigitalItemNft)
        .map((v) => ({
          id: v.id,
          itemId: v.itemId,
          stageType: v.stageType,
          position: v.position,
          rotation: v.rotation,
          scale: v.scale,
        }));

      onSaveDataGenerated(
        {
          sampleItemList,
          nftItemList,
          thumbnailImageBase64: messageBody.saidanThumbnailBase64,
        },
        base.updateIdValues,
      );
    },
    [onSaveDataGenerated, base.updateIdValues],
  );

  const handleRemoveItemRequested = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onRemoveItemRequested) return;

      const messageBody = JSON.parse(msgObj.messageBody) as {
        id: number;
        itemType: ItemType;
        itemId: number;
      };

      if (!messageBody) return;

      onRemoveItemRequested(
        messageBody.id,
        messageBody.itemType,
        messageBody.itemId,
      );
    },
    [onRemoveItemRequested],
  );

  useUnityMessageHandler({
    addEventListener,
    removeEventListener,
    handleSimpleMessage: base.handleSimpleMessage,
    handleSceneIsLoaded: base.handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleDragStarted: base.handleDragStarted,
    handleDragEnded: base.handleDragEnded,
    handleRemoveItemEnabled: base.handleRemoveItemEnabled,
    handleRemoveItemDisabled: base.handleRemoveItemDisabled,
    handleRemoveItemRequested,
  });

  return {
    unityProvider: base.unityProvider,
    isDragging: base.isDragging,
    setLoadData: processAndSetLoadData,
    requestSaveData: base.requestSaveData,
    placeNewItem: base.placeNewItem,
    placeNewItemWithDrag: base.placeNewItemWithDrag,
    removeItem: base.removeItem,
    removeRecentItem,
  };
};
