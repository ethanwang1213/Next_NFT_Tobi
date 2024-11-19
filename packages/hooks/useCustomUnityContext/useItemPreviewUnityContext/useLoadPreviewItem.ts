import { useCallback, useEffect, useState } from "react";
import {
  AcrylicBaseScaleRatio,
  DebugFlag,
  ItemBaseId,
  ItemTypeParam,
  ModelParams,
  TextureParam,
} from "types/unityTypes";
import { MessageDestination } from "../types";

type PreviewItemData = ItemTypeParam &
  ItemBaseId &
  ModelParams &
  TextureParam &
  AcrylicBaseScaleRatio &
  DebugFlag;

type ItemIndex = ItemTypeParam & ItemBaseId;

export const useLoadPreviewItem = ({
  isLoaded,
  postMessageToUnity,
}: {
  isLoaded: boolean;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [loadData, setLoadData] = useState<PreviewItemData | null>();
  const [currentItemIndex, setCurrentItemIndex] = useState<ItemIndex>();

  const wrappedSetLoadData = useCallback(
    (data: PreviewItemData) => {
      data.acrylicBaseScaleRatio = data.acrylicBaseScaleRatio ?? 1.0;
      setLoadData(data);
    },
    [setLoadData],
  );

  const postMessageToLoadData = useCallback(() => {
    setIsSceneLoaded(true);

    if (
      !loadData ||
      (loadData.itemType === currentItemIndex?.itemType &&
        loadData.itemId === currentItemIndex?.itemId)
    ) {
      // console.log("loadData is null or same item");
      return;
    }

    const json = JSON.stringify(loadData);
    postMessageToUnity("ViewItemModelMessageReceiver", json);

    setCurrentItemIndex({
      itemType: loadData.itemType,
      itemId: loadData.itemId,
    });
    setLoadData(null);
  }, [loadData, currentItemIndex, postMessageToUnity, setCurrentItemIndex]);

  useEffect(() => {
    if (!isSceneLoaded) return;
    if (!isLoaded) {
      setIsSceneLoaded(false);
      setCurrentItemIndex(undefined);
      return;
    }
    postMessageToLoadData();
  }, [isLoaded, isSceneLoaded, postMessageToLoadData]);

  return {
    isSceneLoaded,
    setLoadData: wrappedSetLoadData,
    handleSceneIsLoaded: postMessageToLoadData,
  };
};
