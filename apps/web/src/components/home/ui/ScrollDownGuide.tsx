import { a, SpringValue } from "@react-spring/web";
import ScrollDownIcon from "@/../public/home/scrolldown.svg";
import useHomeStore from "@/stores/homeStore";

type Props = {
  t: SpringValue<number>;
};

// TOPでスクロールダウンのガイドを表示するコンポーネント
const ScrollDownGuide: React.FC<Props> = ({ t }) => {
  const progressPhase = useHomeStore((state) => state.progressPhase);

  return (
    <a.button
      className="home-scrolldown-container"
      style={{
        opacity: t,
        bottom: t.to((v) => (1 - v) * 6),
        pointerEvents: t.to((v) => (v >= 0.8 ? "auto" : "none")),
      }}
      onClick={progressPhase}
    >
      <ScrollDownIcon className="home-scrolldown-icon" />
    </a.button>
  );
};

export default ScrollDownGuide;
