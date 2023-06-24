import { useSpring, a, config } from "@react-spring/web";
import { useState, useEffect } from "react";
import useSaidanStore from "@/stores/saidanStore";
import { useAuth } from "@/context/auth";

let isSkipWhenLoad = false;

const TitleTutorial = () => {
  const auth = useAuth();

  const canTutorialProceed = useSaidanStore(
    (state) => state.canTutorialProceed
  );
  const setCanTutorialProceed = useSaidanStore(
    (state) => state.setCanTutorialProceed
  );
  const proceedTutorial = useSaidanStore((state) => state.proceedTutorial);
  const skipTutorial = useSaidanStore((state) => state.skipTutorial);

  const [isSkip, setIsSkip] = useState(false);
  const [active, setActive] = useState(true);
  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: !active && isSkip ?  0 : 1  },
    delay: !active && isSkip ? 0 : 500,
    config: config.stiff,
    onResolve: () => {
      if (active) {
        setCanTutorialProceed(true);
      } else if (isSkip) {
        skipTutorial();
      }
    },
  });

  const { textOpacity } = useSpring({
    from: { textOpacity: 1 },
    to: { textOpacity: active ? 1 : 0 },
    delay: active ? 500 : 0,
    config: config.stiff,
    onResolve: () => {
      if (!active) {
        proceedTutorial();
      }
    },
  });

  const handleClick = () => {
    if (canTutorialProceed) {
      setActive(false);
    }
  };

  function skipTutorialWhenLoad() {
    if (auth?.isSkipTutorial && !isSkipWhenLoad) {
      setIsSkip(true);
      setActive(false);
      isSkipWhenLoad = true;
    }
  }
  useEffect(skipTutorialWhenLoad, [auth]);

  return (
    <a.div
      className="saidan-tutorial-title-container-outer"
      style={{ opacity }}
      onClick={handleClick}
    >
      <a.div 
        className="saidan-tutorial-title-container-inner" 
        style={{ opacity: textOpacity }}
      >
        <p className="saidan-tutorial-title-subtitle">お試し版</p>
        <h1 className="saidan-tutorial-title-title">
          あなただけのSAIDANを作ろう
        </h1>
      </a.div>
    </a.div>
  );
};

export default TitleTutorial;
