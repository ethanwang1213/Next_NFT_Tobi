import { ThreeEvent } from "@react-three/fiber";
import { FullGestureState } from "@use-gesture/react";
import { RefObject } from "react";
import { Raycaster, Vector2, Camera, Group } from "three";
import {
  FLOOR_OFFSET,
  ITEM_TYPE_DATA,
  POINTER_TARGETS,
} from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";
import useWindowSize from "./useWindowSize";

type PointerMoveProps = {
  raycaster: Raycaster;
  cameraRef: RefObject<Camera>;
  movePointerTargetRef: RefObject<Group>;
};

const useDirectMove = ({
  raycaster,
  cameraRef,
  movePointerTargetRef,
}: PointerMoveProps) => {
  const placedItems = useSaidanStore((state) => state.placedItems);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const putBackItem = useSaidanStore((state) => state.putBackItem);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const moveState = useSaidanStore((state) => state.moveState);
  const setMoveState = useSaidanStore((state) => state.setMoveState);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const isNearByBag = useSaidanStore((state) => state.isNearByBag);
  const setIsNearByBag = useSaidanStore((state) => state.setIsNearByBag);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  // const [pointer, setPointer] = useState<Vector2>(new Vector2());
  const { innerWidth, innerHeight, displayWidth, displayHeight, isWide } =
    useWindowSize();

  const handleDirectDown = (e: ThreeEvent<PointerEvent>, itemId: string) => {
    if (!cameraRef.current || !movePointerTargetRef.current) return;
    if (isCameraMode) return;
    if (e.button !== 0) return;
    if (selectedItemId !== itemId || moveState !== "NONE") return;

    setMoveState("DIRECT");
  };
  const handleDirectMove = (
    state: Omit<FullGestureState<"drag">, "event"> & {
      event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
    }
  ) => {
    state.event.preventDefault();

    if (state.pinching) {
      state.cancel();
      return;
    }
    if (!cameraRef.current || !movePointerTargetRef.current) return;
    if (isCameraMode || selectedItemId === "") return;
    if (moveState !== "DIRECT" && moveState !== "DIRECT_MOVING") return;
    if (state.last) {
      if (isNearByBag) {
        putBackItem(selectedItemId);
      }
      return;
    }

    if (state.buttons !== 1) return;

    // タブレットっぽいPC表示実装のために、state.xyの値を変形する
    const simulatedStateX = state.xy[0] - (innerWidth - displayWidth) / 2;
    const simulatedStateY = state.xy[1] - (innerHeight - displayHeight) / 2;

    const newPointer = new Vector2(
      (simulatedStateX / displayWidth) * 2 - 1,
      -(simulatedStateY / displayHeight) * 2 + 1
    );
    // setPointer(newPointer);
    if (state.first) return;

    raycaster.setFromCamera(newPointer, cameraRef.current);
    const intersects = raycaster.intersectObjects(
      movePointerTargetRef.current.children
    );
    if (intersects.length === 0) return; // 衝突なし

    const MovePointerTarget = POINTER_TARGETS.find(
      (v) => v.name === intersects[0].object.name
    );
    if (!MovePointerTarget) return; // 不適切なターゲットとの衝突エラー

    const selectedItem = placedItems.find((v) => v.id === selectedItemId);
    if (!selectedItem) return; // 選択状態のエラー

    const v0 = intersects[0].face?.normal;
    const v1 = MovePointerTarget.validNormal;
    if (!v0?.equals(v1)) return; // 指定された法線ベクトルを持つ面のみに配置可能

    const v = intersects[0].point;
    // const itemYHalf = selectedItem.size.y * selectedItem.scale / 2.0
    const itemOriginY =
      itemSizeData[selectedItemId].y *
      selectedItem.scale *
      ITEM_TYPE_DATA[selectedItem.itemType].originPosition;

    if (MovePointerTarget.name === "FLOOR") {
      v.z +=
        (itemOriginY - FLOOR_OFFSET) *
        Math.abs(Math.sin(selectedItem.rotation)); // 移動重心から中心へのオフセット対応
    } else if (MovePointerTarget.name === "WALL") {
      v.y +=
        itemOriginY * Math.abs(Math.cos(selectedItem.rotation)) - FLOOR_OFFSET; // (中心-移動重心)
    }

    let place = MovePointerTarget.name;
    const limitPlace = ITEM_TYPE_DATA[selectedItem.itemType].placeLimit;
    if (MovePointerTarget.name === limitPlace) {
      // アイテムの配置制限
      if (limitPlace === "WALL") {
        v.y = itemOriginY * Math.abs(Math.cos(selectedItem.rotation));
        place = selectedItem.place;
      }
    }
    setItemPos(selectedItemId, v, place);
    const putBackBorder = isWide ? 170 : 130;
    // setIsNearByBag(state.xy[1] > innerHeight - putBackBorder);
    const displayBottom = displayHeight + (innerHeight - displayHeight) / 2;
    setIsNearByBag(state.xy[1] > displayBottom - putBackBorder);
    setMoveState("DIRECT_MOVING");
  };

  return { handleDirectDown, handleDirectMove };
};

export default useDirectMove;
