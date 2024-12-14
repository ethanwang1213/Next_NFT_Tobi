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
  const [isSceneOpen, setIsSceneOpen] = useState(false);
  const [sampleItemData, setSampleItemData] = useState<SampleItemData | null>();
  const [isEventListenersAdded, setIsEventListenersAdded] =
    useState<boolean>(false);

  const postMessageToRequestNftModelGeneration = useCallback(() => {
    if (!sampleItemData || !isSceneOpen || !isEventListenersAdded) {
      return;
    }

    const json = JSON.stringify({
      ...sampleItemData,
      itemType: ItemType.Sample,
    });
    postMessageToUnity("NftModelGenerationMessageReceiver", json);

    setSampleItemData(null);
  }, [
    sampleItemData,
    isSceneOpen,
    isEventListenersAdded,
    postMessageToUnity,
    setSampleItemData,
  ]);

  const handleSceneIsLoaded = useCallback(() => {
    setIsSceneOpen(true);
    postMessageToRequestNftModelGeneration();
  }, [setIsSceneOpen, postMessageToRequestNftModelGeneration]);

  const handleCheckConnection = useCallback(() => {
    setIsEventListenersAdded(true);
    postMessageToUnity("ConnectionCheckedMessageReceiver", "");
  }, [setIsEventListenersAdded, postMessageToUnity]);

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
    isEventListenersAdded,
    postMessageToRequestNftModelGeneration,
  ]);

  return {
    isSceneOpen,
    requestNftModelGeneration: setSampleItemData,
    handleSceneIsLoaded,
    handleNftModelGenerated,
    handleCheckConnection,
  };
};
