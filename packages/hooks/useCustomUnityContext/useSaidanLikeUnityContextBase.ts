import { useCallback, useEffect, useState } from "react";
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
  }, [postMessageToUnity, loadData, currentSaidanId]);

  // TODO(toruto): const placeNewItem = () => {};
  // TODO(toruto): const removeItems = () => {};
  // TODO(toruto): const requestSaveData = () => {};
  // TODO(toruto): const processLoadData = () => {};

  useEffect(() => {
    if (!isLoaded) return;
    postMessageToLoadData();
  }, [postMessageToLoadData]);

  return {
    unityProvider,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    resolveUnityMessage,
    setLoadData,
    handleSimpleMessage,
    handleSceneIsLoaded: postMessageToLoadData,
  };
};
