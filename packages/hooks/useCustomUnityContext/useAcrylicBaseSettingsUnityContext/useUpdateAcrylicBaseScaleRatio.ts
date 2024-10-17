import { useCallback } from "react";
import { ItemBaseId } from "types/unityTypes";
import { AcrylicBaseScaleRatio, MessageDestination } from "../types";

export const useUpdateAcrylicBaseScaleRatio = ({
  defaultItemData,
  postMessageToUnity,
}: {
  defaultItemData: ItemBaseId & AcrylicBaseScaleRatio;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const updateAcrylicBaseScaleRatio = useCallback(
    (acrylicBaseScaleRatio: number) => {
      const json = JSON.stringify({
        itemId: defaultItemData.itemId,
        acrylicBaseScaleRatio,
      });
      postMessageToUnity("UpdateAcrylicBaseScaleRatioMessageReceiver", json);
    },
    [postMessageToUnity],
  );

  const resetAcrylicBaseScaleRatio = useCallback(() => {
    console.log("resetAcrylicBaseScaleRatio");
    const json = JSON.stringify({
      itemId: defaultItemData.itemId,
      acrylicBaseScaleRatio: defaultItemData.acrylicBaseScaleRatio,
    });
    postMessageToUnity("UpdateAcrylicBaseScaleRatioMessageReceiver", json);
  }, [defaultItemData, postMessageToUnity]);

  return { updateAcrylicBaseScaleRatio, resetAcrylicBaseScaleRatio };
};
