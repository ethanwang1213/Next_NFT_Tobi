import useWindowSize from "@/hooks/useWindowSize";
import { useMemo } from "react";
import { UAParser } from "ua-parser-js";

/**
 * スマホで横向き表示にしているかを判定する
 * user agentを使用してスマホであるかを判定している
 * 
 * orientationchangeによる方法は、
 * iphone X Pro(?)で不具合が発生するようで、
 * 手元になくデバッグが厄介なので逃げ策を採っている。
 * @param displayWidth 画面の幅
 * @param displayHeight 画面の高さ
 * @returns 
 */
const isSpLandscape = (window: Window, displayWidth: number, displayHeight: number) => {
  if (!window) {
    return false;
  }
  const uaParserResult = UAParser(window.navigator.userAgent);
  return !!uaParserResult
    && uaParserResult.device.type === "mobile"
    && displayWidth > displayHeight;
};

export default isSpLandscape;