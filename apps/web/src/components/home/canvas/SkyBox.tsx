import { useThree } from "@react-three/fiber";
import { Color } from "three";

type SkyBoxProps = {
    color: string;
};

const SkyBox = ({ color }: SkyBoxProps) => {
    const { scene } = useThree();
    // console.log(color)
    scene.background = new Color(color);
    return null;
};

export default SkyBox