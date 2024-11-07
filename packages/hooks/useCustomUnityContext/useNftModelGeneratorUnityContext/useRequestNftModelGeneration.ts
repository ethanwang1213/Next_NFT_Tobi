import { useCallback, useEffect, useState } from "react";
import {
  AcrylicBaseScaleRatio,
  DebugFlag,
  ItemBaseId,
  ItemType,
  ModelParams,
  TextureParam,
} from "types/unityTypes";
import { MessageDestination, UnityMessageJson } from "../types";

type SampleItemData = ItemBaseId &
  ModelParams &
  TextureParam &
  AcrylicBaseScaleRatio &
  DebugFlag;

export const useRequestNftModelGeneration = ({
  isLoaded,
  postMessageToUnity,
  onNftModelGenerated,
}: {
  isLoaded: boolean;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
  onNftModelGenerated?: (itemId: number, nftModelBase64: string) => void;
}) => {
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [sampleItemData, setSampleItemData] = useState<SampleItemData | null>();

  const postMessageToRequestNftModelGeneration = useCallback(() => {
    setIsSceneLoaded(true);

    if (!sampleItemData || !isSceneLoaded) {
      return;
    }

    const json = JSON.stringify({
      ...sampleItemData,
      itemType: ItemType.Sample,
    });
    postMessageToUnity("NftModelGenerationMessageReceiver", json);

    setSampleItemData(null);
  }, [sampleItemData, isSceneLoaded, postMessageToUnity]);

  const handleNftModelGenerated = useCallback(
    (msgObj: UnityMessageJson) => {
      const messageBody = JSON.parse(msgObj.messageBody) as ItemBaseId & {
        base64Data: string;
      };
      if (!messageBody) return;

      if (onNftModelGenerated) {
        onNftModelGenerated(messageBody.itemId, messageBody.base64Data);
      }
    },
    [onNftModelGenerated],
  );

  useEffect(() => {
    if (!isLoaded || !isSceneLoaded || !sampleItemData) return;
    postMessageToRequestNftModelGeneration();
  }, [
    sampleItemData,
    isLoaded,
    isSceneLoaded,
    postMessageToRequestNftModelGeneration,
  ]);

  return {
    isSceneLoaded,
    requestNftModelGeneration: setSampleItemData,
    handleSceneIsLoaded: postMessageToRequestNftModelGeneration,
    handleNftModelGenerated,
  };
};
