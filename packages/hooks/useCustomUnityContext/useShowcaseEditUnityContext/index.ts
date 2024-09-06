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
  UpdatingSaidanSettings,
} from "types/unityTypes";
import { DefaultItemMeterHeight } from "../constants";
import {
  MessageBodyForSavingSaidanData,
  SaidanLikeData,
  SaidanType,
  showcaseOffset,
  UndoneOrRedone,
  UnityMessageJson,
  UnitySceneType,
} from "../types";
import { useSaidanLikeUnityContextBase } from "../useSaidanLikeUnityContextBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useUpdateItemTransform } from "./useUpdateTransform";

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
  onActionUndone?: UndoneOrRedone;
  onActionRedone?: UndoneOrRedone;
  onItemTransformUpdated?: (scale: number) => void;
};

type ProcessLoadData = (loadData: ShowcaseLoadData) => SaidanLikeData | null;

export const useShowcaseEditUnityContext = ({
  itemMenuX = -1,
  onSaveDataGenerated,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onRemoveItemRequested,
  onItemTransformUpdated,
  onActionUndone,
  onActionRedone,
}: Props) => {
  const {
    // state
    unityProvider,
    isLoaded,
    isDragging,
    selectedItem,
    isUndoable,
    isRedoable,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData,
    requestSaveData,
    setSelectedItem,
    placeNewSample,
    placeNewNft,
    placeNewSampleWithDrag,
    placeNewNftWithDrag,
    removeItem,
    updateIdValues,
    inputWasd,
    undoAction,
    redoAction,
    deleteAllActionHistory,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handlers
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleItemSelected,
    handleActionRegistered,
    handleActionUndone,
    handleActionRedone,
  } = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.ShowcaseEdit,
    itemMenuX,
    onRemoveItemEnabled,
    onRemoveItemDisabled,
    onActionUndone,
    onActionRedone,
  });

  // functions
  const processLoadData: ProcessLoadData = useCallback(
    (loadData: ShowcaseLoadData) => {
      console.log(loadData);
      if (loadData == null) return null;

      const sampleList: SaidanItemData[] = loadData.sampleItemList.map((v) => {
        return {
          itemId: v.sampleItemId,
          itemName: v.name,
          ...v,
          itemType: ItemType.Sample,
          canScale: true,
          itemMeterHeight: DefaultItemMeterHeight,
        };
      });
      const nftList: SaidanItemData[] = loadData.nftItemList.map((v) => {
        return {
          itemId: v.nftId,
          itemName: v.name,
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
        saidanUrl: loadData.showcaseUrl,
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

  const { updateItemTransform, handleItemTransformUpdated } =
    useUpdateItemTransform({
      selectedItem,
      setSelectedItem,
      postMessageToUnity,
    });

  const updateSettings = useCallback(
    ({ wallpaper, floor, lighting, phase }: UpdatingSaidanSettings) => {
      postMessageToUnity(
        "UpdateSettingsMessageReceiver",
        JSON.stringify({ wallpaper, floor, lighting, phase }),
      );
    },
    [postMessageToUnity],
  );

  // event handlers
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
    handleActionRegistered,
    handleActionUndone,
    handleActionRedone,
    handleItemTransformUpdated,
  });

  return {
    // states
    unityProvider,
    isLoaded,
    isDragging,
    selectedItem,
    isUndoable,
    isRedoable,
    // functions
    setLoadData: processAndSetLoadData,
    requestSaveData,
    placeNewSample,
    placeNewNft,
    placeNewSampleWithDrag,
    placeNewNftWithDrag,
    removeItem,
    removeRecentItem,
    updateItemTransform,
    updateSettings,
    inputWasd,
    undoAction,
    redoAction,
    deleteAllActionHistory,
    pauseUnityInputs,
    resumeUnityInputs,
  };
};
