import { useCustomUnityContext } from "contexts/CustomUnityContext";
import { useCallback } from "react";
import {
  SendItemRemovalResult,
  ShowcaseLoadData,
  ShowcaseSaveData,
  UpdateIdValues,
} from "types/adminTypes";
import {
  ItemType,
  NftSaveData,
  SaidanItemData,
  SampleSaveData,
  UpdatingSaidanSettings,
} from "types/unityTypes";
import { DefaultAcrylicBaseScaleRatio } from "../constants";
import {
  MessageBodyForSavingSaidanData,
  NftModelGeneratedHandler,
  SaidanLikeData,
  SaidanType,
  showcaseOffset,
  UndoneOrRedoneHandler,
  UnityMessageJson,
  UnitySceneType,
} from "../types";
import { useSaidanLikeUnityHookBase } from "../useSaidanLikeUnityHookBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useShowSmartphoneArea } from "./useShowSmartphoneArea";
import { useUpdateItemTransform } from "./useUpdateTransform";

type SaveDataGeneratedHandler = (
  showcaseSaveData: ShowcaseSaveData,
  updateIdValues: UpdateIdValues,
) => void;

type RemoveItemRequestedHandler = (
  itemType: ItemType,
  id: number,
  itemId: number,
  sendItemRemovalResult: SendItemRemovalResult,
) => void;

type ProcessLoadData = (loadData: ShowcaseLoadData) => SaidanLikeData | null;

export const useShowcaseEditUnityHook = ({
  itemMenuX = -1,
  onSaveDataGenerated,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onRemoveItemRequested,
  onActionUndone,
  onActionRedone,
  onNftModelGenerated,
}: {
  itemMenuX?: number;
  onSaveDataGenerated?: SaveDataGeneratedHandler;
  onRemoveItemEnabled?: () => void;
  onRemoveItemDisabled?: () => void;
  onRemoveItemRequested?: RemoveItemRequestedHandler;
  onActionUndone?: UndoneOrRedoneHandler;
  onActionRedone?: UndoneOrRedoneHandler;
  onNftModelGenerated?: NftModelGeneratedHandler;
}) => {
  const sceneType = UnitySceneType.ShowcaseEdit;
  const {
    // state
    isSceneOpen,
    isItemsLoaded,
    isDragging,
    selectedItem,
    isUndoable,
    isRedoable,
    // functions
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
    undoAction,
    redoAction,
    deleteAllActionHistory,
    pauseUnityInputs,
    resumeUnityInputs,
    requestNftModelGeneration,
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
    handleNftModelGenerated,
    handleMouseUp,
    handleLoadingCompleted,
    handleCheckConnection,
  } = useSaidanLikeUnityHookBase({
    sceneType,
    itemMenuX,
    onRemoveItemEnabled,
    onRemoveItemDisabled,
    onActionUndone,
    onActionRedone,
    onNftModelGenerated,
  });

  const {
    addEventListener: unityAddEventListener,
    removeEventListener: unityRemoveEventListener,
  } = useCustomUnityContext();

  // functions
  const processLoadData: ProcessLoadData = useCallback(
    (loadData: ShowcaseLoadData) => {
      console.log(loadData);
      if (loadData == null) return null;

      const sampleList: SaidanItemData[] = loadData.sampleItemList.map((v) => {
        return {
          ...v,
          itemType: ItemType.Sample,
          imageUrl: v.croppedUrl ?? v.materialUrl ?? "",
          shelfSectionIndex: v.shelfSectionIndex ?? -1,
          acrylicBaseScaleRatio:
            v.acrylicBaseScaleRatio ?? DefaultAcrylicBaseScaleRatio,
          itemName: v.name,
        };
      });
      const nftList: SaidanItemData[] = loadData.nftItemList.map((v) => {
        return {
          ...v,
          itemType: ItemType.DigitalItemNft,
          imageUrl: "",
          shelfSectionIndex: v.shelfSectionIndex ?? -1,
          acrylicBaseScaleRatio: DefaultAcrylicBaseScaleRatio,
          itemName: v.name,
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

  const { showSmartphoneArea, hideSmartphoneArea } = useShowSmartphoneArea({
    postMessageToUnity,
  });

  // event handlers
  const handleSaveDataGenerated = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onSaveDataGenerated) return;

      const messageBody = JSON.parse(
        msgObj.messageBody,
      ) as MessageBodyForSavingSaidanData;

      if (!messageBody) return;

      var sampleItemList: SampleSaveData[] =
        messageBody.saidanData.saidanItemList
          .filter((v) => v.itemType === ItemType.Sample)
          .map((v) => ({
            id: v.id,
            itemId: v.itemId,
            stageType: v.stageType,
            shelfSectionIndex: v.shelfSectionIndex,
            position: v.position,
            rotation: v.rotation,
            scale: v.scale,
            acrylicBaseScaleRatio: v.acrylicBaseScaleRatio,
          }));
      var nftItemList: NftSaveData[] = messageBody.saidanData.saidanItemList
        .filter((v) => v.itemType === ItemType.DigitalItemNft)
        .map((v) => ({
          id: v.id,
          itemId: v.itemId,
          stageType: v.stageType,
          shelfSectionIndex: v.shelfSectionIndex,
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
    sceneType,
    unityAddEventListener,
    unityRemoveEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleItemSelected,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleRemoveItemRequested,
    handleNftModelGenerated,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleActionRegistered,
    handleActionUndone,
    handleActionRedone,
    handleItemTransformUpdated,
    handleLoadingCompleted,
    handleCheckConnection,
  });

  return {
    // states
    isSceneOpen,
    isItemsLoaded,
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
    undoAction,
    redoAction,
    deleteAllActionHistory,
    pauseUnityInputs,
    resumeUnityInputs,
    requestNftModelGeneration,
    showSmartphoneArea,
    hideSmartphoneArea,
    handleMouseUp,
  };
};
