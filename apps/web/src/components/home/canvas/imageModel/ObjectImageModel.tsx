import { useTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import {
  Mesh,
} from "three";

type Props = {
  // position: Vector3;
  x: number;
  y: number;
  z: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  width: number;
  height: number;
  src: string;
  opacity: number;
  color?: string;
};

/**
 * 影を落とすオブジェクト用のコンポーネント
 * @param param0
 * @returns
 */
const ObjectImageModel = ({
  src,
  width,
  height,
  x,
  y,
  z,
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  opacity,
  color = "white",
}: Props) => {
  const texture = useTexture({ map: src });
  const ref = useRef<Mesh>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (!texture) return;
  }, [texture, ref]);

  const [isStandard, setIsStandard] = useState(true);

  return (
    <mesh
      ref={ref}
      position={[x, y, z]}
      rotation={[rotX, rotY, rotZ]}
      // castShadow={true}
      receiveShadow
      onClick={() => {
        setIsStandard(!isStandard);
      }}
    >
      <planeGeometry args={[width, height]} />
      {/* <boxGeometry args={[width, height, 0.1]} /> */}
      <meshStandardMaterial
        {...texture}
        transparent
        alphaTest={0}
        color={color}
        opacity={opacity}
      />
    </mesh>
  );
};

export default ObjectImageModel;
