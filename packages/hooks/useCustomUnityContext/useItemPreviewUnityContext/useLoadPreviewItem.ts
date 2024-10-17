import { useCallback, useEffect, useState } from "react";
import {
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
    if (!isLoaded || !isSceneLoaded) return;
    postMessageToLoadData();
  }, [isLoaded, isSceneLoaded, postMessageToLoadData]);

  return {
    isSceneLoaded,
    setLoadData,
    handleSceneIsLoaded: postMessageToLoadData,
  };
};
