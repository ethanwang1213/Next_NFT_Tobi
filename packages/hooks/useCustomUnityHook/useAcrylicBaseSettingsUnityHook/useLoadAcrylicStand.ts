import { useCallback, useEffect, useState } from "react";
import {
  AcrylicBaseScaleRatio,
  DebugFlag,
  ItemBaseId,
  ModelParams,
} from "types/unityTypes";
import { MessageDestination } from "../types";

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
  const [isSceneOpen, setIsSceneOpen] = useState(false);
  const [loadData, setLoadData] = useState<AcrylicStandData | null>();
  const [currentItemIndex, setCurrentItemIndex] = useState<ItemBaseId>();

  const [defaultItemData, setDefaultItemData] = useState<
    ItemBaseId & AcrylicBaseScaleRatio
  >({
    itemId: -1,
    acrylicBaseScaleRatio: 0,
  });

  const postMessageToLoadData = useCallback(() => {
    if (
      isSceneOpen ||
      !loadData ||
      loadData.itemId === currentItemIndex?.itemId
    ) {
      // console.log("loadData is null or same item");
      return;
    }
    postMessageToUnity("ConnectionCheckedMessageReceiver", "");

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
  }, [
    isSceneOpen,
    loadData,
    currentItemIndex,
    postMessageToUnity,
    setCurrentItemIndex,
  ]);

  const handleItemIsInitialized = useCallback(() => {
    setIsSceneOpen(true);
  }, [setIsSceneOpen]);

  useEffect(() => {
    if (!isSceneOpen) return;
    if (!isLoaded) {
      setIsSceneOpen(false);
      setCurrentItemIndex(undefined);
      return;
    }
    postMessageToLoadData();
  }, [isLoaded, isSceneOpen, postMessageToLoadData]);

  return {
    isSceneOpen,
    defaultItemData,
    setLoadData,
    handleSceneIsLoaded: postMessageToLoadData,
    handleItemIsInitialized,
  };
};
