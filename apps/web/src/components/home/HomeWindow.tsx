import useHomeStore from "@/stores/homeStore";
import { useGesture } from "@use-gesture/react";
import HomeCanvas from "./canvas/HomeCanvas";
import ForbidLandcape from "./ui/ForbidLandcape";
import HomeTextContainer from "./ui/HomeTextContainer";
import { useEffect } from "react";

type Props = {};

const HomeWindow: React.FC<Props> = ({}) => {
  const backPhase = useHomeStore((state) => state.backPhase);
  const progressPhase = useHomeStore((state) => state.progressPhase);
  const canInteract = useHomeStore((state) => state.canInteract);
  const homePhase = useHomeStore((state) => state.homePhase);
  const canProgress = useHomeStore((state) => state.canProgress);

  // スクロールジェスチャーの実装
  const bind = useGesture(
    {
      onWheel: (state) => {
        if (!canInteract) return;

        const dy = state.delta[1];
        if (dy < 0) {
          const backed = backPhase();
          if (backed) {
            window.location.hash = "#";
          }
        } else if (dy > 0) {
          const progressed = progressPhase();
          if (progressed) {
            window.location.hash = "#";
          }
        }
      },

      onDrag: (state) => {
        if (!canInteract) return;

        if (state.tap) return;
        const dy = state.delta[1];
        if (dy > 0) {
          const backed = backPhase();
          if (backed) {
            window.location.hash = "#";
          }
        } else if (dy < 0) {
          const progressed = progressPhase();
          if (progressed) {
            window.location.hash = "#";
          }
        }
      },
    },
    { drag: { pointer: { buttons: [1] }, filterTaps: true, tapsThreshold: 10 } }
  );

  useEffect(() => {
    console.log(canInteract, homePhase, canProgress);
  }, [canInteract, homePhase, canProgress]);

  return (
    <>
      <div className="relative w-full h-full touch-none" {...bind()}>
        <HomeCanvas />
        <HomeTextContainer />
      </div>
      <ForbidLandcape />
    </>
  );
};

export default HomeWindow;
