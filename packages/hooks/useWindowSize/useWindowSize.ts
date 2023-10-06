import { useEffect, useState } from "react";
import windowSizeData from "./data/windowSizeData.json";

type HookType = () => {
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
  screenWidth: number;
  screenHeight: number;
  displayWidth: number; // 描画領域の幅
  displayHeight: number; // 描画領域の高さ
  devicePixelRatio: number;
  isWide: boolean;
  isVeryWide: boolean;
};

export const useWindowSize: HookType = () => {
  const [windowSize, setWindowSize] = useState({
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    displayWidth: 0, // 描画領域の幅
    displayHeight: 0, // 描画領域の高さ
    devicePixelRatio: 0,
    isWide: false,
    isVeryWide: false,
  });

  const { mediaBorder, pcWidth, pcHeight } = windowSizeData;

  // useLayoutEffect(() => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return () => { };
    }
    const handleResize = () => {
      const isVeryWide = window.innerWidth > mediaBorder;
      // const displayWidth = isVeryWide ? pcWidth : window.innerWidth;
      const displayWidth = window.innerWidth;
      // const displayHeight = isVeryWide ? pcHeight : window.innerHeight;
      const displayHeight = window.innerHeight;
      setWindowSize({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        screenWidth: screen.width,
        screenHeight: screen.height,
        displayWidth,
        displayHeight,
        devicePixelRatio: window.devicePixelRatio,
        // isWide: window.innerWidth > 520,
        isWide: displayWidth >= 520,
        isVeryWide,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  return windowSize;
};
