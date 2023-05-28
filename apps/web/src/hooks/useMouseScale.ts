import { FullGestureState } from "@use-gesture/react";
import { useState } from "react";
import { ITEM_TYPE_DATA } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";

const useMouseScale = () => {
  const placedItems = useSaidanStore((state) => state.placedItems);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const moveState = useSaidanStore((state) => state.moveState);
  const setMoveState = useSaidanStore((state) => state.setMoveState);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const setItemScale = useSaidanStore((state) => state.setItemScale);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  const [startPos, setStartPos] = useState<[x: number, y: number]>([0, 0]);
  const [startScale, setStartScale] = useState<number>(0);

  const handleScaleMove = (
    state: Omit<FullGestureState<"drag">, "event"> & {
      event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
    }
  ) => {
    // state.event.preventDefault();
    if (state.last) {
      setMoveState("NONE");
      return;
    }
    if (isCameraMode || selectedItemId === "") return;
    if (state.buttons !== 2) return;
    if (moveState === "DIRECT" || moveState === "DIRECT_MOUSE_SCALE") return;
    const selectedItem = placedItems.find((v) => v.id === selectedItemId);
    if (!selectedItem) return;
    if (state.first) {
      setMoveState("MOUSE_SCALE");
      setStartPos([state.xy[0], state.xy[1]]);
      setStartScale(selectedItem.scale);
      return;
    }
    if (moveState !== "MOUSE_SCALE" && moveState !== "MOUSE_SCALING") return;

    const offsetX = state.xy[0] - startPos[0];
    const offsetY = -(state.xy[1] - startPos[1]);
    const scaleValue = (1 / Math.sqrt(2)) * (offsetX + offsetY);
    let newScale = startScale + scaleValue / 300.0;
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
    }
    setItemPos(selectedItemId, newPos, selectedItem.place);
    setMoveState("MOUSE_SCALING");
  };

  return { handleScaleMove };
};

export default useMouseScale;
