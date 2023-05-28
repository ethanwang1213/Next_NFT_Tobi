import { useTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import {
  FrontSide,
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
  useBasicMaterial?: boolean;
  useLambertMaterial?: boolean;
};

/**
 * 画像素材をwebGL上で取り扱うためのコンポーネント
 * @param param0
 * @returns
 */
const ImageModel = ({
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
  useBasicMaterial = false,
  useLambertMaterial = false,
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
      {/* <boxGeometry args={[width, height]} /> */}
      <planeGeometry args={[width, height]} />
      {useBasicMaterial ? (
        <meshBasicMaterial
          // {...texture}
          transparent
          alphaTest={1}
          color={color}
          opacity={opacity}
          side={FrontSide}
        />
      ) : (
        <>
          {useLambertMaterial ?
            <meshLambertMaterial
              {...texture}
              transparent
              alphaTest={0}
              color={color}
              opacity={opacity}
              side={FrontSide}
            />
            :
            <meshStandardMaterial
              {...texture}
              transparent
              alphaTest={0}
              color={color}
              opacity={opacity}
              side={FrontSide}
            />
          }
        </>
      )}
    </mesh>
  );
};

export default ImageModel;
