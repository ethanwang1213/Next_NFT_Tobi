import { animated, useSpring } from "@react-spring/web";
import { RefObject, useMemo } from "react";
import { useWindowSize } from "ui";
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
  const selectItem = useSaidanStore((state) => state.selectItem);

  const { displayWidth } = useWindowSize();

  const { otherSpring } = useSpring({
    otherSpring: Number(isOtherOpen),
    config: {
      tension: 300,
      friction: 40,
    },
  });
  const gap = useMemo(
    () => (displayWidth > RESPONSIVE_BORDER ? 10 : 4),
    [displayWidth]
  );
  const btnSize = () => (displayWidth > RESPONSIVE_BORDER ? 90 : 45);
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
            if (!canvasRef.current) return;
            selectItem("");
            setTimeout(() => {
              openScreenShotResult();
              saveStates();
              closeOther();
            }, 50);
          }}
        >
          <Download className="w-full h-full" />
        </FunctionButton>
      </animated.div>
      <div style={{ translate: 0, scale: 1 }}>
        <FunctionButton
          onClick={() => (isOtherOpen ? closeOther() : openOther())}
        >
          <Other className="w-full h-[45px] min-h-[45px] tab:h-full" />
        </FunctionButton>
      </div>
    </div>
  );
};

export default OtherButton;
