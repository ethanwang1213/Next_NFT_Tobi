import { useCallback, useEffect, useMemo, useState } from "react";
import { UpdateIdValues, WasdParams } from "types/adminTypes";
import {
  ActionType,
  ItemBaseData,
  ItemBaseId,
  ItemId,
  ItemName,
  ItemType,
  ItemTypeParam,
  NftBaseDataForPlacing,
  ParentId,
  SampleBaseDataForPlacing,
  Vector3,
} from "types/unityTypes";
import {
  RequiredUndoneRedoneResult,
  SaidanLikeData,
  UndoneOrRedone,
  UndoneRedoneResult,
  UnityMessageJson,
  UnitySceneType,
} from "./types";
import { useCustomUnityContextBase } from "./useCustomUnityContextBase";

const useUndoRedo = ({
  onActionUndone,
  onActionRedone,
}: {
  onActionUndone?: UndoneOrRedone;
  onActionRedone?: UndoneOrRedone;
}) => {
  const [isUndoable, setIsUndoable] = useState<boolean>(false);
  const [isRedoable, setIsRedoable] = useState<boolean>(false);

  /**
   * Process the result of undone or redone action.
   * Result data includes default values which are not necessary for a result ActionType.
   * So, this function processes the result data to remove default values.
   * Before:
   *   { item: { itemType, itemId, position, rotation, scale }, settings: { wallpaper, floor, lighting } }
   * After:
   *   e.g. redo TranslateItem -> { item: { itemType, itemId, position } }
   *   e.g. redo ChangeWallpaperColor -> { settings: { wallpaper: { tint } } }
   *   e.g. redo RemoveItem -> { item: { itemType, itemId } }
   */
  const removeDefaultValues = useCallback(
    (result: RequiredUndoneRedoneResult): UndoneRedoneResult => {
      // item
      // default values: { item: { itemType: ItemType.Sample, itemId: -1, position: { x: -999.0, y: -999.0, z: -999.0 }, rotation: { x: -999.0, y: -999.0, z: -999.0 }, scale: -1.0 } }

      // itemType, itemId
      const itemType = result.item.itemType;
      const itemId = result.item.itemId === -1 ? undefined : result.item.itemId;

      // position, rotation
      const isDefaultVec = (v: Vector3) => {
        return v.x === -999.0 && v.y === -999.0 && v.z === -999.0;
      };
      const position = isDefaultVec(result.item.position)
        ? undefined
        : result.item.position;
      const rotation = isDefaultVec(result.item.rotation)
        ? undefined
        : result.item.rotation;

      // scale
      const scale = result.item.scale === -1.0 ? undefined : result.item.scale;

      // merge item values
      const item = result.item
        ? itemId
          ? { itemType, itemId, position, rotation, scale }
          : undefined
        : undefined;

      // settings
      // default values: { settings: { wallpaper: { tint: "" }, floor: { tint: "" }, lighting: { sceneLight: { tint: "", brightness: -1.0 }, pointLight: { tint: "", brightness: -1.0 } } } }

      // wallpaper
      const wallpaper =
        result.settings.wallpaper.tint === ""
          ? undefined
          : { tint: result.settings.wallpaper.tint };

      // floor
      const floor =
        result.settings.floor.tint === ""
          ? undefined
          : { tint: result.settings.floor.tint };

      // sceneLight
      const resultSceneLight = result.settings.lighting.sceneLight;
      const sceneTint =
        resultSceneLight.tint === ""
          ? undefined
          : { tint: resultSceneLight.tint };
      const sceneBrightness =
        resultSceneLight.brightness === -1.0
          ? undefined
          : { brightness: resultSceneLight.brightness };
      const sceneLight =
        !sceneTint && !sceneBrightness
          ? undefined
          : { ...sceneTint, ...sceneBrightness };

      // pointLight
      const resultPointLight = result.settings.lighting.pointLight;
      const pointTint =
        resultPointLight.tint === ""
          ? undefined
          : { tint: resultPointLight.tint };
      const pointBrightness =
        resultPointLight.brightness === -1.0
          ? undefined
          : { brightness: resultPointLight.brightness };
      const pointLight =
        !pointTint && !pointBrightness
          ? undefined
          : { ...pointTint, ...pointBrightness };

      // merge lighting values
      const lighting =
        !sceneLight && !pointLight ? undefined : { sceneLight, pointLight };

      // merge settings values
      const settings = result.settings
        ? wallpaper || floor || lighting
          ? { wallpaper, floor, lighting }
          : undefined
        : undefined;

      return {
        item,
        settings,
      };
    },
    [],
  );

  const replaceItemNameOnText = useCallback(
    (notifText: string, itemName: string) =>
      itemName === ""
        ? notifText.replace("ITEM_NAME", "the Sample Item")
        : notifText.replace("ITEM_NAME", itemName),
    [],
  );

  const handleActionUndone = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onActionUndone) return;
      const messageBody = JSON.parse(msgObj.messageBody) as {
        actionType: ActionType;
        text: string;
        isUndoable: boolean;
        result: RequiredUndoneRedoneResult;
      };
      if (!messageBody) return;
      setIsUndoable(messageBody.isUndoable);
      setIsRedoable(true);

      onActionUndone(
        messageBody.actionType,
        messageBody.text,
        removeDefaultValues(messageBody.result),
        replaceItemNameOnText,
      );
    },
    [onActionUndone, setIsUndoable, removeDefaultValues],
  );

  const handleActionRedone = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onActionRedone) return;
      const messageBody = JSON.parse(msgObj.messageBody) as {
        actionType: ActionType;
        text: string;
        isRedoable: boolean;
        result: RequiredUndoneRedoneResult;
      };
      if (!messageBody) return;
      setIsRedoable(messageBody.isRedoable);
      setIsUndoable(true);

      onActionRedone(
        messageBody.actionType,
        messageBody.text,
        removeDefaultValues(messageBody.result),
        replaceItemNameOnText,
      );
    },
    [onActionRedone, setIsRedoable, removeDefaultValues],
  );

  return {
    isUndoable,
    isRedoable,
    handleActionUndone,
    handleActionRedone,
  };
};

