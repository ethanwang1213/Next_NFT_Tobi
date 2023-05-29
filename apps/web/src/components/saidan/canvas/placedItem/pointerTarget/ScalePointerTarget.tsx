import { DirectControlContext } from "@/context/directControl";
import { PlacedItemData } from "@/types/PlacedItemData";
import { Html } from "@react-three/drei";
import { useContext } from "react";
import { Color } from "three";
import Target from "./Target";

type Props = {
  itemData: PlacedItemData;
};

const ScalePointerTarget: React.FC<Props> = ({ itemData }: Props) => {
  const { scalePointerTargetRef } = useContext(DirectControlContext);
  return (

    /* eslint-disable react/no-unknown-property */
    <group ref={scalePointerTargetRef}>
      <Target
        name="SCALE_WALL"
        position={[
          itemData.position.x,
          itemData.position.y,
          itemData.position.z,
        ]}
        size={[20.1, 20.1, 0.1]}
        color={new Color("#cc0")}
      />
    </group>
    /* eslint-enable react/no-unknown-property */
  );
};

export default ScalePointerTarget;