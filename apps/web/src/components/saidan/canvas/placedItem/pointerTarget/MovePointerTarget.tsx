import { Ref } from "react";
import { Group } from "three";
import * as THREE from "three";
import { FLOOR_OFFSET } from "@/constants/saidanConstants";
import Target from "./Target";

type MovePointerTargetProps = {
  movePointerTargetRef: Ref<Group>;
};


const MovePointerTarget = ({ movePointerTargetRef }: MovePointerTargetProps) => (
  /* eslint-disable react/no-unknown-property */
  <group ref={movePointerTargetRef}>
    <Target
      name="FLOOR"
      position={[0, FLOOR_OFFSET, -2.5]}
      size={[20.1, 0.1, 5.1]}
      color={new THREE.Color("#cc0")}
    />
    <Target
      name="WALL"
      position={[0, 2.5, 0]}
      size={[20.1, 10.1, 0.1]}
      color={new THREE.Color("#0cc")}
    />
    <Target
      name="TOWARDS_BAG"
      position={[0, FLOOR_OFFSET, -15.1]}
      size={[30.1, 0.1, 20]}
      color={new THREE.Color("#c0c")}
    />
  </group>
  /* eslint-enable react/no-unknown-property */
);

export default MovePointerTarget;
