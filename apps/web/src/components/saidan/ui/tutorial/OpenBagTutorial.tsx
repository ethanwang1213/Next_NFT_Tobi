import { useSpring, a, config } from "@react-spring/web";
import { useState } from "react";
import { shallow } from "zustand/shallow";
import useWindowSize from "@/hooks/useWindowSize";
import useSaidanStore from "@/stores/saidanStore";
import SkipButton from "./SkipButton";

const OpenBagTutorial = () => {
  const skipTutorial = useSaidanStore((state) => state.skipTutorial);

  const { displayWidth, displayHeight, isWide } = useWindowSize();
  const { t, ...props } = useSpring({
    from: {
      t: 0,
      x: 0,
      y: 0,
      width: displayWidth,
      rx: 0,
      ry: 0,
    },
    to: {
      t: 1,
      x: isWide ? displayWidth / 2.0 - 65 : displayWidth / 2.0 - 58,
      y: isWide ? displayHeight - 162 : displayHeight - 116,
      width: isWide ? 130 : 115,
      // height: displayWidth > RESPONSIVE_BORDER ? 130 : 115,
      rx: isWide ? 30 : 20,
      ry: isWide ? 30 : 20,
    },
    config: {
      tension: 400,
      friction: 50,
    },
    delay: 200,
  });
  const rectHeight = t.to(
    [0, 0.5, 1],
    [
      displayHeight,
      isWide ? displayHeight - 130 : displayHeight - 110,
      isWide ? 130 : 115,
    ]
  );

  const [isSkip, setIsSkip] = useState(false);
  const [active, setActive] = useState(true);
  const { opacity } = useSpring({
    from: { opacity: 1 },
    to: { opacity: active ? 1 : 0 },
    delay: active ? 500 : 0,
    config: config.stiff,
    onResolve: () => {
      if (isSkip) {
        skipTutorial();
      }
    },
  });
  const handleSkipClick = () => {
    setIsSkip(true);
    setActive(false);
  };

  return (
    <a.div className="saidan-tutorial-openbag" style={{ opacity }}>
      <SkipButton onClick={handleSkipClick} />
      <svg role="none" className="w-full h-full">
        <mask id="cut">
          <rect
            x={0}
            y={0}
            width={displayWidth}
            height={displayHeight}
            fill="white"
          />
          <a.rect {...props} height={rectHeight} fill="black" />
        </mask>
        <g mask="url(#cut)">
          <rect
            x={0}
            y={0}
            width={displayWidth}
            height={displayHeight}
            fill="rgba(0, 0, 0, 0.7)"
          />
          <a.rect
            {...props}
            height={rectHeight}
            fill="white"
            // stroke="cyan"
            strokeWidth={4}
          />
        </g>
      </svg>
    </a.div>
  );
};

export default OpenBagTutorial;
