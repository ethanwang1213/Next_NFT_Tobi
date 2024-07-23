import { useCallback, useEffect, useMemo, useState } from "react";
import { UpdateIdValues, WasdParams } from "types/adminTypes";
import {
  ItemBaseData,
  ItemBaseId,
  ItemId,
  ItemType,
  ItemTypeParam,
  NftBaseDataForPlacing,
  ParentId,
  SampleBaseDataForPlacing,
} from "types/unityTypes";
import { SaidanLikeData, UnityMessageJson, UnitySceneType } from "./types";
import { useCustomUnityContextBase } from "./useCustomUnityContextBase";

export const useSaidanLikeUnityContextBase = ({
  sceneType,
  itemMenuX,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
}: {
  sceneType: UnitySceneType;
  itemMenuX: number;
  onRemoveItemEnabled?: () => void;
  onRemoveItemDisabled?: () => void;
}) => {
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

  const {
    unityProvider,
    isLoaded,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    handleSimpleMessage,
  } = useCustomUnityContextBase({ sceneType });

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
    unityProvider,
    isLoaded,
    isDragging,
    selectedItem,
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
    handleSceneIsLoaded: postMessageToLoadData,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleItemSelected,
  };
};
