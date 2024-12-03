import { useCallback } from "react";
import { MessageDestination } from "../types";

export const useApplyAcrylicBaseScaleRatio = ({
  postMessageToUnity,
}: {
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const applyAcrylicBaseScaleRatio = useCallback(
    (itemId: number, newRatio: number) => {
      const json = JSON.stringify({
        itemId,
        acrylicBaseScaleRatio: newRatio,
      });
      postMessageToUnity("UpdateAcrylicBaseScaleRatioMessageReceiver", json);
    },
    [postMessageToUnity],
  );

  return { applyAcrylicBaseScaleRatio };
};
