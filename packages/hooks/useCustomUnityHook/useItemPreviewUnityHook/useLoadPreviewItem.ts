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
  const [isSceneOpen, setIsSceneOpen] = useState(false);
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
    if (
      isSceneOpen ||
      !loadData ||
      (loadData.itemType === currentItemIndex?.itemType &&
        loadData.itemId === currentItemIndex?.itemId)
    ) {
      // console.log("loadData is null or same item");
      return;
    }
    postMessageToUnity("ConnectionCheckedMessageReceiver", "");

    const json = JSON.stringify(loadData);
    postMessageToUnity("ViewItemModelMessageReceiver", json);

    setCurrentItemIndex({
      itemType: loadData.itemType,
      itemId: loadData.itemId,
    });
    setLoadData(null);
  }, [
    isSceneOpen,
    loadData,
    currentItemIndex,
    postMessageToUnity,
    setCurrentItemIndex,
    setLoadData,
  ]);

  const handleSaidanDetailViewIsInitialized = useCallback(() => {
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
    setLoadData: wrappedSetLoadData,
    handleSceneIsLoaded: postMessageToLoadData,
    handleSaidanDetailViewIsInitialized,
  };
};
