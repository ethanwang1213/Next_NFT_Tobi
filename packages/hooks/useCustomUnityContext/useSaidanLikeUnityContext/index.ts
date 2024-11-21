import { useCallback, useEffect, useMemo, useState } from "react";
import { UpdateIdValues, WasdParams } from "types/adminTypes";
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
  SaidanLikeData,
  SelectedItem,
  UndoneOrRedoneHandler,
  UnityMessageJson,
  UnitySceneType,
} from "../types";
import { useCustomUnityContextBase } from "../useCustomUnityContextBase";
import { useMouseUp } from "./useMouseUp";
import { useRequestNftModelGeneration } from "./useRequestNftModelGeneration";
import { useUndoRedo } from "./useUndoRedo";

export const useSaidanLikeUnityContextBase = ({
  sceneType,
  itemMenuX,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onActionUndone,
  onActionRedone,
  onNftModelGenerated,
}: {
  sceneType: UnitySceneType;
  itemMenuX: number;
  onRemoveItemEnabled?: () => void;
  onRemoveItemDisabled?: () => void;
  onActionUndone?: UndoneOrRedoneHandler;
  onActionRedone?: UndoneOrRedoneHandler;
  onNftModelGenerated?: NftModelGeneratedHandler;
}) => {
  const {
    // states
    unityProvider,
    isLoaded,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    pauseUnityInputs,
    resumeUnityInputs,
    unload,
    // event handler
    handleSimpleMessage,
  } = useCustomUnityContextBase({ sceneType });

  // states
  const [loadData, setLoadData] = useState<SaidanLikeData | null>(null);
  const [currentSaidanId, setCurrentSaidanId] = useState<number>(-1);
  const [isSaidanSceneLoaded, setIsSaidanSceneLoaded] =
    useState<boolean>(false);
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
    isUndoable,
    isRedoable,
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
  const postMessageToLoadData = useCallback(() => {
    setIsSaidanSceneLoaded(true);

    if (!loadData || loadData.saidanId === currentSaidanId) {
      // console.log("loadData is null or same saidanId: " + currentSaidanId);
      return;
    }

    const json = JSON.stringify({
      ...loadData,
      isFirstSaidan: false,
      removedDefautItems: [],
    });
    postMessageToUnity("LoadSaidanDataMessageReceiver", json);

    loadData.saidanItemList.forEach((item) => {
      additionalItemDataMap.get(item.itemType)?.set(item.itemId, {
        digitalItemId: item.digitalItemId,
        itemName: item.itemName,
      });
    });

    setCurrentSaidanId(loadData.saidanId);
    setLoadData(null);
  }, [loadData, currentSaidanId, additionalItemDataMap, postMessageToUnity]);

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

  const removeItem = useCallback(
    ({ itemType, itemId, id }: ItemTypeParam & ItemBaseId & DecorationId) => {
      postMessageToUnity(
        "RemoveSingleItemMessageReceiver",
        JSON.stringify({ itemType, itemId, id }),
      );
    },
    [postMessageToUnity],
  );

  const updateIdValues: UpdateIdValues = useCallback(
    ({ idPairs }) => {
      postMessageToUnity(
        "UpdateItemIdMessageReceiver",
        JSON.stringify({
          idPairs,
        }),
      );
    },
    [postMessageToUnity],
  );

  const inputWasd = useCallback(
    ({ wKey, aKey, sKey, dKey }: WasdParams) => {
      if (!isLoaded || !isSaidanSceneLoaded) return;
      postMessageToUnity(
        "InputWasdMessageReceiver",
        JSON.stringify({ wKey, aKey, sKey, dKey }),
      );
    },
    [isLoaded, isSaidanSceneLoaded, postMessageToUnity],
  );

  const { requestNftModelGeneration, handleNftModelGenerated } =
    useRequestNftModelGeneration({
      postMessageToUnity,
      onNftModelGenerated,
    });

  // load item data
  useEffect(() => {
    if (!isLoaded || !isSaidanSceneLoaded) return;
    postMessageToLoadData();
  }, [isLoaded, isSaidanSceneLoaded, postMessageToLoadData]);

  useEffect(() => {
    if (!isLoaded || !isSaidanSceneLoaded || !itemMenuX || itemMenuX < 0)
      return;
    postMessageToUnity(
      "ItemMenuXMessageReceiver",
      JSON.stringify({ itemMenuX }),
    );
  }, [isLoaded, isSaidanSceneLoaded, itemMenuX, postMessageToUnity]);

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
    unityProvider,
    isLoaded: isSaidanSceneLoaded,
    isDragging,
    selectedItem,
    isUndoable,
    isRedoable,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData,
    unload,
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
    requestNftModelGeneration,
    // event handlers
    handleSimpleMessage,
    handleSceneIsLoaded: postMessageToLoadData,
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
  };
};
