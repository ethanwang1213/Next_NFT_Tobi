import { useRef, useEffect } from "react";

const useIntervalBySec = (callback: () => void, sec: number) => {
  const callbackRef = useRef<() => void>(callback);
  useEffect(() => {
    callbackRef.current = callback; // 新しいcallbackをrefに格納！
  }, [callback]);

  useEffect(() => {
    const tick = () => { callbackRef.current() }
    const id = setInterval(tick, sec * 1000);
    return () => {
      clearInterval(id);
    };
  }, []);// refはミュータブルなので依存配列に含めなくてもよい
};

export default useIntervalBySec