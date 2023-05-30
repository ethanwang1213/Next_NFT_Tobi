import { useGLTF } from "@react-three/drei";
import { SAIDAN_SRC } from "@/constants/saidanConstants";

const Shelf = () => {
  const { scene: model } = useGLTF(SAIDAN_SRC);

  return (
    /* eslint-disable react/no-unknown-property */
    <group rotation={[0, Math.PI, 0]} scale={18.2} position={[0, -15.4, 3.5]}>
      <primitive object={model} />
    </group>
    /* eslint-enable react/no-unknown-property */
  );
};

export default Shelf;
