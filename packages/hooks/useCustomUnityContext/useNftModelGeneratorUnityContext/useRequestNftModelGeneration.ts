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
  const [isSceneOpen, setIsSceneLoaded] = useState(false);
  const [sampleItemData, setSampleItemData] = useState<SampleItemData | null>();

  const postMessageToRequestNftModelGeneration = useCallback(() => {
    setIsSceneLoaded(true);

    if (!sampleItemData || !isSceneOpen) {
      return;
    }

    const json = JSON.stringify({
      ...sampleItemData,
      itemType: ItemType.Sample,
    });
    postMessageToUnity("NftModelGenerationMessageReceiver", json);

    setSampleItemData(null);
  }, [sampleItemData, isSceneOpen, postMessageToUnity]);

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
    if (!isLoaded || !isSceneOpen || !sampleItemData) return;
    postMessageToRequestNftModelGeneration();
  }, [
    sampleItemData,
    isLoaded,
    isSceneOpen,
    postMessageToRequestNftModelGeneration,
  ]);

  return {
    isSceneOpen,
    requestNftModelGeneration: setSampleItemData,
    handleSceneIsLoaded: postMessageToRequestNftModelGeneration,
    handleNftModelGenerated,
  };
};
