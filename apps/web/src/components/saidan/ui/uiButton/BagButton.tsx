import { useEffect, useState } from "react";
import useSaidanStore from "@/stores/saidanStore";
import BagIcon from "@/../public/saidan/saidan-ui/bag2.svg";

const BagButton = () => {
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase);
  const proceedTutorial = useSaidanStore((state) => state.proceedTutorial);
  const openBag = useSaidanStore((state) => state.openBag);
  const isNearByBag = useSaidanStore((state) => state.isNearByBag);
  const closeOther = useSaidanStore((state) => state.closeOther);
  const moveState = useSaidanStore((state) => state.moveState);

  const handleClick = () => {
    openBag();
    closeOther();
    if (tutorialPhase === "OPEN_BAG") {
      proceedTutorial();
    }
  };

  const [bgColor, setBgColor] = useState("#343434");
  const [scale, setScale] = useState(1);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (moveState === "NONE") {
      if (isHover) {
        // ホバーカラー
        setBgColor("#343434");
      } else {
        // 通常時
        setBgColor("#414142");
      }
      setScale(1.0);
    } else if (moveState === "DIRECT_MOVING" && isNearByBag) {
      // グッズドラッグ中 バッグにしまえる表示
      setBgColor("#888");
      setScale(1.4);
    } else if (moveState === "DIRECT" || moveState === "DIRECT_MOVING") {
      // グッズドラッグ中 バッグにしまえない表示
      setBgColor("#414142");
      setScale(1.2);
    }
  }, [isNearByBag, moveState, isHover]);

  return (
    <div className="ui-btn-bottom ui-btn-bag-container">
      <button
        type="button"
        className={`ui-btn-bag ${
          tutorialPhase === "OPEN_BAG" ? "z-10" : "z-1"
        }`}
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
        onClick={handleClick}
        style={{
          backgroundColor: bgColor,
          transform: `scale(${scale})`,
          scale,
        }}
      >
        <BagIcon className="w-full h-full" />
      </button>
    </div>
  );
};

export default BagButton;
