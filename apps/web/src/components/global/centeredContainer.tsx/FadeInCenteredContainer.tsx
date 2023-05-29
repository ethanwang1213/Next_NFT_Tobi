import { useState, ReactNode } from "react";
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
 * （未使用）
 * フェードイン表示のCenteredContainer
 * @param0
 * @returns
 */
const FadeInCenteredContainer: React.FC<Props> = ({
  outerClassName,
  innerClassName,
  aspectWidth,
  aspectHeight,
  widthRate,
  heightRate,
  children,
  closeMethod,
}) => {
  const [active, setActive] = useState(true);
  const { opacity } = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: active ? 1 : 0,
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
        innerSpringValue={{}}
        setSpringActive={(b) => setActive(b)}
      >
        {children}
      </CenteredContainer>
  );
};

export default FadeInCenteredContainer;
