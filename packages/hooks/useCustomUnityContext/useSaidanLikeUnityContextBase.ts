import { useCallback, useState } from "react";
import { SaidanLikeData } from "types/adminTypes";
import { UnitySceneType } from "./unityType";
import { useCustomUnityContextBase } from "./useCustomUnityContextBase";

export const useSaidanLikeUnityContextBase = ({
  sceneType,
}: {
  sceneType: UnitySceneType;
}) => {
  const [currentSaidanId, setCurrentSaidanId] = useState<number>(-1);

  const privatePostMessageToLoadData = useCallback(
    (loadData: SaidanLikeData) => {
      console.log("pri");
      if (loadData == null || loadData.saidanId === currentSaidanId) {
        console.log("loadData is null or same saidanId" + currentSaidanId);
        return;
      }

      // TODO(toruto): post message to Unity side
      const json = JSON.stringify(loadData);
      console.log(json);
      setCurrentSaidanId(loadData.saidanId);
    },
    [currentSaidanId],
  );

  const { unityProvider, isLoaded, postMessageToUnity } =
    useCustomUnityContextBase({
      sceneType,
      postMessageToLoadData: privatePostMessageToLoadData,
    });

  // TODO(toruto): const placeNewItem = () => {};
  // TODO(toruto): const removeItems = () => {};
  // TODO(toruto): const requestSaveData = () => {};
  // TODO(toruto): const processLoadData = () => {};

  const postMessageToLoadData = (loadData: SaidanLikeData) => {
    if (!isLoaded) return;
    privatePostMessageToLoadData(loadData);
  };

  return {
    unityProvider,
    postMessageToUnity,
    postMessageToLoadData,
  };
};
