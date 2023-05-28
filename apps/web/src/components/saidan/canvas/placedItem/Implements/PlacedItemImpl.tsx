import { ThreeEvent } from "@react-three/fiber";
import { ReactNode, useContext } from "react";
import { shallow } from "zustand/shallow";
import useSaidanStore from "@/stores/saidanStore";
import { PlacedItemData } from "@/types/PlacedItemData";
import { DirectControlContext } from "@/context/directControl";
import DirectMovePoint from "./DirectMovePoint";
import DirectScalePoint from "./DirectScalePoint";
import ScalePointerTarget from "../pointerTarget/ScalePointerTarget";

type Props = {
  /* eslint-disable no-unused-vars */
  itemData: PlacedItemData;
  scaleZ: number;
  children: ReactNode;
  /* eslint-enable no-unused-vars */
};

const PlacedItemImpl = ({ itemData, scaleZ, children }: Props) => {
  const moveState = useSaidanStore((state) => state.moveState);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const selectItem = useSaidanStore((state) => state.selectItem);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);
  const setCameraMode = useSaidanStore((state) => state.setCameraMode);
  const isCameraMoved = useSaidanStore((state) => state.isCameraMoved);

  const { handleDirectMoveDown } = useContext(DirectControlContext);

  const handleOnClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (moveState === "RELATIVE_MOVING") return;
    if (moveState === "DIRECT_MOVING") return;
    if (moveState === "DIRECT_MOUSE_SCALING") return;

    if (isCameraMode) {
      if (isCameraMoved) return;
      setCameraMode(false);
    }
    selectItem(itemData.id);
  };

  return (
    /* eslint-disable react/no-unknown-property */
    <group>
      <group
        onClick={handleOnClick}
        onPointerDown={(e) => handleDirectMoveDown(e, itemData.id)}
        position={itemData.position}
        scale={[
          itemData.scale,
          itemData.scale,
          itemData.itemType === "TIN_BADGE" && itemData.place === "WALL"
            ? 0.05
            : scaleZ,
        ]}
        rotation={[itemData.rotation, 0, 0]}
      >
        {children}
      </group>
      {/* direct move target point */}
      {selectedItemId === itemData.id && !isCameraMode && (
        <>
          <DirectMovePoint itemData={itemData} />
          <DirectScalePoint itemData={itemData} />
          {/* {(moveState === 'DIRECT_MOUSE_SCALE' || moveState === "DIRECT_MOUSE_SCALING") && ( */}
          <ScalePointerTarget itemData={itemData} />
          {/* )} */}
        </>
      )}
    </group>
    /* eslint-enable react/no-unknown-property */
  );
};

export default PlacedItemImpl;
