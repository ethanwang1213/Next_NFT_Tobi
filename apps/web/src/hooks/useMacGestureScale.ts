import { ITEM_TYPE_DATA } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";
import { useEffect, useState } from "react";

type GestureType = Event & {
  scale: number;
};

const useMacGestureScale = () => {
  const placedItems = useSaidanStore((state) => state.placedItems);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const moveState = useSaidanStore((state) => state.moveState);
  const setMoveState = useSaidanStore((state) => state.setMoveState);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const setItemScale = useSaidanStore((state) => state.setItemScale);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  const [startScale, setStartScale] = useState<number>(0);

  useEffect(() => {
    const initMacGestureScale = () => {
      if (isCameraMode || selectedItemId === "") return;
      const selectedItem = placedItems.find((v) => v.id === selectedItemId);
      if (!selectedItem) return;
      setStartScale(selectedItem.scale);
      setMoveState("MAC_GESTURE_SCALE");
    };

    // macのデフォルトジェスチャーのキャンセル
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    const handleGestureChange = (e: Event) => {
      e.preventDefault();
      const gestureEvent = e as GestureType;
      if (moveState === "NONE") {
        initMacGestureScale();
        return;
      }

      if (
        moveState !== "MAC_GESTURE_SCALE" &&
        moveState !== "MAC_GESTURE_SCALING"
      )
        return;

      const selectedItem = placedItems.find((v) => v.id === selectedItemId);
      if (!selectedItem) return;

      let newScale = startScale * (1 + (gestureEvent.scale - 1) / 2.0);
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
      setMoveState("MAC_GESTURE_SCALING");
    };

    const handleGestureEnd = (e: Event) => {
      e.preventDefault();
      if (
        moveState === "MAC_GESTURE_SCALE" ||
        moveState === "MAC_GESTURE_SCALING"
      ) {
        setMoveState("NONE");

        const selectedItem = placedItems.find((v) => v.id === selectedItemId);
        if (!selectedItem) return;
        setStartScale(selectedItem.scale);
      }
    };

    // イベントの登録・解除
    document.addEventListener("gesturestart", handleGestureStart);
    document.addEventListener("gesturechange", handleGestureChange);
    document.addEventListener("gestureend", handleGestureEnd);
    return () => {
      document.removeEventListener("gesturestart", handleGestureStart);
      document.removeEventListener("gesturechange", handleGestureChange);
      document.removeEventListener("gestureend", handleGestureEnd);
    };
  }, [
    placedItems,
    itemSizeData,
    moveState,
    setMoveState,
    setItemPos,
    setItemScale,
    selectedItemId,
    isCameraMode,
    startScale,
  ]);
};

export default useMacGestureScale;
