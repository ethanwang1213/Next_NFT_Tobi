import { useCallback } from "react";
import { AcrylicBaseScaleRatio, ItemBaseId } from "types/unityTypes";
import { MessageDestination } from "../types";

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
    [defaultItemData.itemId, postMessageToUnity],
  );

  const resetAcrylicBaseScaleRatio = useCallback(() => {
    const json = JSON.stringify({
      itemId: defaultItemData.itemId,
      acrylicBaseScaleRatio: defaultItemData.acrylicBaseScaleRatio,
    });
    postMessageToUnity("UpdateAcrylicBaseScaleRatioMessageReceiver", json);
  }, [defaultItemData, postMessageToUnity]);

  return { updateAcrylicBaseScaleRatio, resetAcrylicBaseScaleRatio };
};
