import { useCallback } from "react";
import { ItemType } from "types/unityTypes";
import { MessageDestination } from "../types";

export const useHighlightSamples = ({
  postMessageToUnity,
}: {
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const highlightSamplesByItemId = useCallback(
    (itemId: number) => {
      postMessageToUnity(
        "HighlightItemsMessageReceiver",
        JSON.stringify({
          itemRef: {
            itemType: ItemType.Sample,
            itemId,
          },
        }),
      );
    },
    [postMessageToUnity],
  );

  return { highlightSamplesByItemId };
};
