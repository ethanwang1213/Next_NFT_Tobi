import { useThree } from "@react-three/fiber";
import { useWindowSize } from "hooks";
import { useEffect } from "react";

/**
 * カメラのポジションを制御するコンポーネント
 * レスポンシブ表示のために利用
 */
export const CameraController: React.FC = () => {
  const { isWide } = useWindowSize();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, isWide ? 0 : 1, isWide ? 17 : 13);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWide]);

  return null;
};
