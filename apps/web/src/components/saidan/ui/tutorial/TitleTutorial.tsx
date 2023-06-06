import { useSpring, a, config } from "@react-spring/web";
import { useState, useEffect } from "react";
import useSaidanStore from "@/stores/saidanStore";
import { useAuth } from "@/context/auth";
import SkipButton from "./SkipButton";

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
    to: { opacity: active ? 1 : 0 },
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
    if (canTutorialProceed) {
      setActive(false);
    }
  };
  const handleSkipClick = () => {
    setIsSkip(true);
    setActive(false);
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
      <SkipButton onClick={handleSkipClick} />
      <div className="saidan-tutorial-title-container-inner">
        <div className="saidan-tutorial-title-subtitle">お試し版</div>
        <div className="saidan-tutorial-title-title">
          あなただけのSAIDANを作ろう
        </div>
        <div>
          <div className="saidan-tutorial-title-text">
            ここで体験・作成するものは
            <br className="saidan-tutorial-title-br" />
            本サービスとは異なる場合がございます。
            <br />
            あらかじめご了承ください。
          </div>
        </div>
      </div>
    </a.div>
  );
};

export default TitleTutorial;
