import { useCallback } from "react";
import {
  SendItemRemovalResult,
  ShowcaseLoadData,
  ShowcaseSaveData,
  UpdateIdValues,
} from "types/adminTypes";
import {
  ItemSaveData,
  ItemType,
  SaidanItemData,
  ShowcaseSettings,
} from "types/unityTypes";
import { DefaultItemMeterHeight } from "./constants";
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
    itemType: ItemType,
    id: number,
    itemId: number,
    sendItemRemovalResult: SendItemRemovalResult,
  ) => void;
  onItemSelected?: (itemType: ItemType, itemId: number) => void;
};

type ProcessLoadData = (loadData: ShowcaseLoadData) => SaidanLikeData | null;

export const useShowcaseEditUnityContext = ({
  itemMenuX = -1,
  onSaveDataGenerated,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onRemoveItemRequested,
  onItemSelected,
}: Props) => {
  const {
    unityProvider,
    isLoaded,
    isDragging,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData,
    requestSaveData,
    placeNewSample,
    placeNewNft,
    placeNewSampleWithDrag,
    placeNewNftWithDrag,
    removeItem,
    updateIdValues,
    inputWasd,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
  } = useSaidanLikeUnityContextBase({
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
          itemMeterHeight: DefaultItemMeterHeight,
        };
      });
      const nftList: SaidanItemData[] = loadData.nftItemList.map((v) => {
        return {
          ...v,
          itemType: ItemType.DigitalItemNft,
          imageUrl: "",
          canScale: true,
          itemMeterHeight: DefaultItemMeterHeight,
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
        saidanSettings: loadData.settings,
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

  const removeRecentItem = useCallback(
    (itemInfo: { itemType: ItemType; itemId: number }) => {
      postMessageToUnity(
        "RemoveRecentItemMessageReceiver",
        JSON.stringify(itemInfo),
      );
    },
    [postMessageToUnity],
  );

  const sendRemovalResult = useCallback(
    (itemType: ItemType, id: number, completed: boolean) => {
      postMessageToUnity(
        "RemovalResultMessageReceiver",
        JSON.stringify({ itemType, id, completed }),
      );
    },
    [postMessageToUnity],
  );

  const updateSettings = useCallback(
    ({ wallpaper, floor, lighting }: ShowcaseSettings) => {
      postMessageToUnity(
        "UpdateSettingsMessageReceiver",
        JSON.stringify({ wallpaper, floor, lighting }),
      );
    },
    [postMessageToUnity],
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
          settings: messageBody.saidanData.saidanSettings,
        },
        updateIdValues,
      );
    },
    [onSaveDataGenerated, updateIdValues],
  );

  const handleRemoveItemRequested = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onRemoveItemRequested) return;

      const messageBody = JSON.parse(msgObj.messageBody) as {
        itemType: ItemType;
        id: number;
        itemId: number;
      };

      if (!messageBody) return;

      onRemoveItemRequested(
        messageBody.itemType,
        messageBody.id,
        messageBody.itemId,
        sendRemovalResult,
      );
    },
    [onRemoveItemRequested, sendRemovalResult],
  );

  const handleItemSelected = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onItemSelected) return;

      const messageBody = JSON.parse(msgObj.messageBody) as {
        itemType: ItemType;
        itemId: number;
      };

      if (!messageBody) return;

      onItemSelected(messageBody.itemType, messageBody.itemId);
    },
    [onItemSelected],
  );

  useUnityMessageHandler({
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleRemoveItemRequested,
    handleItemSelected,
  });

  return {
    unityProvider,
    isLoaded,
    isDragging,
    setLoadData: processAndSetLoadData,
    requestSaveData,
    placeNewSample,
    placeNewNft,
    placeNewSampleWithDrag,
    placeNewNftWithDrag,
    removeItem,
    removeRecentItem,
    updateSettings,
    inputWasd,
  };
};
