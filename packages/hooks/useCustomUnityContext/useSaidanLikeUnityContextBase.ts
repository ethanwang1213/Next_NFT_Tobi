import { useCallback, useEffect, useState } from "react";
import { ItemBaseData } from "types/adminTypes";
import { SaidanLikeData, UnitySceneType } from "./unityType";
import { useCustomUnityContextBase } from "./useCustomUnityContextBase";

export const useSaidanLikeUnityContextBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  const [loadData, setLoadData] = useState<SaidanLikeData | null>(null);
  const [currentSaidanId, setCurrentSaidanId] = useState<number>(-1);

  const {
    unityProvider,
    isLoaded,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    resolveUnityMessage,
    handleSimpleMessage,
  } = useCustomUnityContextBase({ sceneType });

  const postMessageToLoadData = useCallback(() => {
    if (!loadData || loadData.saidanId === currentSaidanId) {
      console.log("loadData is null or same saidanId" + currentSaidanId);
      return;
    }

    const json = JSON.stringify(loadData);
    console.log(json);
    postMessageToUnity("LoadSaidanDataMessageReceiver", json);

    setCurrentSaidanId(loadData.saidanId);
    setLoadData(null);
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
          isDebug: false,
        }),
      );
    },
    [postMessageToUnity],
  );

  const removeItems = useCallback(
    (itemIdList: number[]) => {
      postMessageToUnity(
        "RemoveItemsMessageReceiver",
        JSON.stringify({
          itemIdList,
        }),
      );
    },
    [postMessageToUnity],
  );

  useEffect(() => {
    if (!isLoaded) return;
    postMessageToLoadData();
  }, [isLoaded, postMessageToLoadData]);

  return {
    unityProvider,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    resolveUnityMessage,
    setLoadData,
    requestSaveData,
    placeNewItem,
    removeItems,
    handleSimpleMessage,
    handleSceneIsLoaded: postMessageToLoadData,
  };
};
