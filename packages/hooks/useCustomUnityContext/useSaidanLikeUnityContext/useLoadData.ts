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
  const [isSaidanSceneLoaded, setIsSaidanSceneLoaded] =
    useState<boolean>(false);

  const postMessageToLoadData = useCallback(() => {
    setIsSaidanSceneLoaded(true);

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

  // load item data
  useEffect(() => {
    if (!isLoaded || !isSaidanSceneLoaded) return;
    postMessageToLoadData();
  }, [isLoaded, isSaidanSceneLoaded, postMessageToLoadData]);

  return { isSaidanSceneLoaded, setLoadData, postMessageToLoadData };
};
