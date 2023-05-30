import { useEffect, useState } from "react";
import useWindowSize from "./useWindowSize";

type PlaneSize = {
  innerWidth: number;
  innerHeight: number;
  planeWidth: number;
  planeHeight: number;
  isWideMode: boolean;
  devicePixelRatio: number;
  isSet: boolean;
};

const useHomePlaneSize = () => {
  const { innerWidth, innerHeight, devicePixelRatio } = useWindowSize();
  const [planeSize, setPlaneSize] = useState<PlaneSize>({
    innerWidth,
    innerHeight,
    planeWidth: 0,
    planeHeight: 0,
    isWideMode: false,
    devicePixelRatio: 0,
    isSet: false,
  });

  useEffect(() => {
    if (innerWidth === 0 && innerHeight === 0) {
      return;
    }
    // sm/pc bunki
    let h = 0;
    let w = 0;
    let wide = false;
    if (innerWidth > 520) {
      // pc
      const pcRatio = 1920 / 1080;
      if (innerWidth / innerHeight > pcRatio) {
        w = innerWidth;
        h = w / pcRatio;
      } else {
        h = innerHeight;
        w = h * pcRatio;
      }
      wide = true;
    } else {
      // sm
      const spRatio = 430 / 932;
      if (innerWidth / innerHeight < spRatio) {
        h = innerHeight;
        w = h * spRatio;
      } else {
        w = innerWidth;
        h = w / spRatio;
      }
      wide = false;
    }
    setPlaneSize({
      innerWidth,
      innerHeight,
      planeWidth: w,
      planeHeight: h,
      isWideMode: wide,
      devicePixelRatio,
      isSet: true,
    });
  }, [innerWidth, innerHeight]);

  return planeSize;
};

export default useHomePlaneSize;
