import { useCallback, useEffect, useState } from "react";
import { DebugFlag, ItemBaseId, ModelParams } from "types/unityTypes";
import { AcrylicBaseScaleRatio, MessageDestination } from "../types";

type AcrylicStandData = ItemBaseId &
  Omit<ModelParams, "modelType"> &
  DebugFlag &
  AcrylicBaseScaleRatio;

export const useLoadAcrylicStand = ({
  isLoaded,
  postMessageToUnity,
}: {
  isLoaded: boolean;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [loadData, setLoadData] = useState<AcrylicStandData | null>();
  const [currentItemIndex, setCurrentItemIndex] = useState<ItemBaseId>();

  const [defaultItemData, setDefaultItemData] = useState<
    ItemBaseId & AcrylicBaseScaleRatio
  >({
    itemId: -1,
    acrylicBaseScaleRatio: 0,
  });

  const postMessageToLoadData = useCallback(() => {
    setIsSceneLoaded(true);

    if (!loadData || loadData.itemId === currentItemIndex?.itemId) {
      // console.log("loadData is null or same item");
      return;
    }

    const json = JSON.stringify(loadData);
    postMessageToUnity("LoadAcrylicStandMessageReceiver", json);

    setDefaultItemData({
      itemId: loadData.itemId,
      acrylicBaseScaleRatio: loadData.acrylicBaseScaleRatio,
    });
    setCurrentItemIndex({
      itemId: loadData.itemId,
    });
    setLoadData(null);
  }, [loadData, currentItemIndex, postMessageToUnity, setCurrentItemIndex]);

  useEffect(() => {
    if (!isLoaded || !isSceneLoaded) return;
    postMessageToLoadData();
  }, [isLoaded, isSceneLoaded, postMessageToLoadData]);

  return {
    isSceneLoaded,
    defaultItemData,
    setLoadData,
    handleSceneIsLoaded: postMessageToLoadData,
  };
};
