import { a, config, useSpring } from "@react-spring/web";
import { shallow } from "zustand/shallow";
import CameraReversal from "@/../public/saidan/saidan-ui/camera_reversal.svg";
import MoveGoods from "@/../public/saidan/saidan-ui/movegoods.svg";
import { GRAY_COLOR } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";
import { useEffect, useState } from "react";

const CameraModeButton = () => {

  const isCameraMode = useSaidanStore((state) => state.isCameraMode);
  const setCameraMode = useSaidanStore((state) => state.setCameraMode);
  const closeOther = useSaidanStore((state) => state.closeOther);

  const { x } = useSpring({
    from: { x: isCameraMode ? 0 : 1 },
    to: { x: isCameraMode ? 1 : 0 },
    config: config.default,
  });
  const scale = x.to([0, 0.5, 1], [1, 0, 1]);
  // const bgColor = x.to([0, 1], [GRAY_COLOR, "#414142"]);
  const textColor = x.to([0, 1], ["#414142", GRAY_COLOR]);

  const handleClick = () => {
    // if (!isCameraMode) {
    //   selectItem("");
    // }
    setCameraMode(!isCameraMode);
    closeOther();
  };

  const [bgColor, setBgColor] = useState("#343434");
  const [isHover, setIsHover] = useState(false);
  useEffect(() => {
    if (!isCameraMode) {
      if (isHover) {
        // ホバーカラー
        setBgColor("#343434");
      } else {
        // 通常時
        setBgColor("#414142");
      }
    } else if (isHover) {
      // ホバーカラー
      setBgColor("#eee");
    } else {
      // 通常時
      setBgColor("white");
    }
  }, [isHover, isCameraMode]);

  return (
    <div className="ui-btn-bottom ui-btn-cameramode-container">
      <a.button
        type="button"
        className="ui-btn-cameramode"
        // className='w-16'
        style={{
          backgroundColor: bgColor,
          transform: scale.to((v) => `scaleX(${v})`),
        }}
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
        onClick={handleClick}
      >
        {isCameraMode ? <CameraReversal /> : <MoveGoods />}
      </a.button>
    </div>
  );
};

export default CameraModeButton;
