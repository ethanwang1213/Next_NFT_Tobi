import { useState, ReactNode } from "react";
import { useWindowSize } from "ui";
import { config, useSpring } from "@react-spring/web";
import CenteredContainer from "./CenteredContainer";

type Props = {
  outerClassName: string;
  innerClassName: string;
  aspectWidth: number;
  aspectHeight: number;
  widthRate: number;
  heightRate: number;
  children: ReactNode;
  closeMethod: () => void;
};

/**
 * スライドアップ表示のCenteredContainer
 * @param0
 * @returns
 */
const SlideUpCenteredContainer: React.FC<Props> = ({
  outerClassName,
  innerClassName,
  aspectWidth,
  aspectHeight,
  widthRate,
  heightRate,
  children,
  closeMethod,
}) => {
  const { displayHeight } = useWindowSize();

  const [active, setActive] = useState(true);
  const { opacity, y } = useSpring({
    from: {
      opacity: 0,
      y: displayHeight,
    },
    to: {
      opacity: active ? 1 : 0,
      y: active ? 0 : displayHeight,
    },
    config: config.default,
    onResolve: () => {
      if (!active) {
        closeMethod();
      }
    },
  });

  return (
    <CenteredContainer
      outerClassName={outerClassName}
      innerClassName={innerClassName}
      aspectWidth={aspectWidth}
      aspectHeight={aspectHeight}
      widthRate={widthRate}
      heightRate={heightRate}
      outerSpringValue={{ opacity }}
      innerSpringValue={{ y }}
      setSpringActive={(b) => setActive(b)}
    >
      {children}
    </CenteredContainer>
  );
};

export default SlideUpCenteredContainer;