export const useSaidanLikeUnityContextBase = ({
  sceneType,
  itemMenuX,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onActionUndone,
  onActionRedone,
}: {
  sceneType: UnitySceneType;
  itemMenuX: number;
  onRemoveItemEnabled?: () => void;
  onRemoveItemDisabled?: () => void;
  onActionUndone?: UndoneOrRedone;
  onActionRedone?: UndoneOrRedone;
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
    // event handler
    handleSimpleMessage,
  } = useCustomUnityContextBase({ sceneType });

  const { isUndoable, isRedoable, handleActionUndone, handleActionRedone } =
    useUndoRedo({ onActionUndone, onActionRedone });

  // states
  const [loadData, setLoadData] = useState<SaidanLikeData | null>(null);
  const [currentSaidanId, setCurrentSaidanId] = useState<number>(-1);
  const [isSaidanSceneLoaded, setIsSaidanSceneLoaded] =
    useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    (ItemTypeParam & ItemBaseId & ParentId) | null
  >(null);

  const additionalItemDataMap = useMemo(
    () =>
      new Map<ItemType, Map<number, ParentId & ItemName>>([
        [ItemType.Sample, new Map<number, ParentId & ItemName>()],
        [ItemType.DigitalItemNft, new Map<number, ParentId & ItemName>()],
      ]),
    [],
  );

  // functions
  const postMessageToLoadData = useCallback(() => {
    setIsSaidanSceneLoaded(true);

    if (!loadData || loadData.saidanId === currentSaidanId) {
      console.log("loadData is null or same saidanId" + currentSaidanId);
      return;
    }

    const json = JSON.stringify({ ...loadData });
    postMessageToUnity("LoadSaidanDataMessageReceiver", json);

    loadData.saidanItemList.forEach((item) => {
      additionalItemDataMap[item.itemType].set(item.itemId, {
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
      sampleItemId,
      modelType,
      modelUrl,
      imageUrl = "",
      digitalItemId,
      sampleName,
      isDebug = false,
    }: SampleBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.Sample,
        itemId: sampleItemId,
        modelType,
        modelUrl,
        imageUrl,
        digitalItemId,
        itemName: sampleName,
        isDebug,
      };
      postMessageToUnity("NewItemMessageReceiver", JSON.stringify(data));

      additionalItemDataMap[ItemType.Sample].set(sampleItemId, {
        digitalItemId,
        itemName: sampleName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const placeNewNft = useCallback(
    ({
      nftId,
      modelType,
      modelUrl,
      digitalItemId,
      nftName,
      isDebug = false,
    }: NftBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.DigitalItemNft,
        itemId: nftId,
        modelType,
        modelUrl,
        imageUrl: "",
        digitalItemId,
        itemName: nftName,
        isDebug,
      };
      postMessageToUnity("NewItemMessageReceiver", JSON.stringify(data));

      additionalItemDataMap[ItemType.DigitalItemNft].set(nftId, {
        digitalItemId,
        itemName: nftName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const placeNewSampleWithDrag = useCallback(
    ({
      sampleItemId,
      modelType,
      modelUrl,
      imageUrl = "",
      digitalItemId,
      sampleName,
      isDebug = false,
    }: SampleBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.Sample,
        itemId: sampleItemId,
        modelType,
        modelUrl,
        imageUrl,
        digitalItemId,
        itemName: sampleName,
        isDebug,
      };
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify(data),
      );

      additionalItemDataMap[ItemType.Sample].set(sampleItemId, {
        digitalItemId,
        itemName: sampleName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const placeNewNftWithDrag = useCallback(
    ({
      nftId,
      modelType,
      modelUrl,
      digitalItemId,
      nftName,
      isDebug = false,
    }: NftBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.DigitalItemNft,
        itemId: nftId,
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

      additionalItemDataMap[ItemType.DigitalItemNft].set(nftId, {
        digitalItemId,
        itemName: nftName,
      });
    },
    [additionalItemDataMap, postMessageToUnity],
  );

  const removeItem = useCallback(
    ({ itemType, itemId, id }: ItemTypeParam & ItemBaseId & ItemId) => {
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
      postMessageToUnity(
        "InputWasdMessageReceiver",
        JSON.stringify({ wKey, aKey, sKey, dKey }),
      );
    },
    [postMessageToUnity],
  );

  // undo/redo
  const undoAction = useCallback(() => {
    postMessageToUnity("UndoActionMessageReceiver", "");
  }, [postMessageToUnity]);

  const redoAction = useCallback(() => {
    postMessageToUnity("RedoActionMessageReceiver", "");
  }, [postMessageToUnity]);

  const deleteAllActionHistory = useCallback(() => {
    postMessageToUnity("DeleteAllActionHistoryMessageReceiver", "");
  }, [postMessageToUnity]);

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
      const messageBody = JSON.parse(msgObj.messageBody) as {
        itemType: ItemType;
        itemId: number;
      };

      if (!messageBody) return;

      // get digitalItemId
      var digitalItemId = -1;
      digitalItemId =
        additionalItemDataMap[messageBody.itemType].get(messageBody.itemId)
          ?.digitalItemId ?? -1;

      setSelectedItem(
        messageBody.itemId === -1
          ? null
          : {
              ...messageBody,
              digitalItemId,
            },
      );
    },
    [additionalItemDataMap, setSelectedItem],
  );

  return {
    // states
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
    handleSceneIsLoaded: postMessageToLoadData,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleItemSelected,
    handleActionUndone,
    handleActionRedone,
  };
};
