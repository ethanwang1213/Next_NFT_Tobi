import { animated, useSpring } from "@react-spring/web";
import { RefObject } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import isiOS from "@/methods/isiOS";
import { RESPONSIVE_BORDER } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";
import Tutorial from "@/../public/saidan/saidan-ui/tutorial.svg";
import Download from "@/../public/saidan/saidan-ui/download.svg";
import Other from "@/../public/saidan/saidan-ui/other.svg";
import FunctionButton from "./FunctionButton";

type Props = {
  canvasRef: RefObject<HTMLCanvasElement>;
};

const OtherButton = ({ canvasRef }: Props) => {
  const restartTutorial = useSaidanStore((state) => state.restartTutorial);
  const isOtherOpen = useSaidanStore((state) => state.isOtherOpen);
  const openOther = useSaidanStore((state) => state.openOther);
  const closeOther = useSaidanStore((state) => state.closeOther);
  const openScreenShotResult = useSaidanStore(
    (state) => state.openScreenShotResult
  );
  const saveStates = useSaidanStore((state) => state.saveStates);

  const { displayWidth } = useWindowSize();

  const { otherSpring } = useSpring({
    otherSpring: Number(isOtherOpen),
    config: {
      tension: 300,
      friction: 40,
    },
  });
  const gap = 10;
  const btnSize = () => (displayWidth > RESPONSIVE_BORDER ? 90 : 65);
  const y0 = otherSpring.to([0, 1], [btnSize(), -gap]);
  const y1 = otherSpring.to([0, 1], [btnSize() * 2, -gap * 2]);
  // const y2 = otherSpring.to([0, 1], [btnSize() * 3, -gap * 3]);
  const scale = otherSpring.to([0, 1], [0.3, 1]);

  const handleRestartClicked = () => {
    restartTutorial();
    closeOther();
  };

  return (
    <div className="ui-btn-bottom ui-btn-other-container ">
      <animated.div style={{ translateY: y1, scale }}>
        <FunctionButton onClick={handleRestartClicked}>
          <Tutorial className="w-full h-full" />
        </FunctionButton>
      </animated.div>
      <animated.div style={{ translateY: y0, scale }}>
        <FunctionButton
          onClick={() => {
            // ios以外
            // スクショ完了
            if (!canvasRef.current) {
              // スクショに失敗しました
              return;
            }
            if (!isiOS()) {
              const saveA = document.createElement("a");
              saveA.href = canvasRef.current.toDataURL();
              saveA.download = "tobiratory_saidan.png";
              saveA.click();
            }

            openScreenShotResult();
            saveStates();
            closeOther();
          }}
        >
          <Download className="w-full h-full" />
        </FunctionButton>
      </animated.div>
      <div style={{ translate: 0, scale: 1 }}>
        <FunctionButton
          onClick={() => (isOtherOpen ? closeOther() : openOther())}
        >
          <Other className="w-full h-full" />
        </FunctionButton>
      </div>
    </div>
  );
};

export default OtherButton;
