import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useWindowSize } from "../../../../hooks/useWindowSize";

/**
 * カメラのポジションを制御するコンポーネント
 * レスポンシブ表示のために利用
 */
const CameraController: React.FC = () => {
  const { isWide } = useWindowSize();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, isWide ? 0 : 1, isWide ? 17 : 13);
  }, [isWide]);

  return null;
};

export default CameraController;
