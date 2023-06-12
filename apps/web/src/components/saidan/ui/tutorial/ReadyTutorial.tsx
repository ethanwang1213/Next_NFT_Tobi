import { useSpring, a, config } from "@react-spring/web";

const ReadyTutorial = () => {
  const { textOpacity } = useSpring({
    from: { textOpacity: 0 },
    to: { textOpacity: 1 },
    config: config.stiff,
  });

  return (
    <div className="saidan-tutorial-ready-container-outer">
      <a.div
        className="saidan-tutorial-ready-container-inner"
        style={{ opacity: textOpacity }}
      >
        <p className="saidan-tutorial-ready-text">
          実際にグッズを
          <br className="saidan-tutorial-ready-br" />
          作ってみましょう！
        </p>
      </a.div>
    </div>
  );
};

export default ReadyTutorial;
