import { FullGestureState } from "@use-gesture/react";
import { Vector3 } from "three";
import { shallow } from "zustand/shallow";
import {
  MOVE_RATE_X,
  MOVE_RATE_YZ,
  ITEM_TYPE_DATA,
} from "@/constants/saidanConstants";
import { getFloorDepthLimit } from "@/methods/saidan/getLimits";
import useSaidanStore from "@/stores/saidanStore";

const useRelativeMove = () => {
  const placedItems = useSaidanStore((state) => state.placedItems);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const moveState = useSaidanStore((state) => state.moveState);
  const setMoveState = useSaidanStore((state) => state.setMoveState);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);
  const wallOrder = useSaidanStore((state) => state.wallOrder);

  const handleRelativeMove = (
    state: Omit<FullGestureState<"drag">, "event"> & {
      event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
    }
  ) => {
    state.event.preventDefault();
    if (state.last) {
      setMoveState("NONE");
      return;
    }
    if (isCameraMode || selectedItemId === "") return;
    if (moveState === "DIRECT" || moveState === "DIRECT_MOUSE_SCALE") return;
    if (state.first) {
      setMoveState("RELATIVE");
      return;
    }
    if (moveState !== "RELATIVE" && moveState !== "RELATIVE_MOVING") return;

    const selectedItem = placedItems.find((v) => v.id === selectedItemId);
    if (!selectedItem) return;

    let { x, y, z } = selectedItem.position;
    // deltaはxy軸方向が反対
    const deltaX = -state.delta[0];
    const deltaY = -state.delta[1];

    const size = itemSizeData[selectedItemId];
    const itemHeight = size.y * selectedItem.scale;
    const itemOriginY =
      size.y *
      selectedItem.scale *
      ITEM_TYPE_DATA[selectedItem.itemType].originPosition;

    const { placeLimit } = ITEM_TYPE_DATA[selectedItem.itemType];
    let { place } = selectedItem;

    x += deltaX / MOVE_RATE_X;
    if (selectedItem.place === "WALL") {
      y += deltaY / MOVE_RATE_YZ;
      // placeの設定
      if (y < itemOriginY && placeLimit !== "FLOOR") {
        place = "FLOOR";
      } else if (y >= itemOriginY && placeLimit !== "WALL") {
        place = "WALL";
      }
    } else if (selectedItem.place === "FLOOR") {
      z += deltaY / MOVE_RATE_YZ;
      // placeの設定
      const depthLimit = getFloorDepthLimit(
        itemHeight,
        itemOriginY,
        selectedItem.rotation,
        wallOrder.length
      );
      if (z > depthLimit && placeLimit !== "WALL") {
        place = "WALL";
      } else if (z <= depthLimit && placeLimit !== "FLOOR") {
        place = "FLOOR";
      }
    }
    setItemPos(selectedItemId, new Vector3(x, y, z), place);
    setMoveState("RELATIVE_MOVING");
  };

  return { handleRelativeMove };
};

export default useRelativeMove;
