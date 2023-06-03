import { useSpring, a, config } from "@react-spring/web";
import { useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import useSaidanStore from "@/stores/saidanStore";
import AddItemTutorial from "./AddItemTutorial";
import ReadyTutorial from "./ReadyTutorial";
import SelectItemTutorial from "./SelectItemTutorial";
import SkipButton from "./SkipButton";

const BagTutorial = () => {
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase);
  const canTutorialProceed = useSaidanStore(
    (state) => state.canTutorialProceed
  );
  const setCanTutorialProceed = useSaidanStore(
    (state) => state.setCanTutorialProceed
  );
  const proceedTutorial = useSaidanStore((state) => state.proceedTutorial);
  const skipTutorial = useSaidanStore((state) => state.skipTutorial);

  const { innerHeight } = useWindowSize();
  const [isSkip, setIsSkip] = useState(false);
  const [active, setActive] = useState(true);
  const { bgOpacity } = useSpring({
    from: { bgOpacity: active ? 0 : 1 },
    to: { bgOpacity: active ? 1 : 0 },
    delay: active ? 500 : 0,
    config: config.stiff,
    onResolve: () => {
      if (active) {
        setCanTutorialProceed(true);
      } else if (isSkip) {
        skipTutorial();
      } else {
        proceedTutorial();
      }
    },
  });

  const handleClick = () => {
    if (tutorialPhase === "READY") {
      if (!canTutorialProceed) return;

      setActive(!active);
    }
  };
  const handleSkipClick = () => {
    setIsSkip(true);
    setActive(false);
  };

  return (
    <a.div
      className="saidan-tutorial-bag-container"
      style={{ opacity: bgOpacity }}
      onClick={handleClick}
    >
      <SkipButton onClick={handleSkipClick} />
      {tutorialPhase === "SELECT_ITEM" && <SelectItemTutorial />};
      {tutorialPhase === "ADD_ITEM" && <AddItemTutorial />}
      {tutorialPhase === "READY" && <ReadyTutorial />};
    </a.div>
  );
};

export default BagTutorial;
