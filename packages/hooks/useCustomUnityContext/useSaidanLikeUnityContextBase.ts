import { useCallback, useEffect, useState } from "react";
import { ItemBaseData, ItemType } from "types/unityTypes";
import { SaidanLikeData, UnitySceneType } from "./types";
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

  const {
    unityProvider,
    isLoaded,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    handleSimpleMessage,
  } = useCustomUnityContextBase({ sceneType });

  const postMessageToLoadData = useCallback(() => {
    if (!loadData || loadData.saidanId === currentSaidanId) {
      console.log("loadData is null or same saidanId" + currentSaidanId);
      return;
    }

    const json = JSON.stringify({ ...loadData });
    postMessageToUnity("LoadSaidanDataMessageReceiver", json);

    setCurrentSaidanId(loadData.saidanId);
    setLoadData(null);
    setIsSaidanSceneLoaded(true);
  }, [loadData, currentSaidanId, postMessageToUnity]);

  const requestSaveData = () => {
    postMessageToUnity("SaveSaidanDataMessageReceiver", "");
  };

  const placeNewItem = useCallback(
    (params: ItemBaseData) => {
      postMessageToUnity(
        "NewItemMessageReceiver",
        JSON.stringify({
          ...params,
          isDebug: params.isDebug ? params.isDebug : false,
        }),
      );
    },
    [postMessageToUnity],
  );

  const placeNewItemWithDrag = useCallback(
    (itemData: ItemBaseData) => {
      postMessageToUnity(
        "NewItemWithDragMessageReceiver",
        JSON.stringify({
          ...itemData,
          itemMenuX,
        }),
      );
    },
    [postMessageToUnity, itemMenuX],
  );

  const removeItem = useCallback(
    ({
      itemType,
      itemId,
      tableId,
    }: {
      itemType: ItemType;
      itemId: number;
      tableId: number;
    }) => {
      postMessageToUnity(
        "RemoveSingleItemMessageReceiver",
        JSON.stringify({
          itemType,
          itemId,
          tableId,
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
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData,
    requestSaveData,
    placeNewItem,
    placeNewItemWithDrag,
    removeItem,
    handleSimpleMessage,
    handleSceneIsLoaded: postMessageToLoadData,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
  };
};
