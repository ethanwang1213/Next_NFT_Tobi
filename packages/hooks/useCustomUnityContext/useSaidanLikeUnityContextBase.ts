import { useCallback, useEffect, useState } from "react";
import { ItemBaseData, ItemType } from "types/unityTypes";
import { SaidanLikeData, UnitySceneType } from "./types";
import { useCustomUnityContextBase } from "./useCustomUnityContextBase";
import { UpdateIdValues } from "types/adminTypes";

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

  const base = useCustomUnityContextBase({ sceneType });

  const postMessageToLoadData = useCallback(() => {
    if (!loadData || loadData.saidanId === currentSaidanId) {
      console.log("loadData is null or same saidanId" + currentSaidanId);
      return;
    }

    const json = JSON.stringify({ ...loadData });
    base.postMessageToUnity("LoadSaidanDataMessageReceiver", json);

    setCurrentSaidanId(loadData.saidanId);
    setLoadData(null);
    setIsSaidanSceneLoaded(true);
  }, [loadData, currentSaidanId, base.postMessageToUnity]);

  const requestSaveData = () => {
    base.postMessageToUnity("SaveSaidanDataMessageReceiver", "");
  };

  const placeNewItem = useCallback(
    (params: ItemBaseData) => {
      base.postMessageToUnity(
        "NewItemMessageReceiver",
        JSON.stringify({
          ...params,
          isDebug: params.isDebug ? params.isDebug : false,
        }),
      );
    },
    [base.postMessageToUnity],
  );

  const placeNewItemWithDrag = useCallback(
    (itemData: ItemBaseData) => {
      base.postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify({
          ...itemData,
          itemMenuX,
        }),
      );
    },
    [base.postMessageToUnity, itemMenuX],
  );

  const removeItem = useCallback(
    ({
      id: id,
      itemType,
      itemId,
    }: {
      id: number;
      itemType: ItemType;
      itemId: number;
    }) => {
      base.postMessageToUnity(
        "RemoveSingleItemMessageReceiver",
        JSON.stringify({
          id: id,
          itemType,
          itemId,
        }),
      );
    },
    [base.postMessageToUnity],
  );

  const updateIdValues: UpdateIdValues = useCallback(
    ({ idPairs }) => {
      base.postMessageToUnity(
        "UpdateItemIdMessageReceiver",
        JSON.stringify({
          idPairs,
        }),
      );
    },
    [base.postMessageToUnity],
  );

  useEffect(() => {
    if (!base.isLoaded || !isSaidanSceneLoaded) return;
    postMessageToLoadData();
  }, [base.isLoaded, isSaidanSceneLoaded, postMessageToLoadData]);

  useEffect(() => {
    if (!base.isLoaded || !isSaidanSceneLoaded || !itemMenuX || itemMenuX < 0)
      return;
    base.postMessageToUnity(
      "ItemMenuXMessageReceiver",
      JSON.stringify({ itemMenuX }),
    );
  }, [base.isLoaded, isSaidanSceneLoaded, itemMenuX, base.postMessageToUnity]);

  const handleDragStarted = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragEnded = useCallback(() => {
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
    unityProvider: base.unityProvider,
    isDragging,
    addEventListener,
    removeEventListener,
    postMessageToUnity: base.postMessageToUnity,
    setLoadData,
    requestSaveData,
    placeNewItem,
    placeNewItemWithDrag,
    removeItem,
    updateIdValues,
    handleSimpleMessage: base.handleSimpleMessage,
    handleSceneIsLoaded: postMessageToLoadData,
    handleDragStarted,
    handleDragEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
  };
};
