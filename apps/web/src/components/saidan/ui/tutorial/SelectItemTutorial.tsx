import { useSpring, a, config } from "@react-spring/web";
import { shallow } from "zustand/shallow";
import useSaidanStore from "@/stores/saidanStore";

const SelectItemTutorial = () => {
  const canTutorialProceed = useSaidanStore(
    (state) => state.canTutorialProceed
  );
  const proceedTutorial = useSaidanStore((state) => state.proceedTutorial);

  const [{ textOpacity }, api] = useSpring(
    () => ({
      from: { textOpacity: 1 },
      to: { textOpacity: 0 },
      config: config.stiff,
      pause: true,
      onResolve: () => {
        proceedTutorial();
      },
    }),
    []
  );

  const handleClick = () => {
    if (!canTutorialProceed) return;
    api.resume();
    api.start();
  };

  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="saidan-tutorial-selectitem-container-outer"
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <a.div
        className="saidan-tutorial-selectitem-container-inner"
        style={{ opacity: textOpacity }}
      >
        <div className="saidan-tutorial-selectitem-text">
          追加されている
          <br className="saidan-tutorial-selectitem-br" />
          アイテムをタップすると
          <br />
          部屋に配置できます。
        </div>
      </a.div>
    </div>
  );
};

export default SelectItemTutorial;
