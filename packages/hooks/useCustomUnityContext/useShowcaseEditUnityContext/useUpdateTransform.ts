import { useCallback } from "react";
import { ItemTransformUpdatePhase as TransformUpdatePhase } from "types/unityTypes";
import { MessageDestination, SelectedItem, UnityMessageJson } from "../types";

/// NOTE(Toruto): position and rotation will be added when expert mode is implemented.
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
    (scale: number, phase: TransformUpdatePhase) => {
      const data = {
        itemType: selectedItem?.itemType,
        itemId: selectedItem?.itemId,
        id: selectedItem?.id,
        // position,
        // rotation,
        scale,
        phase,
      };
      console.log(JSON.stringify(data));

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

      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              position: messageBody.position,
              rotation: messageBody.rotation,
              scale: messageBody.scale,
            }
          : null,
      );
    },
    [setSelectedItem],
  );

  return {
    updateItemTransform,
    handleItemTransformUpdated,
  };
};
