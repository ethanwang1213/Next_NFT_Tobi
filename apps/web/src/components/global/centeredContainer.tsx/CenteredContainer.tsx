import { useState, useLayoutEffect, ReactNode } from "react";
import { useWindowSize } from "ui";
import { a, SpringValue } from "@react-spring/web";
import CloseResultButton from "../../saidan/ui/screenShotResult/CloseResultButton";

type Props = {
  outerClassName: string;
  innerClassName: string;
  aspectWidth: number;
  aspectHeight: number;
  widthRate: number;
  heightRate: number;
  children: ReactNode;

  outerSpringValue: { [v: string | symbol]: SpringValue<number> };
  innerSpringValue: { [v: string | symbol]: SpringValue<number> };
  setSpringActive: (b: boolean) => void;
};

/**
 * アスペクトを保ったまま中央ぞろえできるコンテナコンポーネント
 * displayWidth displayHeightを用いて実装している。
 * @param0
 * @returns
 */
const CenteredContainer: React.FC<Props> = ({
  outerClassName,
  innerClassName,
  aspectWidth,
  aspectHeight,
  widthRate,
  heightRate,
  children,

  outerSpringValue,
  innerSpringValue,
  setSpringActive,
}) => {
  const { displayWidth, displayHeight } = useWindowSize();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // 設定された幅・高さの最大値に対して、
  // objectFit:containと同様のwidth, heightを得る
  useLayoutEffect(() => {
    const maxWidth = displayWidth * widthRate;
    const maxHeight = displayHeight * heightRate;
    const aspect = aspectWidth / aspectHeight;
    let w = maxWidth;
    let h = maxWidth / aspect;
    if (maxWidth / maxHeight > aspect) {
      w = maxHeight * aspect;
      h = maxHeight;
    }
    setWidth(w);
    setHeight(h);
  }, [displayWidth, displayHeight]);

  return (
    <a.div
      className={`absolute w-full h-full flex justify-center grid content-center bottom-0 ${outerClassName}`}
      style={{ ...outerSpringValue }}
    >
      <a.div
        className={`relative ${innerClassName}`}
        style={{ width, height, ...innerSpringValue }}
      >
        <CloseResultButton
          isWhite={false}
          onClick={() => setSpringActive(false)}
        />
        {children}
      </a.div>
    </a.div>
  );
};

export default CenteredContainer;
