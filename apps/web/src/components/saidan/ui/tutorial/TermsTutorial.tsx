import { useSpring, a, config } from "@react-spring/web";
import { useState } from "react";
import useSaidanStore from "@/stores/saidanStore";
import SkipButton from "./SkipButton";

/**
 * 注意書きを表示するチュートリアルのコンポーネント
 * @returns 
 */
const TermsTutorial = () => {
  const canTutorialProceed = useSaidanStore(
    (state) => state.canTutorialProceed
  );
  const setCanTutorialProceed = useSaidanStore(
    (state) => state.setCanTutorialProceed
  );
  const proceedTutorial = useSaidanStore((state) => state.proceedTutorial);
  const skipTutorial = useSaidanStore((state) => state.skipTutorial);
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase)

  const [isSkip, setIsSkip] = useState(false);
  const [active, setActive] = useState(true);
  const { opacity } = useSpring({
    from: { opacity: 1 },
    to: { opacity: active ? 1 : 0 },
    delay: 0,
    immediate: active,
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

  const { textOpacity } = useSpring({
    from: { textOpacity: 0 },
    to: { textOpacity: 1 },
    delay: 500,
    config: config.stiff,
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

  return (
    <a.div
      className="saidan-tutorial-title-container-outer"
      style={{ opacity }}
      onClick={handleClick}
    >
      <SkipButton onClick={handleSkipClick} />
      <a.div 
        className="saidan-tutorial-title-container-inner"
        style={{ opacity: textOpacity }}
      >
        <h2 
          className="saidan-tutorial-terms-title"
        >注意</h2>
        <div className="saidan-tutorial-terms-text-container">
          <p className="saidan-tutorial-terms-text">
            このページではデジタルグッズを
            <br />
            作る体験と飾る体験をしていただけます。
          </p>
          <p className="saidan-tutorial-terms-text">
            このデモで行う体験はすべてオフチェーンで行われ、
            <br />
            実際にデジタルグッズをNFTにするものではありません。
          </p>
          <p className="saidan-tutorial-terms-text">
            デジタルグッズ作成体験をする際、
            <br />
            利用規約がございますので、必ずご確認ください。
          </p>
        </div>
      </a.div>
    </a.div>
  );
};

export default TermsTutorial;
