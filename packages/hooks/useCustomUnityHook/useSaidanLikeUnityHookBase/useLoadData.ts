import { useCallback, useEffect, useState } from "react";
import { ItemName, ItemType, ParentId } from "types/unityTypes";
import { MessageDestination, SaidanLikeData } from "../types";

export const useLoadData = ({
  isLoaded,
  additionalItemDataMap,
  postMessageToUnity,
}: {
  isLoaded: boolean;
  additionalItemDataMap: Map<ItemType, Map<number, ParentId & ItemName>>;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const [loadData, setLoadData] = useState<SaidanLikeData | null>(null);
  const [currentSaidanId, setCurrentSaidanId] = useState<number>(-1);
  const [isSceneOpen, setIsSceneOpen] = useState<boolean>(false);
  const [isItemsLoaded, setIsItemsLoaded] = useState<boolean>(false);

  const postMessageToLoadData = useCallback(() => {
    if (!loadData || loadData.saidanId === currentSaidanId) {
      // console.log("loadData is null or same saidanId: " + currentSaidanId);
      return;
    }

    const json = JSON.stringify({
      ...loadData,
      isFirstSaidan: false,
      removedDefautItems: [],
    });
    postMessageToUnity("LoadSaidanDataMessageReceiver", json);

    loadData.saidanItemList.forEach((item) => {
      additionalItemDataMap.get(item.itemType)?.set(item.itemId, {
        digitalItemId: item.digitalItemId,
        itemName: item.itemName,
      });
    });

    setCurrentSaidanId(loadData.saidanId);
    setLoadData(null);
  }, [loadData, currentSaidanId, additionalItemDataMap, postMessageToUnity]);

  const handleSceneIsLoaded = useCallback(() => {
    setIsSceneOpen(true);
    postMessageToLoadData();
  }, [setIsSceneOpen, postMessageToLoadData]);

  const handleLoadingCompleted = useCallback(() => {
    setIsItemsLoaded(true);
  }, [setIsItemsLoaded]);

  // load item data
  useEffect(() => {
    if (!isLoaded || !isSceneOpen) return;
    postMessageToLoadData();
  }, [isLoaded, isSceneOpen, postMessageToLoadData]);

  return {
    isSceneOpen,
    isItemsLoaded,
    setLoadData,
    handleSceneIsLoaded,
    handleLoadingCompleted,
  };
};
