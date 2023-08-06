import { useEffect } from "react";
import useSaidanStore from "@/stores/saidanStore";
import BagTutorial from "./BagTutorial";
import OpenBagTutorial from "./OpenBagTutorial";
import TitleTutorial from "./TitleTutorial";
import ZoomUpTutorial from "./ZoomUpTutorial";
import TermsTutorial from "./TermsTutorial";
import { useShowBurger } from "ui/contexts/menu/showBurger";

/**
 * saidanページのチュートリアルを表示するコンポーネント
 * @returns
 */
const SaidanTutorial = () => {
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase);
  const setCanTutorialProceed = useSaidanStore(
    (state) => state.setCanTutorialProceed
  );

  useEffect(() => {
    if (tutorialPhase === "ZOOM_UP" || tutorialPhase === "OPEN_BAG") return;
    setCanTutorialProceed(false);
  }, [tutorialPhase]);

  const { setShowBurger } = useShowBurger();
  useEffect(() => {
    setShowBurger(tutorialPhase === "TITLE" || tutorialPhase === "END");
    return () => {
      setShowBurger(true);
    };
  }, [tutorialPhase]);

  return (
    <>
      {(() => {
        if (tutorialPhase === "TITLE") return <TitleTutorial />;
        if (tutorialPhase === "TERMS") return <TermsTutorial />;
        if (tutorialPhase === "ZOOM_UP") return <ZoomUpTutorial />;
        if (tutorialPhase === "OPEN_BAG") return <OpenBagTutorial />;
        if (
          tutorialPhase === "SELECT_ITEM" ||
          tutorialPhase === "ADD_ITEM" ||
          tutorialPhase === "READY"
        ) {
          return <BagTutorial />;
        }
        return <div />;
      })()}
    </>
  );
};

export default SaidanTutorial;
