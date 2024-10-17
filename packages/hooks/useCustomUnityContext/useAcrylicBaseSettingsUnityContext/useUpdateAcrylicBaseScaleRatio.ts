import { useCallback } from "react";
import { MessageDestination } from "../types";

export const useUpdateAcrylicBaseScaleRatio = ({
  defaultAcrylicBaseScaleRatio,
  postMessageToUnity,
}: {
  defaultAcrylicBaseScaleRatio: number;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const updateAcrylicBaseScaleRatio = useCallback(
    (acrylicBaseScaleRatio: number) => {
      const json = JSON.stringify({
        acrylicBaseScaleRatio,
      });
      postMessageToUnity("UpdateAcrylicBaseScaleRatioMessageReceiver", json);
    },
    [postMessageToUnity],
  );

  const resetAcrylicBaseScaleRatio = useCallback(() => {
    console.log("resetAcrylicBaseScaleRatio");
    const json = JSON.stringify({
      acrylicBaseScaleRatio: defaultAcrylicBaseScaleRatio,
    });
    postMessageToUnity("UpdateAcrylicBaseScaleRatioMessageReceiver", json);
  }, [defaultAcrylicBaseScaleRatio, postMessageToUnity]);

  return { updateAcrylicBaseScaleRatio, resetAcrylicBaseScaleRatio };
};
