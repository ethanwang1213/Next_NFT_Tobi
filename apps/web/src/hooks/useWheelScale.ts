import { FullGestureState } from "@use-gesture/react";
import { useState } from "react";
import { ITEM_TYPE_DATA } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";

const useWheelScale = () => {
  const placedItems = useSaidanStore((state) => state.placedItems);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const moveState = useSaidanStore((state) => state.moveState);
  const setMoveState = useSaidanStore((state) => state.setMoveState);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const setItemScale = useSaidanStore((state) => state.setItemScale);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  const [startScale, setStartScale] = useState<number>(0);

  const handleScaleWheel = (
    state: Omit<FullGestureState<"wheel">, "event"> & {
      event: WheelEvent;
    }
  ) => {
    if (state.last) {
      setMoveState("NONE");
      return;
    }
    if (isCameraMode || selectedItemId === "") return;
    const selectedItem = placedItems.find((v) => v.id === selectedItemId);
    if (!selectedItem) return;
    if (state.first) {
      setMoveState("WHEEL_SCALE");
      setStartScale(selectedItem.scale);
      return;
    }
    if (moveState !== "WHEEL_SCALE" && moveState !== "WHEEL_SCALING") return;

    const offset = -state.delta[1];
    let newScale = startScale + offset / 1000.0;
    const itemData = ITEM_TYPE_DATA[selectedItem.itemType];
    if (newScale >= itemData.maxScale) {
      newScale = itemData.maxScale;
    }
    if (newScale <= itemData.minScale) {
      newScale = itemData.minScale;
    }
    setItemScale(selectedItemId, newScale);

    const newPos = selectedItem.position;
    const itemHalf = (itemSizeData[selectedItemId].y * newScale) / 2.0;
    if (selectedItem.place === "FLOOR") {
      newPos.y = itemHalf;
    } else if (selectedItem.place === "WALL") {
      if (newPos.y < itemHalf) {
        newPos.y = itemHalf;
      }
    }
    setItemPos(selectedItemId, newPos, selectedItem.place);
    setMoveState("WHEEL_SCALING");
  };
  return { handleScaleWheel };
};

export default useWheelScale;
