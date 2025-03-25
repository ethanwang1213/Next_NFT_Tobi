import { useCustomUnityContext } from "contexts/CustomUnityContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NotifyAddRequestResult } from "types/adminTypes";
import {
  DecorationId,
  ItemBaseData,
  ItemBaseId,
  ItemName,
  ItemType,
  ItemTypeParam,
  NftBaseDataForPlacing,
  ParentId,
  SampleBaseDataForPlacing,
} from "types/unityTypes";
import { DefaultAcrylicBaseScaleRatio } from "../constants";
import {
  NftModelGeneratedHandler,
  PositionOnPlane,
  SelectedItem,
  UndoneOrRedoneHandler,
  UnityMessageJson,
  UnitySceneType,
} from "../types";
import { useCustomUnityHookBase } from "../useCustomUnityHookBase";
import { useKeyShortcut } from "./useKeyShortcut";
import { useLoadData } from "./useLoadData";
import { useMouseUp } from "./useMouseUp";
import { useRequestNftModelGeneration } from "./useRequestNftModelGeneration";
import { useUndoRedo } from "./useUndoRedo";

export const useSaidanLikeUnityHookBase = ({
  sceneType,
  itemMenuX,
  rollbackDialogRef,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onActionUndone,
  onActionRedone,
  onNftModelGenerated,
}: {
  sceneType: UnitySceneType;
  itemMenuX: number;
  rollbackDialogRef: React.RefObject<HTMLDialogElement>;
  onRemoveItemEnabled?: () => void;
  onRemoveItemDisabled?: () => void;
  onActionUndone?: UndoneOrRedoneHandler;
  onActionRedone?: UndoneOrRedoneHandler;
  onNftModelGenerated?: NftModelGeneratedHandler;
}) => {
  const {
    // functions
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handler
    handleSimpleMessage,
  } = useCustomUnityHookBase({ sceneType });

  const { isLoaded } = useCustomUnityContext();

  // states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const additionalItemDataMap = useMemo(
    () =>
      new Map<ItemType, Map<number, ParentId & ItemName>>([
        [ItemType.Sample, new Map<number, ParentId & ItemName>()],
        [ItemType.DigitalItemNft, new Map<number, ParentId & ItemName>()],
      ]),
    [],
  );

  const {
    isSceneOpen,
    isItemsLoaded,
    setLoadData,
    handleSceneIsLoaded,
    handleLoadingCompleted,
    handleCheckConnection,
  } = useLoadData({
    isLoaded,
    additionalItemDataMap,
    postMessageToUnity,
  });

  const {
    isUndoable,
    isRedoable,
    setIsUndoable,
    setIsRedoable,
    undoAction,
    redoAction,
    deleteAllActionHistory,
    handleActionRegistered,
    handleActionUndone,
    handleActionRedone,
  } = useUndoRedo({
    additionalItemDataMap,
    onActionUndone,
    onActionRedone,
    postMessageToUnity,
  });

  // functions
  const requestSaveData = () => {
    postMessageToUnity("SaveSaidanDataMessageReceiver", "");
  };

  const placeNewSample = useCallback(
    ({
      itemId,
      modelType,
      modelUrl,
      imageUrl = "",
      acrylicBaseScaleRatio = DefaultAcrylicBaseScaleRatio,
      digitalItemId,
      sampleName,
      isDebug = false,
    }: SampleBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.Sample,
        itemId,
        modelType,
        modelUrl,
        imageUrl,
        acrylicBaseScaleRatio,
        digitalItemId,
        itemName: sampleName,
        isDebug,
      };
      postMessageToUnity("NewItemMessageReceiver", JSON.stringify(data));

      additionalItemDataMap.get(ItemType.Sample)?.set(itemId, {
        digitalItemId,
        itemName: sampleName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const placeNewNft = useCallback(
    ({
      itemId,
      modelType,
      modelUrl,
      digitalItemId,
      nftName,
      isDebug = false,
    }: NftBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.DigitalItemNft,
        itemId: itemId,
        modelType,
        modelUrl,
        imageUrl: "",
        digitalItemId,
        itemName: nftName,
        isDebug,
      };
      postMessageToUnity("NewItemMessageReceiver", JSON.stringify(data));

      additionalItemDataMap.get(ItemType.DigitalItemNft)?.set(itemId, {
        digitalItemId,
        itemName: nftName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const placeNewSampleWithDrag = useCallback(
    ({
      itemId,
      modelType,
      modelUrl,
      imageUrl = "",
      acrylicBaseScaleRatio = DefaultAcrylicBaseScaleRatio,
      digitalItemId,
      sampleName,
      isDebug = false,
    }: SampleBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.Sample,
        itemId,
        modelType,
        modelUrl,
        imageUrl,
        acrylicBaseScaleRatio,
        digitalItemId,
        itemName: sampleName,
        isDebug,
      };
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify(data),
      );

      additionalItemDataMap.get(ItemType.Sample)?.set(itemId, {
        digitalItemId,
        itemName: sampleName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const placeNewNftWithDrag = useCallback(
    ({
      itemId,
      modelType,
      modelUrl,
      digitalItemId,
      nftName,
      isDebug = false,
    }: NftBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.DigitalItemNft,
        itemId,
        modelType,
        modelUrl,
        imageUrl: "",
        digitalItemId,
        itemName: nftName,
        isDebug,
      };
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify(data),
      );

      additionalItemDataMap.get(ItemType.DigitalItemNft)?.set(itemId, {
        digitalItemId,
        itemName: nftName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const duplicateSelectedItem = useCallback(() => {
    postMessageToUnity("DuplicateSelectedItemMessageReceiver", "");
  }, [postMessageToUnity]);

  const removeItem = useCallback(
    ({ itemType, itemId, id }: ItemTypeParam & ItemBaseId & DecorationId) => {
      postMessageToUnity(
        "RemoveSingleItemMessageReceiver",
        JSON.stringify({ itemType, itemId, id }),
      );
    },
    [postMessageToUnity],
  );

  const removeSelectedItem = useCallback(() => {
    postMessageToUnity("RemoveSelectedItemMessageReceiver", "");
  }, [postMessageToUnity]);

  const notifyAddRequestResult: NotifyAddRequestResult = useCallback(
    ({ isSuccess, idPairs, apiRequestId }) => {
      if (!isSuccess) {
        rollbackDialogRef.current?.showModal();
      }
      postMessageToUnity(
        "NotifyAddRequestResultMessageReceiver",
        JSON.stringify({
          isSuccess,
          idPairs,
          apiRequestId,
        }),
      );
    },
    [postMessageToUnity],
  );

  useKeyShortcut({
    isLoaded,
    isSceneOpen,
    postMessageToUnity,
    handleCtrlZ: undoAction,
    handleCtrlShiftZ: redoAction,
    handleCtrlD: duplicateSelectedItem,
    handleDelete: removeSelectedItem,
  });

  const { requestNftModelGeneration, handleNftModelGenerated } =
    useRequestNftModelGeneration({
      postMessageToUnity,
      onNftModelGenerated,
    });

  useEffect(() => {
    if (!isLoaded || !isSceneOpen || !itemMenuX || itemMenuX < 0) return;
    postMessageToUnity(
      "ItemMenuXMessageReceiver",
      JSON.stringify({ itemMenuX }),
    );
  }, [isLoaded, isSceneOpen, itemMenuX, postMessageToUnity]);

  // event handler
  const handleDragPlacingStarted = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragPlacingEnded = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleRemoveItemEnabled = useCallback(() => {
    if (!onRemoveItemEnabled) return;
    onRemoveItemEnabled();
  }, [onRemoveItemEnabled]);

  const handleRemoveItemDisabled = useCallback(() => {
    if (!onRemoveItemDisabled) return;
    onRemoveItemDisabled();
  }, [onRemoveItemDisabled]);

  const handleItemSelected = useCallback(
    (msgObj: UnityMessageJson) => {
      const messageBody = JSON.parse(msgObj.messageBody) as Omit<
        SelectedItem,
        "digitalItemId"
      >;

      if (!messageBody) return;

      // get digitalItemId
      var digitalItemId =
        additionalItemDataMap.get(messageBody.itemType)?.get(messageBody.itemId)
          ?.digitalItemId ?? -1;

      const fixNumber = (num: number) => parseFloat(num.toFixed(3));
      const positionOnPlane: PositionOnPlane = {
        x: fixNumber(messageBody.positionOnPlane.x),
        y: fixNumber(messageBody.positionOnPlane.y),
      };
      const rotationAngle = fixNumber(messageBody.rotationAngle);
      const scale = fixNumber(messageBody.scale);

      setSelectedItem(
        messageBody.itemId === -1
          ? null
          : {
              ...messageBody,
              positionOnPlane,
              rotationAngle,
              scale,
              digitalItemId,
            },
      );
    },
    [additionalItemDataMap, setSelectedItem],
  );

  const { handleMouseUp } = useMouseUp({ postMessageToUnity });

  return {
    // states
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
    notifyAddRequestResult,
    setIsUndoable,
    setIsRedoable,
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
  };
};
