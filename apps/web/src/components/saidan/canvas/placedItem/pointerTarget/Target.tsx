import { MovePointerTargetName, ScalePointerTargetName } from "@/types/PointerTargetName";

type TargetProps = {
  name: MovePointerTargetName | ScalePointerTargetName;
  position: [x: number, y: number, z: number];
  size: [x: number, y: number, z: number];
  color: THREE.Color;
};

const Target = ({ name, position, size, color }: TargetProps) => (
  /* eslint-disable react/no-unknown-property */
  <mesh name={name} position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} visible={false} />
  </mesh>
  /* eslint-enable react/no-unknown-property */
);

export default Target