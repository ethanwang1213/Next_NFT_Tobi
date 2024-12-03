import { useCallback } from "react";
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
  postMessageToUnity,
  onNftModelGenerated,
}: {
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
  onNftModelGenerated?: (itemId: number, nftModelBase64: string) => void;
}) => {
  const postMessageToRequestNftModelGeneration = useCallback(
    (sampleItemData: SampleItemData) => {
      const json = JSON.stringify({
        ...sampleItemData,
        itemType: ItemType.Sample,
      });
      postMessageToUnity("NftModelGenerationMessageReceiver", json);
    },
    [postMessageToUnity],
  );

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

  return {
    requestNftModelGeneration: postMessageToRequestNftModelGeneration,
    handleNftModelGenerated,
  };
};
