import { useSpring, a, config } from "@react-spring/web";
import { useState } from "react";
import { shallow } from "zustand/shallow";
import useSaidanStore from "@/stores/saidanStore";

const AddItemTutorial = () => {
  const canTutorialProceed = useSaidanStore(
    (state) => state.canTutorialProceed
  );
  const setCanTutorialProceed = useSaidanStore(
    (state) => state.setCanTutorialProceed
  );
  const proceedTutorial = useSaidanStore((state) => state.proceedTutorial);
  const setIsSpotted = useSaidanStore((state) => state.setIsSpotted);

  const [active, setActive] = useState(true);
  const { textOpacity } = useSpring({
    from: { textOpacity: 0 },
    to: { textOpacity: active ? 1 : 0 },
    delay: active ? 200 : 0,
    config: config.stiff,
    onResolve: () => {
      if (active) {
        setCanTutorialProceed(true);
      } else {
        proceedTutorial();
      }
    },
  });

  const handleClick = () => {
    if (canTutorialProceed) {
      setActive(false);
      setIsSpotted(false);
    }
  };

  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="saidan-tutorial-additem-container-outer"
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <a.div
        className="saidan-tutorial-additem-container-inner"
        style={{ opacity: textOpacity }}
      >
        <div className="saidan-tutorial-additem-text">
          追加したい場合は
          <br />
          こちらのアイコンから
          <br className="saidan-tutorial-additem-br" />
          <span className="saidan-tutorial-additem-span"> </span>
          簡単に作成できます。
        </div>
      </a.div>
    </div>
  );
};

export default AddItemTutorial;
