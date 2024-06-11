import { useCallback, useEffect, useState } from "react";
import { UpdateIdValues } from "types/adminTypes";
import { ItemBaseData, ItemType } from "types/unityTypes";
import { Expand, SaidanLikeData, UnitySceneType } from "./types";
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

    setCurrentSaidanId(loadData.saidanId);
    setLoadData(null);
  }, [loadData, currentSaidanId, postMessageToUnity]);

  const requestSaveData = () => {
    postMessageToUnity("SaveSaidanDataMessageReceiver", "");
  };

  const placeNewSample = useCallback(
    (params: Expand<Omit<ItemBaseData, "itemType">>) => {
      postMessageToUnity(
        "NewItemMessageReceiver",
        JSON.stringify({
          itemType: ItemType.Sample,
          ...params,
          secondImageUrl: !!params.secondImageUrl ? params.secondImageUrl : "",
          isDebug: params.isDebug ? params.isDebug : false,
        }),
      );
    },
    [postMessageToUnity],
  );

  const placeNewNft = useCallback(
    (
      params: Expand<
        Omit<ItemBaseData, "itemType" | "imageUrl" | "secondImageUrl">
      >,
    ) => {
      postMessageToUnity(
        "NewItemMessageReceiver",
        JSON.stringify({
          itemType: ItemType.DigitalItemNft,
          imageUrl: "",
          secondImageUrl: "",
          ...params,
          isDebug: params.isDebug ? params.isDebug : false,
        }),
      );
    },
    [postMessageToUnity],
  );

  const placeNewSampleWithDrag = useCallback(
    (itemData: Expand<Omit<ItemBaseData, "itemType">>) => {
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify({
          itemType: ItemType.Sample,
          ...itemData,
        }),
      );
    },
    [postMessageToUnity],
  );

  const placeNewNftWithDrag = useCallback(
    (
      itemData: Expand<
        Omit<ItemBaseData, "itemType" | "imageUrl" | "secondImageUrl">
      >,
    ) => {
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify({
          itemType: ItemType.DigitalItemNft,
          imageUrl: "",
          secondImageUrl: "",
          ...itemData,
        }),
      );
    },
    [postMessageToUnity],
  );

  const removeItem = useCallback(
    (itemInfo: { itemType: ItemType; id: number; itemId: number }) => {
      postMessageToUnity(
        "RemoveSingleItemMessageReceiver",
        JSON.stringify(itemInfo),
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

  return {
    unityProvider,
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
    handleSimpleMessage,
    handleSceneIsLoaded: postMessageToLoadData,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
  };
};
