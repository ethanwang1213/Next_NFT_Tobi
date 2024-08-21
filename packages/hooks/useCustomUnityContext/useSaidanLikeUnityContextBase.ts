import { useCallback, useEffect, useMemo, useState } from "react";
import { UpdateIdValues, WasdParams } from "types/adminTypes";
import {
  ActionType,
  ItemBaseData,
  ItemBaseId,
  ItemId,
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
  
  const processUndoneRedoneResult = useCallback(
    (result: RequiredUndoneRedoneResult): UndoneRedoneResult => {
      // item
      // itemType, itemId
      // default item: { itemType: ItemType.Sample, itemId: -1, position: { x: -999.0, y: -999.0, z: -999.0 }, rotation: { x: -999.0, y: -999.0, z: -999.0 }, scale: -1.0 }
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
      // wallpaper, floor
      // default stage: { tint: "" }
      const wallpaper =
        result.settings.wallpaper.tint === ""
          ? undefined
          : { tint: result.settings.wallpaper.tint };
      const floor =
        result.settings.floor.tint === ""
          ? undefined
          : { tint: result.settings.floor.tint };

      // lighting
      // default light: { tint: "", brightness: -1.0 }
      // sceneLight
      const resultSceneLight = result.settings.lighting.sceneLight;
      const sceneTint =
        resultSceneLight.tint === "" ? undefined : { tint: resultSceneLight.tint };
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
        resultPointLight.tint === "" ? undefined : { tint: resultPointLight.tint };
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
        processUndoneRedoneResult(messageBody.result),
      );
    },
    [onActionUndone, setIsUndoable],
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
        processUndoneRedoneResult(messageBody.result),
      );
    },
    [onActionRedone, setIsRedoable],
  );

  return {
    isUndoable,
    isRedoable,
    handleActionUndone,
    handleActionRedone,
  };
}

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

  const {
    isUndoable,
    isRedoable,
    handleActionUndone,
    handleActionRedone,
  } = useUndoRedo({ onActionUndone, onActionRedone });

  // states
  const [loadData, setLoadData] = useState<SaidanLikeData | null>(null);
  const [currentSaidanId, setCurrentSaidanId] = useState<number>(-1);
  const [isSaidanSceneLoaded, setIsSaidanSceneLoaded] =
    useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    (ItemTypeParam & ItemBaseId & ParentId) | null
  >(null);

  const sampleIdToDigitalItemIdMap = useMemo(
    () => new Map<number, number>(),
    [],
  );
  const nftIdToDigitalItemIdMap = useMemo(() => new Map<number, number>(), []);

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
      if (item.itemType === ItemType.Sample) {
        sampleIdToDigitalItemIdMap.set(item.itemId, item.digitalItemId);
      } else if (item.itemType === ItemType.DigitalItemNft) {
        nftIdToDigitalItemIdMap.set(item.itemId, item.digitalItemId);
      }
    });

    setCurrentSaidanId(loadData.saidanId);
    setLoadData(null);
  }, [
    loadData,
    currentSaidanId,
    sampleIdToDigitalItemIdMap,
    nftIdToDigitalItemIdMap,
    postMessageToUnity,
  ]);

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
      isDebug = false,
    }: SampleBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.Sample,
        itemId: sampleItemId,
        modelType,
        modelUrl,
        imageUrl,
        digitalItemId,
        isDebug,
      };
      postMessageToUnity("NewItemMessageReceiver", JSON.stringify(data));

      sampleIdToDigitalItemIdMap.set(sampleItemId, digitalItemId);
    },
    [sampleIdToDigitalItemIdMap, postMessageToUnity],
  );

  const placeNewNft = useCallback(
    ({
      nftId,
      modelType,
      modelUrl,
      digitalItemId,
      isDebug = false,
    }: NftBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.DigitalItemNft,
        itemId: nftId,
        modelType,
        modelUrl,
        imageUrl: "",
        digitalItemId,
        isDebug,
      };
      postMessageToUnity("NewItemMessageReceiver", JSON.stringify(data));

      nftIdToDigitalItemIdMap.set(nftId, digitalItemId);
    },
    [nftIdToDigitalItemIdMap, postMessageToUnity],
  );

  const placeNewSampleWithDrag = useCallback(
    ({
      sampleItemId,
      modelType,
      modelUrl,
      imageUrl = "",
      digitalItemId,
      isDebug = false,
    }: SampleBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.Sample,
        itemId: sampleItemId,
        modelType,
        modelUrl,
        imageUrl,
        digitalItemId,
        isDebug,
      };
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify(data),
      );

      sampleIdToDigitalItemIdMap.set(sampleItemId, digitalItemId);
    },
    [sampleIdToDigitalItemIdMap, postMessageToUnity],
  );

  const placeNewNftWithDrag = useCallback(
    ({
      nftId,
      modelType,
      modelUrl,
      digitalItemId,
      isDebug = false,
    }: NftBaseDataForPlacing) => {
      const data: ItemBaseData = {
        itemType: ItemType.DigitalItemNft,
        itemId: nftId,
        modelType,
        modelUrl,
        imageUrl: "",
        digitalItemId,
        isDebug,
      };
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify(data),
      );

      nftIdToDigitalItemIdMap.set(nftId, digitalItemId);
    },
    [nftIdToDigitalItemIdMap, postMessageToUnity],
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
      if (messageBody.itemType === ItemType.Sample) {
        digitalItemId =
          sampleIdToDigitalItemIdMap.get(messageBody.itemId) ?? -1;
      } else if (messageBody.itemType === ItemType.DigitalItemNft) {
        digitalItemId = nftIdToDigitalItemIdMap.get(messageBody.itemId) ?? -1;
      }

      setSelectedItem(
        messageBody.itemId === -1
          ? null
          : {
              ...messageBody,
              digitalItemId,
            },
      );
    },
    [sampleIdToDigitalItemIdMap, nftIdToDigitalItemIdMap, setSelectedItem],
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
