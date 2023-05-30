import { useEffect, useState } from "react";
import isiOS from "@/methods/isiOS";
import isMobile from "@/methods/isMobile";

const useWindowOrientation = () => {
  const [orientationData, setOrientationData] = useState({
    isLandscape: false,
  });

  useEffect(() => {
    if (isiOS()) {
      if (typeof window === "undefined") {
        return () => {};
      }
    } else if (typeof screen === "undefined") {
      return () => {};
    }
    const handleOrientationChange = () => {
      if (!isMobile()) {
        setOrientationData({
          isLandscape: false,
        });
        return;
      }
      if (isiOS()) {
        setOrientationData({ isLandscape: window.orientation !== 0 });
      } else {
        setOrientationData({
          isLandscape:
            screen.orientation.type !== "portrait-primary" &&
            screen.orientation.type !== "portrait-secondary",
        });
      }
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    handleOrientationChange();
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);
  return orientationData;
};

export default useWindowOrientation;
