import { useRef, useEffect, useState } from "react";

export const useIntervalBySec = (callback: () => void, sec: number) => {
  const [paused, setPaused] = useState(true);
  const [intervalId, setIntervalId] = useState(-1);

  const callbackRef = useRef<() => void>(callback);
  useEffect(() => {
    callbackRef.current = callback; // 新しいcallbackをrefに格納！
  }, [callback]);

  useEffect(() => {
    console.log(paused);
    if (paused) {
      if (intervalId !== -1) {
        window.clearInterval(intervalId);
        setIntervalId(-1);
      }
      return;
    }

    const tick = () => {
      callbackRef.current();
    };
    const id = window.setInterval(tick, sec * 1000);
    setIntervalId(id);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [paused]); // refはミュータブルなので依存配列に含めなくてもよい

  return { paused, setPaused };
};
