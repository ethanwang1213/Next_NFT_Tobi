import { ITEM_TYPE_DATA } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";
import { ThreeEvent } from "@react-three/fiber";
import { FullGestureState } from "@use-gesture/react";
import { RefObject, useState } from "react";
import { Raycaster, Group, Camera, Vector2, Vector3 } from "three";
import { shallow } from "zustand/shallow";
import useWindowSize from "./useWindowSize";

type Props = {
  raycaster: Raycaster;
  cameraRef: RefObject<Camera>;
  scalePointerTargetRef: RefObject<Group>;
};

const useDirectScale = ({
  raycaster,
  cameraRef,
  scalePointerTargetRef,
}: Props) => {
  const placedItems = useSaidanStore((state) => state.placedItems);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const moveState = useSaidanStore((state) => state.moveState);
  const setMoveState = useSaidanStore((state) => state.setMoveState);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const setItemScale = useSaidanStore((state) => state.setItemScale);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);
  const isDirectScalePaused = useSaidanStore(
    (state) => state.isDirectScalePaused
  );
  const setIsDirectScalePaused = useSaidanStore(
    (state) => state.setIsDirectScalePaused
  );

  // const [pointer, setPointer] = useState<Vector2>(new Vector2());
  const [startY, setStartY] = useState<number>(0);
  const [startScale, setStartScale] = useState<number>(0);
  // 壁の下端用、下移動は許容する
  const [pY, setPY] = useState<number>(0);

  const { innerWidth, innerHeight, displayWidth, displayHeight } =
    useWindowSize();

  const handleDirectScaleDown = (
    e: ThreeEvent<PointerEvent>,
    itemId: string
  ) => {
    if (!cameraRef.current) return;
    if (isCameraMode) return;
    if (e.button !== 0) return;
    if (selectedItemId !== itemId || moveState !== "NONE") return;
    e.stopPropagation();
    setMoveState("DIRECT_MOUSE_SCALE");
  };

  const handleDirectScaleMove = (
    state: Omit<FullGestureState<"drag">, "event"> & {
      event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
    }
  ) => {
    state.event.preventDefault();

    if (state.pinching) {
      state.cancel();
      return;
    }
    if (!cameraRef.current || !scalePointerTargetRef.current) return;
    if (isCameraMode || selectedItemId === "") return;
    if (
      moveState !== "DIRECT_MOUSE_SCALE" &&
      moveState !== "DIRECT_MOUSE_SCALING"
    )
      return;
    if (state.buttons !== 1) return;

    const selectedItem = placedItems.find((v) => v.id === selectedItemId);
    if (!selectedItem) return; // 選択状態のエラー

    // タブレットっぽいPC表示実装のために、state.xyの値を変形する
    const simulatedStateX = state.xy[0] - (innerWidth - displayWidth) / 2;
    const simulatedStateY = state.xy[1] - (innerHeight - displayHeight) / 2;

    const newPointer = new Vector2(
      (simulatedStateX / displayWidth) * 2 - 1,
      -(simulatedStateY / displayHeight) * 2 + 1
    );

    raycaster.setFromCamera(newPointer, cameraRef.current);
    const intersects = raycaster.intersectObjects(
      scalePointerTargetRef.current.children
    );
    if (intersects.length === 0) return; // 衝突なし
    if (intersects[0].object.name !== "SCALE_WALL") return;

    const v0 = intersects[0].face?.normal;
    if (!v0?.equals(new Vector3(0, 0, -1))) return; // 指定された法線ベクトルを持つ面のみに配置可能
    const pointY = intersects[0].point.y;

    if (state.first) {
      setStartScale(selectedItem.scale);
      setStartY(pointY);
      setIsDirectScalePaused(false);
      return;
    }

    const itemData = ITEM_TYPE_DATA[selectedItem.itemType];
    const staY = startY - selectedItem.position.y;
    const poiY = pointY - selectedItem.position.y;
    const rateY = (staY + (poiY - staY)) / staY;

    // 壁で下端でpositionがズレたときの処理
    // Directな操作ではズレたときに処理が必要
    if (isDirectScalePaused) {
      const beyondHead =
        (1.0 - ITEM_TYPE_DATA[selectedItem.itemType].originPosition) *
        itemSizeData[selectedItem.id].y *
        selectedItem.scale;
      if (pointY - pY >= 0 && pointY <= selectedItem.position.y + beyondHead) {
        // 壁下端での移動制限で、positionは上方向にズレるため、
        // ズレが発生してから、ズレが解消される十分な上方向ドラッグが行われるまでは、
        // スケールの更新を行わない
        return;
      } else {
        // スケールダウンか、ズレが解消されたとき
        // スケールを再開する
        setIsDirectScalePaused(false);
        setStartScale(selectedItem.scale);
        // setStartY(pointY)
        setStartY(selectedItem.position.y + beyondHead);
        return;
      }
    }

    let newScale = startScale * rateY;
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
      // 現状ポスターだけなので楽しているが、
      // 汎用的にするには、originPositionが0以上の場合に処理すべきであり、
      // itemHalfではなくoriginPositionに対応した高さを指定すべき
      if (selectedItem.itemType === "POSTER" && newPos.y < itemHalf) {
        newPos.y = itemHalf;
        // ズレが発生
        setIsDirectScalePaused(true);
      }
    }
    setItemPos(selectedItemId, newPos, selectedItem.place);
    setMoveState("DIRECT_MOUSE_SCALING");
    setPY(pointY);
  };

  return { handleDirectScaleDown, handleDirectScaleMove };
};

export default useDirectScale;
