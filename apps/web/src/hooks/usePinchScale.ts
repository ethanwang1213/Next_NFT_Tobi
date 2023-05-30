import { FullGestureState, WebKitGestureEvent } from "@use-gesture/react";
import { useState } from "react";
import { ITEM_TYPE_DATA } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";

const usePinchScale = () => {
  const placedItems = useSaidanStore((state) => state.placedItems);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const moveState = useSaidanStore((state) => state.moveState);
  const setMoveState = useSaidanStore((state) => state.setMoveState);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const setItemScale = useSaidanStore((state) => state.setItemScale);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  const [startDist, setStartDist] = useState(0);
  const [startScale, setStartScale] = useState<number>(0);

  const handleScalePinch = (
    state: Omit<FullGestureState<"pinch">, "event"> & {
      event: PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent;
    }
  ) => {
    state.event.preventDefault();
    if (state.last) {
      setMoveState("NONE");
      return;
    }
    if (isCameraMode || selectedItemId === "") return;
    const selectedItem = placedItems.find((v) => v.id === selectedItemId);
    if (!selectedItem) return;
    if (state.first) {
      setStartDist(state.da[0]);
      setStartScale(selectedItem.scale);
      setMoveState("PINCH_SCALE");
      return;
    }
    if (moveState !== "PINCH_SCALE" && moveState !== "PINCH_SCALING") return;

    const offset = state.da[0] - startDist;
    let newScale = startScale + offset / 300.0;
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
    setMoveState("PINCH_SCALING");
  };

  return { handleScalePinch };
};

export default usePinchScale;
