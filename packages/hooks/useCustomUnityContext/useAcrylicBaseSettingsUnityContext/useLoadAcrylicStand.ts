import { useCallback, useEffect, useState } from "react";
import { DebugFlag, ItemBaseId, ModelParams } from "types/unityTypes";
import { MessageDestination } from "../types";

type AcrylicStandData = ItemBaseId &
  DebugFlag &
  Omit<ModelParams, "modelType"> & {
    acrylicBaseScaleRatio: number;
  };

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
  const [defaultAcrylicBaseScaleRatio, setDefaultAcrylicBaseScaleRatio] =
    useState(0);

  const postMessageToLoadData = useCallback(() => {
    setIsSceneLoaded(true);

    if (!loadData || loadData.itemId === currentItemIndex?.itemId) {
      console.log("loadData is null or same item");
      return;
    }

    const json = JSON.stringify(loadData);
    postMessageToUnity("LoadAcrylicStandMessageReceiver", json);

    setDefaultAcrylicBaseScaleRatio(loadData.acrylicBaseScaleRatio);
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
    defaultAcrylicBaseScaleRatio,
    setLoadData,
    handleSceneIsLoaded: postMessageToLoadData,
  };
};
