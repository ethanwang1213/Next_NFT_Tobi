import { useCallback } from "react";
import { ItemTransformUpdatePhase, PositionOnPlane } from "types/unityTypes";
import { MessageDestination, SelectedItem, UnityMessageJson } from "../types";

export const useUpdateItemTransform = ({
  selectedItem,
  setSelectedItem,
  postMessageToUnity,
}: {
  selectedItem: SelectedItem | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<SelectedItem | null>>;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const updateItemTransform = useCallback(
    ({
      positionOnPlane,
      rotationAngle,
      scale,
      phase,
    }: {
      positionOnPlane: PositionOnPlane;
      rotationAngle: number;
      scale: number;
      phase: ItemTransformUpdatePhase;
    }) => {
      const data = {
        itemType: selectedItem?.itemType,
        itemId: selectedItem?.itemId,
        id: selectedItem?.id,
        positionOnPlane,
        rotationAngle,
        scale,
        phase,
      };

      postMessageToUnity(
        "UpdateItemTransformMessageReceiver",
        JSON.stringify(data),
      );
    },
    [postMessageToUnity, selectedItem],
  );

  const handleItemTransformUpdated = useCallback(
    (msgObj: UnityMessageJson) => {
      const messageBody = JSON.parse(msgObj.messageBody) as Omit<
        SelectedItem,
        "digitalItemId"
      >;
      if (!messageBody) return;

      setSelectedItem(
        (prev) =>
          prev && {
            ...prev,
            positionOnPlane: messageBody.positionOnPlane,
            rotationAngle: messageBody.rotationAngle,
            scale: messageBody.scale,
          },
      );
    },
    [setSelectedItem],
  );

  return {
    updateItemTransform,
    handleItemTransformUpdated,
  };
};
